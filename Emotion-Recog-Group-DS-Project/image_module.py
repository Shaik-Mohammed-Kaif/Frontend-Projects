import cv2
import numpy as np
import os
import time
import traceback
import threading
from tensorflow.keras.models import load_model
from deepface import DeepFace
from werkzeug.utils import secure_filename

# ===============================
# 1. CORE ENGINE CONFIGURATION
# ===============================
MODEL_PATH = "models/emotion_cnn.h5" # High-accuracy 23MB Model
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = "models/model.hdf5"

# PREDICTION LOCK for thread safety in Flask
model_lock = threading.Lock()

try:
    model = load_model(MODEL_PATH, compile=False)
    print(f"✅ Image Engine: CNN Model loaded from {MODEL_PATH}")
    if model:
        model.make_predict_function()
        dummy_shape = (1,) + model.input_shape[1:]
        model.predict(np.zeros(dummy_shape), verbose=0)
        print("✅ Image Engine: Model warmed up and pre-compiled")
except Exception as e:
    print(f"❌ Image Engine: Model load failed: {e}")
    model = None

# Emotion labels
base_emotions = ['Angry','Disgust','Fear','Happy','Sad','Surprise','Neutral']

# 🌍 WORLD EMOTION SYNTHESIS LABELS
# DeepFace provides basic 7; we map them to premium labels
emotion_mapping = {
    "happy": "Cheerful", "sad": "Melancholic", "angry": "Aggressive",
    "fear": "Anxious", "surprise": "Astonished", "neutral": "Composed",
    "disgust": "Averse"
}

# Face Detection
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

# ===============================
# 2. HYBRID PREDICTION LOGIC
# ===============================
def predict_emotion_hybrid(img_array):
    try:
        t0 = time.time()

        gray = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.2, 6)

        if len(faces) == 0:
            return {
                "status": "success",
                "emotion": "No Face Detected",
                "label": "No Face",
                "confidence": 0,
                "engine": "Passive",
                "probabilities": {},
                "results": []
            }

        label = "Neutral"
        confidence = 0.0
        engine = "None"
        final_probs = {}

        # ✅ FIX: dynamic input size and channels
        input_shape = model.input_shape if model else (None, 48, 48, 1)
        input_size = input_shape[1]
        channels = input_shape[3]

        # Keep largest face (same logic preserved)
        (x, y, w, h) = max(faces, key=lambda f: f[2] * f[3])

        face_roi = gray[y:y+h, x:x+w]
        if channels == 3: # If model expects RGB
            face_roi = cv2.cvtColor(face_roi, cv2.COLOR_GRAY2RGB)

        try:
            face_input = cv2.resize(face_roi, (input_size, input_size))
        except:
            return {"status": "error", "error": "Resize failed"}

        face_input = face_input.astype("float32") / 255.0
        face_input = np.reshape(face_input, (1, input_size, input_size, channels))

        if model:
            with model_lock:
                preds = model.predict(face_input, verbose=0)[0]

            cnn_probs = {
                base_emotions[i]: float(preds[i])
                for i in range(len(base_emotions))
            }

            label_idx = np.argmax(preds)
            label = base_emotions[label_idx]
            confidence = float(preds[label_idx])

            # =========================
            # HYBRID SWITCH & SYNTHESIS
            # =========================
            if confidence < 0.6: # Use DeepFace for better static analysis if CNN is unsure
                try:
                    df = DeepFace.analyze(img_array, actions=['emotion'], enforce_detection=False)
                    if isinstance(df, list): df = df[0]
                    df_emotions = df['emotion']
                    
                    # Core Map
                    final_probs = {emotion_mapping.get(k.lower(), k): round(v/100, 4) for k, v in df_emotions.items()}
                    label = emotion_mapping.get(df['dominant_emotion'].lower(), df['dominant_emotion'])
                    confidence = df_emotions[df['dominant_emotion']] / 100
                    engine = "DeepFace AI (High-Res)"
                except:
                    final_probs = cnn_probs
                    label = label # Fallback to CNN label
                    engine = "CNN Vision Engine"
            else:
                final_probs = cnn_probs
                label = emotion_mapping.get(label.lower(), label)
                engine = "CNN Vision Engine"

            # 🛠️ WORLD EMOTION SYNTHESIS (Requirements: All world emotions)
            # We synthesize complex states from basic probabilities
            if final_probs.get("Cheerful", 0) > 0.4 and final_probs.get("Astonished", 0) > 0.2:
                label = "Excited"
            elif final_probs.get("Aggressive", 0) > 0.3 and final_probs.get("Melancholic", 0) > 0.3:
                label = "Frustrated"
            elif final_probs.get("Composed", 0) > 0.75:
                label = "Calm / Professional"
            elif final_probs.get("Melancholic", 0) > 0.5 and final_probs.get("Anxious", 0) > 0.3:
                label = "Stressed / Anxiety"

        # =========================
        # DRAW PRO HUD
        # =========================
        label_text = str(label).upper() if label else "UNKNOWN"
        color = (241, 102, 99) # Premium Indigo (BGR)
        cv2.rectangle(img_array, (x, y), (x+w, y+h), color, 3)
        cv2.putText(img_array, label_text + f" ({confidence*100:.1f}%)", (x, y-15), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.75, color, 2, cv2.LINE_AA)

        return {
            "status": "success",
            "label": label,
            "emotion": label,
            "confidence": round(confidence, 4),
            "probabilities": final_probs,
            "engine": engine,
            "box": [int(x), int(y), int(w), int(h)],
            "time": f"{time.time() - t0:.3f}s",
            "results": [{
                "label": label,
                "emotion": label,
                "confidence": round(confidence, 4),
                "probabilities": final_probs,
                "engine": engine
            }]
        }

    except Exception as e:
        print(f"❌ Hybrid System Error: {str(e)}")
        return {
            "status": "error",
            "error": str(e),
            "trace": traceback.format_exc()
        }

# ===============================
# 3. UPLOAD HANDLER
# ===============================
def handle_upload(file):
    try:
        UPLOAD_FOLDER = "static/uploads"
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        img = cv2.imread(filepath)
        if img is None:
            return {"status": "error", "error": "Image corruption detected"}

        result = predict_emotion_hybrid(img)

        cv2.imwrite(filepath, img)
        result["image_path"] = filepath

        return result

    except Exception as e:
        return {"status": "error", "error": str(e)}