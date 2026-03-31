import os
import time
import cv2
from datetime import datetime
from flask import Blueprint, request, jsonify, render_template, session
from core.database import get_db_connection, log_emotion, save_json_backup
from core.utils import login_required
from analytics_store import save_event
from core.shared import ai

image_bp = Blueprint("image_bp", __name__)

UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@image_bp.route('/image-ai')
@login_required
def image_page():
    return render_template('image_ai.html', user=session)

# ==============================
# 🔥 MAIN ANALYSIS (Local Engine)
# ==============================
def analyze_image(path):
    t0 = time.time()
    try:
        # Load image via OpenCV instead of path string
        img = cv2.imread(path)
        if img is None:
            return {"error": "Input image could not be decoded. Ensure file is valid."}

        # Analyze using SHARED central AI engine
        results, img_base64, engine_time = ai.predict_image(img)

        # Handle No-Face detection
        if not results:
            return {
                "status": "success",
                "emotion": "Neutral",
                "confidence": 0,
                "all_emotions": {"Neutral": 1.0},
                "image_path": path,
                "processing_time": f"{time.time() - t0:.3f}s",
                "timestamp": datetime.now().isoformat(),
                "note": "No face detected, defaulting to Neutral"
            }

        # Extract top face result
        top_face = results[0]
        emotion_data = {k: v * 100 for k, v in top_face['probabilities'].items()}
        dominant = top_face['emotion'].capitalize()
        confidence = float(top_face['confidence'] * 100)

        processing_time = f"{time.time() - t0:.3f}s"

        return {
            "status": "success",
            "emotion": dominant,
            "confidence": round(confidence, 2),
            "all_emotions": emotion_data,
            "image_path": path,
            "image_base64": img_base64, # Return processed frame with bounding box
            "processing_time": processing_time,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        print(f"DEBUG: Analyze Error: {e}")
        return {"error": f"Inference Engine Error: {str(e)}"}

# ==============================
# 📌 IMAGE FROM FILE
# ==============================
def process_uploaded_image(file):
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    return analyze_image(filepath)

# ==============================
# 📌 IMAGE FROM URL
# ==============================
def process_url_image(url):
    import requests
    import base64
    try:
        filename = f"url_{int(datetime.now().timestamp())}.jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        if url.startswith('data:image'):
            # Handle Base64 Data URI
            try:
                header, encoded = url.split(",", 1)
                # Clean base64 string from whitespace/newlines
                encoded = encoded.replace(" ", "").replace("\n", "").replace("\r", "")
                
                # Fix Base64 Padding issues
                missing_padding = len(encoded) % 4
                if missing_padding:
                    encoded += '=' * (4 - missing_padding)
                
                image_data = base64.b64decode(encoded)
                with open(filepath, "wb") as f:
                    f.write(image_data)
            except Exception as b64e:
                return {"error": f"Base64 Decoding Failed: {str(b64e)}"}
        else:
            # Handle Standard HTTP/HTTPS URL
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            with open(filepath, "wb") as f:
                f.write(response.content)

        return analyze_image(filepath)
    except Exception as e:
        return {"error": f"URL Processing Failed: {str(e)}"}

# ==============================
# 📡 ROUTES
# ==============================

@image_bp.route("/analyze-image", methods=["POST"])
@login_required
def analyze_upload():
    if "image" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["image"]
    result = process_uploaded_image(file)

    if "error" not in result:
        # Analytics & DB Logging
        user_id = session.get('user_id', 1)
        log_emotion(user_id, result['emotion'], result['confidence']/100, 'image_upload')
        
        # Log to image_history
        try:
            conn = get_db_connection()
            conn.execute('INSERT INTO image_history (user_id, image_path, image_source, emotion, confidence, processing_time) VALUES (?, ?, ?, ?, ?, ?)',
                         (user_id, result['image_path'], 'Upload', result['emotion'], result['confidence'], result['processing_time']))
            conn.commit()
            conn.close()
        except: pass

        save_json_backup('analytics_data', {
            "user_id": user_id,
            "module": "image",
            "source": "upload",
            "emotion": result['emotion'],
            "confidence": result['confidence'],
            "timestamp": result['timestamp']
        })
        
        # Save to new analytics system
        save_event("image", result['image_path'], result['emotion'], result['confidence'])

    return jsonify(result)


@image_bp.route("/analyze-url", methods=["POST"])
@login_required
def analyze_url():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    result = process_url_image(url)

    if "error" not in result:
        # Analytics & DB Logging
        user_id = session.get('user_id', 1)
        log_emotion(user_id, result['emotion'], result['confidence']/100, 'image_url')
        
        # Log to image_history
        try:
            conn = get_db_connection()
            conn.execute('INSERT INTO image_history (user_id, image_path, image_source, emotion, confidence, processing_time) VALUES (?, ?, ?, ?, ?, ?)',
                         (user_id, result['image_path'], 'URL', result['emotion'], result['confidence'], result['processing_time']))
            conn.commit()
            conn.close()
        except: pass

        save_json_backup('analytics_data', {
            "user_id": user_id,
            "module": "image",
            "source": "url",
            "emotion": result['emotion'],
            "confidence": result['confidence'],
            "timestamp": result['timestamp']
        })

        # Save to new analytics system
        save_event("image", result['image_path'], result['emotion'], result['confidence'])

    return jsonify(result)



