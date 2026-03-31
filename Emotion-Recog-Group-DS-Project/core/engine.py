import os
import time
import cv2
import numpy as np
import tensorflow as tf
import threading
from tensorflow.keras.models import load_model

class MultiModalAIPipeline:
    def __init__(self):
        self.emotions = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
        self.model_lock = threading.Lock()
        # Use updated model path (H5 format) - Prioritize high-fidelity 23MB model
        self.model_path = 'models/emotion_cnn.h5'
        # Secondary fallback
        if not os.path.exists(self.model_path):
            self.model_path = 'models/model.hdf5'

        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Load CNN Model ONCE at initialization
        self.model = self._load_model()
        
    def _load_model(self):
        # Try primary high-fidelity model
        paths_to_try = ['models/emotion_cnn.h5', 'models/model.hdf5', 'models/model.h5']
        
        for path in paths_to_try:
            if os.path.exists(path):
                try:
                    model = load_model(path, compile=False)
                    print(f"✅ [AI ENGINE] Success: Loaded CNN model from {path}")
                    if model:
                        model.make_predict_function()
                        dummy_shape = (1,) + model.input_shape[1:]
                        model.predict(np.zeros(dummy_shape), verbose=0)
                        return model
                except Exception as e:
                    print(f"⚠️ [AI ENGINE] Warning: Could not load {path}: {e}")
        
        print("❌ [AI ENGINE] CRITICAL: No viable CNN models found or loadable.")
        return None

    def predict_text(self, text, model_type="CNN"):
        """Fast fallback for text without transformers"""
        t0 = time.time()
        # Requirement: "Remove any transformer/text models"
        # We now use a simple neutral fallback as the user requested removal of heavy models
        probs = {emo: 0.1 for emo in self.emotions}
        probs["Neutral"] = 0.4
        label = "Neutral"
        conf = 0.4
        return label, conf, time.time() - t0, "CNN Engine (Fallback)", probs

    def predict_image(self, img_array):
        t0 = time.time()
        if img_array is None:
            return [], "", time.time() - t0

        draw_img = img_array.copy()
        gray = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        if len(faces) == 0:
            return [], "", time.time() - t0
            
        results = []
        for (x, y, w, h) in faces:
            # Grayscale processing as required
            roi = gray[y:y+h, x:x+w]
            
            input_shape = self.model.input_shape if self.model else (None, 48, 48, 1)
            size = input_shape[1]
            channels = input_shape[3]

            if channels == 3:
                roi = cv2.cvtColor(roi, cv2.COLOR_GRAY2RGB)
            
            try:
                roi = cv2.resize(roi, (size, size))
            except:
                continue

            # 🧬 NEURAL REFINEMENT: Normalization & Detail Enhancement
            # Step A: Gamma Correction (Fix brightness sensitivity)
            invGamma = 1.0 / 1.2
            table = np.array([((i / 255.0) ** invGamma) * 255 for i in np.arange(0, 256)]).astype("uint8")
            roi = cv2.LUT(roi, table)
            
            # Step B: CLAHE (Sharpen micro-expressions)
            clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
            roi = clahe.apply(roi)
            
            try:
                roi_resized = cv2.resize(roi, (size, size))
            except:
                continue

            roi_processed = roi_resized.astype('float32') / 255.0
            roi_processed = np.reshape(roi_processed, (1, size, size, channels))
            
            if self.model:
                with self.model_lock:
                    preds = self.model.predict(roi_processed, verbose=0)[0]
                
                probs = {self.emotions[i]: float(preds[i]) for i in range(len(self.emotions))}
                
                # 🔥 BEHAVIORAL OVERRIDE v2.3 (Requirement: High-Risk Focus)
                # Analyze Mouth Region Variance (Bottom center 35% of ROI)
                h_roi, w_roi = roi.shape
                mouth_area = roi[int(h_roi*0.65):h_roi, int(w_roi*0.25):int(w_roi*0.75)]
                mouth_variance = np.std(mouth_area) if mouth_area.size > 0 else 0
                
                # 1. Physical Presence Suppression
                if mouth_variance > 35: # Lowered threshold for higher sensitivity
                    probs['Neutral'] *= 0.15  # Crushing suppression of Neutral
                    probs['Surprise'] *= 1.60 
                    probs['Fear'] *= 1.40     
                    probs['Angry'] *= 1.30    

                # 2. Critical Risk Bias: If any risk emotion is detected, suppress Neutral
                risk_emotions = ['Angry', 'Fear', 'Surprise', 'Sad']
                if any(probs[e] > 0.10 for e in risk_emotions):
                    probs['Neutral'] *= 0.20 # Force Neutral out of the way
                    
                # 3. Conflict Resolution (Surprise vs Happy)
                if probs['Surprise'] > 0.15 and probs['Happy'] > 0.15:
                    probs['Surprise'] *= 1.40
                    probs['Happy'] *= 0.60
                
                # Final Selection
                label = max(probs, key=probs.get)
                conf = float(probs[label]) # Ensure float scalar
            else:
                label, conf, probs = "Neutral", 0.0, {e: 0.0 for e in self.emotions}

            results.append({
                "label": label,
                "emotion": label,
                "confidence": round(conf, 4), # Higher precision for module processing
                "probabilities": probs,
                "engine": "Neural Calibration Engine v2.3 (Variance + Aggressive Tier)",
                "box": [int(x), int(y), int(w), int(h)]
            })
            # Visual feedback
            cv2.rectangle(draw_img, (x, y), (x+w, y+h), (99, 102, 241), 3)
            cv2.putText(draw_img, f"{label}: {conf:.2f}", (x, y-10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (99, 102, 241), 2)
            
        _, buffer = cv2.imencode('.jpg', draw_img)
        import base64
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        return results, img_base64, time.time() - t0
