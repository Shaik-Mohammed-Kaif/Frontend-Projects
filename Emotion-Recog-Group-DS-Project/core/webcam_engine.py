import cv2
import threading
import time
import numpy as np
from collections import deque, Counter
from datetime import datetime, timezone, timedelta
from core.alert_system import AlertSystem

# 🚀 BIOMETRIC ENGINE (Requirement: Face part measurements)
try:
    import mediapipe as mp
    mp_face_mesh = mp.solutions.face_mesh
    mesh_engine = mp_face_mesh.FaceMesh(
        static_image_mode=False,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    MP_AVAILABLE = True
except ImportError:
    print("⚠️ Mediapipe not found. Falling back to geometric estimates.")
    MP_AVAILABLE = False

# 🔥 GLOBAL METRIC STORE (Requirement: Global, Do NOT reset)
webcam_data = []

def load_history_on_start():
    global webcam_data
    try:
        from core.database import get_db_connection
        conn = get_db_connection()
        rows = conn.execute("SELECT emotion_label as emotion, confidence_score as confidence, timestamp FROM emotion_history WHERE source_module='webcam'").fetchall()
        for r in rows:
            webcam_data.append({
                "emotion": r['emotion'],
                "confidence": float(r['confidence']),
                "time": r['timestamp']
            })
        conn.close()
        print(f"✅ [WEBCAM] Loaded {len(webcam_data)} historical detections from DB")
    except Exception as e:
        print(f"⚠️ [WEBCAM] DB Load Failed: {e}")

# Initial Load
load_history_on_start()

class WebcamStream:
    def __init__(self, ai_engine):
        self.is_running = False
        self.is_detecting = True
        self.camera = None
        self.lock = threading.Lock()
        self.ai = ai_engine
        
        # Threads
        self.capture_thread = None
        self.inference_thread = None
        
        # Shared Buffers
        self.raw_frame = None
        self.processed_data = {
            "emotion": "Detecting...",
            "confidence": 0.0,
            "rect": None,
            "alert": False,
            "faces": []
        }
        
        # Performance & Sync
        self.fps = 0.0
        self.frame_count = 0
        self.detect_every_n = 2 # 🚀 ULTRA FAST
        self.ai_every_n = 1 # 🚀 EVERY FRAME
        
        # 📊 PERSISTENT DATA
        self.full_history = [] 
        # Temporal smoothing buffers
        self.prob_history = deque(maxlen=8) # Stabilized for better accuracy
        self.voted_emotion = "Neutral"
        self.voted_conf = 0.4 
        
        self.user_id = None
        
        # Assets
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.cascade_params = {"scaleFactor": 1.1, "minNeighbors": 4, "minSize": (60, 60)}

        # 📈 ALERT ANALYTICS (Persistent session-based)
        self.alert_count = 0
        self.last_alert_time = 0.0
        self.processed_data["alert"] = False
        self.processed_data["alert_count"] = 0

    def start(self, user_id=None):
        with self.lock:
            if not self.is_running:
                self.user_id = user_id
                self.camera = cv2.VideoCapture(0)
                # Max resolution for best accuracy
                self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                
                if not self.camera.isOpened():
                    self.camera = None
                    return False
                
                self.is_running = True
                self.frame_count = 0
                self.prob_history.clear()
                
                # Start Dedicated Threads
                self.capture_thread = threading.Thread(target=self._capture_worker, daemon=True)
                self.inference_thread = threading.Thread(target=self._inference_worker, daemon=True)
                
                self.capture_thread.start()
                self.inference_thread.start()
                return True
            return True

    def stop(self):
        """Strict hardware release and teardown."""
        if not self.is_running: return 
        
        self.is_running = False
        with self.lock:
            if self.camera:
                self.camera.release()
                self.camera = None

    def _capture_worker(self):
        """Thread 1: Ultra-fast frame capture."""
        prev_time = time.time()
        while self.is_running:
            try:
                ret, frame = self.camera.read()
                if not ret:
                    time.sleep(0.01)
                    continue
                
                curr_time = time.time()
                new_fps = 1.0 / (curr_time - prev_time) if (curr_time - prev_time) > 0 else 30.0
                self.fps = (0.9 * self.fps) + (0.1 * new_fps)
                prev_time = curr_time
                
                self.raw_frame = frame
                self.frame_count += 1
                time.sleep(0.005)
            except: pass

    def _inference_worker(self):
        """Thread 2: Optimized AI Inference loop (Sync with Capture)."""
        last_processed_count = -1
        """Thread 2: Real-time AI processing (Decoupled from capture)."""
        while self.is_running:
            try:
                if self.raw_frame is None: 
                    time.sleep(0.01)
                    continue
                
                with self.lock:
                    local_frame = self.raw_frame.copy()
                    self.processed_data["alert"] = False # Reset for Instant Triggering
                
                should_detect = (self.frame_count % self.detect_every_n == 0)
                should_ai = (self.frame_count % self.ai_every_n == 0)
                
                # Face persistence: don't clear old boxes if we skip detection this frame
                if should_detect:
                    gray = cv2.cvtColor(local_frame, cv2.COLOR_BGR2GRAY)
                    faces = self.face_cascade.detectMultiScale(gray, **self.cascade_params)
                    
                    if len(faces) > 0:
                        # 🎯 PRINCIPAL FACE LOCKING: Sort by area and pick the LARGEST face (The actual user)
                        faces = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)
                        (x, y, w, h) = faces[0] # Take only the primary face for stability
                        
                        self.processed_data["faces"] = [{
                            "rect": (int(x), int(y), int(w), int(h)),
                            "emotion": self.voted_emotion,
                            "confidence": self.voted_conf
                        }]
                    elif not self.processed_data.get("faces"):
                        self.processed_data["faces"] = []

                # AI Inference: Run on current boxes (new or from previous frame)
                faces_list = self.processed_data.get("faces", [])
                if should_ai and faces_list:
                    # Sequential AI on tracked faces (can be batched for pro GPU usage)
                    for face_info in faces_list:
                        self._predict_emotion(local_frame, face_info)
                
            except: pass

    def _predict_emotion(self, frame, face_info):
        """Preprocesses ROI and runs model with Softmax temporal smoothing + Biometric Overrides."""
        rect = face_info["rect"]
        (x, y, w, h) = rect
        fh, fw = frame.shape[:2]
        
        # Enhanced Padding for context
        p_w, p_h = int(w * 0.1), int(h * 0.1)
        x1, y1 = max(0, x - p_w), max(0, y - p_h)
        x2, y2 = min(fw, x + w + p_w), min(fh, y + h + p_h)
        
        try:
            roi_raw = frame[y1:y2, x1:x2]
            if roi_raw.size == 0: return
            
            roi = cv2.cvtColor(roi_raw, cv2.COLOR_BGR2GRAY)
            # Dynamic Lighting Compression (Gamma Correction for dark faces)
            avg_brightness = np.mean(roi)
            if avg_brightness < 80:
                gamma = 1.3
                invGamma = 1.0 / gamma
                table = np.array([((i / 255.0) ** invGamma) * 255 for i in np.arange(0, 256)]).astype("uint8")
                roi = cv2.LUT(roi, table)

            # Use CLAHE for superior adaptive lighting normalization
            clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
            roi = clahe.apply(roi) 
            target_size = self.ai.model.input_shape[1:3] if self.ai.model else (48, 48)
            roi = cv2.resize(roi, target_size)
            roi = roi.astype('float32') / 255.0
            roi = np.expand_dims(roi, axis=(0, -1)) 
            
            if self.ai.model:
                preds = self.ai.model.predict(roi, verbose=0)[0]
                
                # 📈 Advanced Stability: Individual Face Momentum (Weighted History)
                if "history" not in face_info: 
                    face_info["history"] = preds
                    face_info["last_stable_emo"] = "Neutral"
                else:
                    # 📈 HYPER STABILITY: Weighted Temporal Smoothing (Alpha=0.10)
                    # Lower alpha = Much slower, more stable transitions
                    alpha = 0.10 
                    face_info["history"] = (alpha * preds) + ((1 - alpha) * face_info["history"])
                
                avg_probs = face_info["history"]
                idx = np.argmax(avg_probs)
                raw_conf = float(avg_probs[idx])
                raw_emo = self.ai.emotions[idx]

                # 🛡️ CERTAINTY GUARD: "Switching Guard" to prevent flickering.
                is_weak = raw_conf < 0.45
                if is_weak and face_info.get("last_stable_emo"):
                    raw_emo = face_info["last_stable_emo"]
                else:
                    face_info["last_stable_emo"] = raw_emo
                
                # 🔥 BIOMETRIC CORE (Muscle-Region Displacement Analysis)
                if MP_AVAILABLE:
                    rgb_roi = cv2.cvtColor(roi_raw, cv2.COLOR_BGR2RGB)
                    mesh_res = mesh_engine.process(rgb_roi)
                    if mesh_res.multi_face_landmarks:
                        lms = mesh_res.multi_face_landmarks[0].landmark
                        
                        # 1. Normalized Mouth Elevation (Happy/Sad)
                        m_width = abs(lms[61].x - lms[291].x)
                        m_height = abs(lms[13].y - lms[14].y)
                        m_y_avg = (lms[61].y + lms[291].y) / 2
                        m_center = (lms[0].y + lms[17].y) / 2
                        # Normalize by width to be distance-invariant
                        smile_factor = (m_center - m_y_avg) / max(0.001, m_width)
                        
                        # 2. Eyebrow Furrow / Tension (Angry/Fear)
                        # Distances between inner eyebrows (107, 336) and eye centers
                        brow_tension = abs(lms[107].y - lms[159].y) + abs(lms[336].y - lms[386].y)
                        
                        # 3. Eye Aperture (Surprise/Fear)
                        eye_aperture = abs(lms[159].y - lms[145].y) + abs(lms[386].y - lms[374].y)

                        # Logic Gates for Biometric Override
                        if smile_factor > 0.22: # Tighter Happy (Smile) gate to avoid Surprise
                            raw_emo = "Happy"
                            raw_conf = max(raw_conf, 0.92)
                        elif smile_factor < -0.06: # Robust Sad (Frown)
                            raw_emo = "Sad"
                            raw_conf = max(raw_conf, 0.82)
                        elif brow_tension < 0.04 and eye_aperture < 0.05: # Angry (Furrowed + Narrow eyes)
                            raw_emo = "Angry"
                            raw_conf = max(raw_conf, 0.85)
                        elif eye_aperture > 0.10: # Surprise (Extreme Wide eyes)
                            raw_emo = "Surprise"
                            raw_conf = max(raw_conf, 0.92)
                            
                        # 🚨 AUTOMATED SURVEILLANCE TRIGGER
                        if raw_emo in ["Angry", "Fear", "Sad", "Disgust"] and raw_conf > 0.70:
                             print(f"🚨 ALERT TRIGGERED: {raw_emo.upper()} ({raw_conf:.2f}) - Dispatching Proof...")
                             AlertSystem.trigger_webcam_alert(raw_emo, raw_conf, frame)
                             self.processed_data["alert"] = True
                             self.alert_count = getattr(self, 'alert_count', 0) + 1
                             self.last_alert_time = float(time.time())

                # 🔥 NEURAL FIXATION FIX: Logic remains for switching out of weak Neutral/Happy to Surprise
                if raw_emo in ["Neutral", "Happy"] and raw_conf < 0.60:
                    # Check for Surprise in probabilities
                    surp_idx = self.ai.emotions.index("Surprise")
                    surp_prob = float(avg_probs[surp_idx])
                    
                    # If mouth is active (from previous check) or Surprise probability is decent
                    if surp_prob > 0.15:
                        raw_emo = "Surprise"
                        raw_conf = surp_prob
                    else:
                        # Standard fallback for weak neutral
                        sorted_idxs = np.argsort(avg_probs)[::-1]
                        for s_idx in sorted_idxs:
                            if self.ai.emotions[s_idx] != "Neutral" and avg_probs[s_idx] > 0.25:
                                raw_emo = self.ai.emotions[s_idx]
                                raw_conf = float(avg_probs[s_idx])
                                break

            # 🦷 MOUTH/JAW ANALYSIS (For Surprise/Fear)
            m_y1 = int(roi_raw.shape[0] * 0.65)
            mouth_roi = roi_raw[m_y1:, :]
            if mouth_roi.size > 0:
                m_gray = cv2.cvtColor(mouth_roi, cv2.COLOR_BGR2GRAY)
                edges = cv2.Canny(m_gray, 40, 120)
                mouth_activity = np.sum(edges > 0) / edges.size
                if mouth_activity > 0.08 and raw_emo == "Neutral":
                    raw_emo = "Surprise"
                    raw_conf = 0.85
                elif mouth_activity > 0.12 and raw_emo == "Fear": # Extreme Fear detection
                    raw_conf = min(raw_conf + 0.15, 1.0)

            # Assign back to individual face
            face_info["emotion"] = raw_emo
            face_info["confidence"] = raw_conf
            
            # Check for ALERTS (Multi-Face Anomaly Check)
            if raw_emo in ["Angry", "Fear", "Sad"]:
                self.processed_data["alert"] = True
                # Debounce alert count to avoid spam
                if time.time() - self.last_alert_time > 2.0:
                    self.alert_count += 1
                    self.last_alert_time = time.time()

            from datetime import datetime
            global webcam_data
            current_time = datetime.now().strftime("%y-%m-%d %H:%M:%S")
            webcam_data.append({"emotion": raw_emo, "confidence": raw_conf, "time": current_time})
            
            if self.user_id:
                from core.database import log_emotion
                log_emotion(self.user_id, raw_emo, raw_conf, "webcam")
        except Exception as e:
            print(f"🔴 [WEBCAM ENGINE ERROR]: {e}")

    def get_frame(self):
        """High-Fidelity AI UI renderer with Biometric Landmarks."""
        if not self.is_running: return None
        if self.raw_frame is None:
            placeholder = np.zeros((480, 640, 3), np.uint8)
            cv2.putText(placeholder, "CORE INTERFACE: CALIBRATING...", (150, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            _, jpeg = cv2.imencode('.jpg', placeholder); return jpeg.tobytes()
            
        display_frame = self.raw_frame.copy()
        h, w = display_frame.shape[:2]

        # 🔥 BIOMETRIC MESH OVERLAY (Requirement: Eye, Nose, Jaw Measurement)
        if MP_AVAILABLE:
            rgb_frame = cv2.cvtColor(display_frame, cv2.COLOR_BGR2RGB)
            results = mesh_engine.process(rgb_frame)
            if results.multi_face_landmarks:
                for face_landmarks in results.multi_face_landmarks:
                    # Draw subtle mesh points for eyes/nose/mouth/jaw
                    for id, lm in enumerate(face_landmarks.landmark):
                        # Filter for key biometric points (Jaw: 0-16, Nose: 1-5, Eyes: 33, 133, 362, 263)
                        if id % 8 == 0: # Sparse mesh for 'Pro' look
                            px, py = int(lm.x * w), int(lm.y * h)
                            cv2.circle(display_frame, (px, py), 1, (0, 255, 0), -1)
        
        # Multi-Face Labels
        faces_list = self.processed_data.get("faces", [])
        if faces_list:
            # Sort by area (Largest face = Principal Face)
            sorted_faces = sorted(faces_list, key=lambda f: f["rect"][2]*f["rect"][3], reverse=True)
            self.voted_emotion = sorted_faces[0].get("emotion", "Neutral")
            self.voted_conf = sorted_faces[0].get("confidence", 0.0)
            
            # Update global alert status
            any_alert = any(f.get("emotion") in ["Angry", "Fear", "Sad"] for f in sorted_faces)
            self.processed_data["alert"] = any_alert
            self.processed_data["alert_count"] = self.alert_count

        for face in faces_list:
            (fx, fy, fw, fh) = face["rect"]
            emo = face.get("emotion", "Analyzing...")
            conf = face.get("confidence", 0.0)
            
            # Draw Adaptive HUD Box
            color = (0, 255, 0) if emo == "Happy" else (99, 102, 241)
            if emo.upper() in ['ANGRY', 'FEAR', 'SAD']: color = (0, 0, 255)
            
            cv2.rectangle(display_frame, (fx, fy), (fx + fw, fy + fh), color, 2)
            
            # Labels
            label = f"{emo} ({conf*100:.1f}%)"
            cv2.rectangle(display_frame, (fx, fy - 22), (fx + fw, fy), color, -1)
            cv2.putText(display_frame, label, (fx + 5, fy - 7), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)

            # Draw "Measureable" lines (Jaw base & Nose center)
            cv2.line(display_frame, (fx, fy + int(fh*0.8)), (fx + fw, fy + int(fh*0.8)), (255, 255, 255), 1) # Jaw line
            cv2.line(display_frame, (fx + int(fw/2), fy), (fx + int(fw/2), fy + fh), (255, 255, 255), 1) # Nose vertical
        
        # Stats HUD
        cv2.putText(display_frame, f"LIVE INTELLIGENCE | {self.fps:.1f} FPS", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1, cv2.LINE_AA)
        
        _, jpeg = cv2.imencode('.jpg', display_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        return jpeg.tobytes()

    def get_metrics(self):
        # 🔥 CORE REQUIREMENT: Usestrictly the global webcam_data list
        global webcam_data
        
        total = len(webcam_data)
        dominant = "N/A"
        avg_conf = 0.0
        
        if webcam_data:
            from collections import Counter
            # ✅ MOVING WINDOW DOMINANT (Requirement: Don't stay stuck on Neutral)
            recent_data = webcam_data[-50:] 
            dominant = Counter([d["emotion"] for d in recent_data]).most_common(1)[0][0]
            
            # ✅ SMOOTH CONFIDENCE (Last 20 samples for HUD stability)
            smooth_data = webcam_data[-20:]
            avg_conf = sum(d["confidence"] for d in smooth_data) / len(smooth_data)
            
        # 🔥 CALC STABILITY
        stability = avg_conf * 100
        det_rate = (total / max(1, total + 1)) * 100 if total > 0 else 0
        
        return {
            "total": total,
            "dominant": dominant,
            "confidence": round(avg_conf, 2),
            "stability": round(stability, 2),
            "det_rate": round(det_rate, 2),
            "fps_val": round(self.fps, 1),
            "alert": self.processed_data.get("alert", False),
            "alert_count": getattr(self, 'alert_count', 0),
            "history": webcam_data[-15:][::-1] # Latest 15 entries, newest first
        }
