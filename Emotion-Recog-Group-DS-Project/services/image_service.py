import cv2
import numpy as np
import os
import time
import threading
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename

# ===============================
# 1. MODEL LOADING (SINGLE INSTANCE)
# ===============================
MODEL_PATH = "models/model.hdf5"
EMOTIONS = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]

# Global model variable for singleton-like access
model = None
model_lock = threading.Lock()

def get_model():
    global model
    if model is None:
        if os.path.exists(MODEL_PATH):
            try:
                # Load with compile=False and pre-compile for thread safety
                model = load_model(MODEL_PATH, compile=False)
                model.make_predict_function()
                
                # Warm up
                dummy_shape = (1, 48, 48, 1)
                model.predict(np.zeros(dummy_shape), verbose=0)
                
                print(f"✅ CNN Model loaded successfully from {MODEL_PATH}")
            except Exception as e:
                print(f"❌ Error loading model: {e}")
        else:
            print(f"❌ Model missing at {MODEL_PATH}")
    return model

# Global cascade
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def preprocess_face(face_gray):
    """Prerpare face ROI for CNN input (48x48, normalized)"""
    roi = cv2.resize(face_gray, (48, 48))
    roi = roi.astype("float32") / 255.0
    roi = np.expand_dims(roi, axis=0) # Batch
    roi = np.expand_dims(roi, axis=-1) # Channel
    return roi

def analyze_image_file(file):
    """Processes an uploaded Image Storage object"""
    if not file:
        return {"status": "error", "error": "No file provided"}

    try:
        # Save file
        UPLOAD_FOLDER = "static/uploads"
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # Load with CV2
        img = cv2.imread(filepath)
        if img is None:
            return {"status": "error", "error": "Invalid image format"}

        # Detection logic
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return {
                "status": "success",
                "emotion": "No face detected",
                "confidence": 0.0,
                "image_path": filepath,
                "results": []
            }

        # Largest face
        (x, y, w, h) = max(faces, key=lambda f: f[2] * f[3])
        roi = gray[y:y+h, x:x+w]
        
        cnn = get_model()
        if cnn is None:
            return {"status": "error", "error": "AI model not loaded"}

        processed = preprocess_face(roi)
        with model_lock:
            preds = cnn.predict(processed, verbose=0)[0]
        
        idx = int(np.argmax(preds))
        label = EMOTIONS[idx]
        conf = float(preds[idx])

        # 🔥 NEURAL CALIBRATION (Rerank for Surprise vs Happy)
        try:
            m_y1 = int(roi.shape[0] * 0.60) # Better mouth focus
            mouth_roi = roi[m_y1:, :]
            if mouth_roi.size > 0:
                edges = cv2.Canny(mouth_roi, 30, 100) # Balanced edges
                mouth_activity = np.sum(edges > 0) / edges.size
                
                # SENSITIVE GUARD: 0.08 threshold for wider capture
                # If mouth is active and confidence is low (<50%), re-evaluate Surprise
                surp_idx = EMOTIONS.index("Surprise")
                surp_prob = float(preds[surp_idx])
                
                if mouth_activity > 0.08:
                    if label in ["Happy", "Neutral", "Fear"]:
                        # If Surprise is at least 10% and top is weak (< 50%)
                        if surp_prob > 0.10 and conf < 0.50:
                            label = "Surprise"
                            conf = surp_prob
                        # Strong activity bias (even if Happy is reasonably high)
                        elif surp_prob > 0.20 and mouth_activity > 0.12:
                            label = "Surprise"
                            conf = surp_prob
        except: pass

        # Build clean response
        result = {
            "status": "success",
            "emotion": label,
            "confidence": round(conf, 4),
            "image_path": filepath,
            "label": label,
            "results": [{
                "emotion": label,
                "confidence": round(conf, 4),
                "label": label,
                "probabilities": {EMOTIONS[i]: float(preds[i]) for i in range(len(EMOTIONS))}
            }]
        }
        
        return result

    except Exception as e:
        return {"status": "error", "error": str(e)}

def analyze_image_url(url):
    """Processes image from URL"""
    import urllib.request
    if not url:
        return {"status": "error", "error": "No URL provided"}

    try:
        UPLOAD_FOLDER = "static/uploads"
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        filename = f"url_{int(time.time())}.jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        headers = {'User-Agent': 'Mozilla/5.0'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            with open(filepath, 'wb') as f:
                f.write(response.read())

        img = cv2.imread(filepath)
        if img is None:
            return {"status": "error", "error": "Could not decode image from URL"}

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return {"status": "success", "emotion": "No face detected", "confidence": 0.0, "image_path": filepath, "results": []}

        (x, y, w, h) = max(faces, key=lambda f: f[2] * f[3])
        cnn = get_model()
        if cnn:
            processed = preprocess_face(gray[y:y+h, x:x+w])
            with model_lock:
                preds = cnn.predict(processed, verbose=0)[0]
            idx = int(np.argmax(preds))
            label = EMOTIONS[idx]
            conf = float(preds[idx])

            # 🔥 NEURAL CALIBRATION (Surprise Guard)
            try:
                roi = gray[y:y+h, x:x+w]
                m_y1 = int(roi.shape[0] * 0.65)
                mouth_roi = roi[m_y1:, :]
                if mouth_roi.size > 0:
                    edges = cv2.Canny(mouth_roi, 40, 120)
                    mouth_activity = np.sum(edges > 0) / edges.size
                    
                    # If mouth is wide open (high activity) and original pred was Happy/Neutral
                    if mouth_activity > 0.12 and label in ["Happy", "Neutral"]:
                        surp_idx = EMOTIONS.index("Surprise")
                        if preds[surp_idx] > 0.15:
                            label = "Surprise"
                            conf = float(preds[surp_idx])
            except: pass
            
            result = {
                "status": "success",
                "emotion": label,
                "confidence": round(conf, 4),
                "image_path": filepath,
                "label": label,
                "results": [{
                    "emotion": label,
                    "confidence": round(conf, 4),
                    "probabilities": {EMOTIONS[i]: float(preds[i]) for i in range(len(EMOTIONS))}
                }]
            }
            return result

        return {"status": "error", "error": "Model not loaded"}
    except Exception as e:
        return {"status": "error", "error": str(e)}
