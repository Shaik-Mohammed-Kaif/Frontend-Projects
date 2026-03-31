import os
import time
import cv2
import numpy as np
import urllib.request
from datetime import datetime
from flask import Blueprint, request, jsonify, session, render_template, current_app
from core.database import get_db_connection, save_json_backup, log_emotion
from core.utils import login_required

image_bp = Blueprint('image_analysis', __name__)

@image_bp.route('/image-ai')
@login_required
def image_page():
    conn = get_db_connection()
    img_hist = conn.execute('SELECT id, image_source as source, emotion, confidence, timestamp FROM image_history WHERE user_id = ? ORDER BY timestamp ASC', (session['user_id'],)).fetchall()
    conn.close()
    return render_template('image_module.html', user=session, image_data=[dict(d) for d in img_hist])

@image_bp.route('/image-emotion', methods=['POST'])
@login_required
def image_emotion_api():
    print("\n[API] /image-emotion endpoint hit")
    # We access the global AI engine from the main app's context
    from app import ai
    
    img_array = None
    source = "Unknown"
    
    # URL Input
    img_url = request.form.get('url')
    if img_url:
        try:
            print(f"[API] Fetching image from URL: {img_url[:50]}...")
            headers = {'User-Agent': 'Mozilla/5.0'}
            req = urllib.request.Request(img_url, headers=headers)
            with urllib.request.urlopen(req, timeout=5) as response:
                image_data = response.read()
                image_np = np.asarray(bytearray(image_data), dtype="uint8")
                img_array = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
                source = "URL"
        except Exception as e:
            print(f"[API] ❌ URL Fetch Error: {e}")
            return jsonify({"error": f"Failed to fetch image: {str(e)}"})

    # File Input
    elif 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            print(f"[API] Received uploaded file: {file.filename}")
            filestr = file.read()
            npimg = np.frombuffer(filestr, np.uint8)
            img_array = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
            source = "Upload"

    if img_array is None:
        return jsonify({"error": "No valid image data provided."})

    try:
        results, result_img, t = ai.predict_image(img_array)
        
        if not results:
            return jsonify({
                "emotion": "No Face",
                "confidence": 0,
                "results": [],
                "error": "No face detected in the image.",
                "time": f"{t:.3f}s"
            })

        primary = results[0]
        emotion = primary['label']
        confidence = primary['confidence']
        
        # Save to database and history
        try:
            img_filename = f"img_{session['user_id']}_{int(time.time())}.jpg"
            img_dir = os.path.join('storage', 'images')
            os.makedirs(img_dir, exist_ok=True)
            img_path = os.path.join(img_dir, img_filename)
            cv2.imwrite(img_path, img_array)
            
            conn = get_db_connection()
            conn.execute('INSERT INTO image_history (user_id, image_path, image_source, emotion, confidence, processing_time) VALUES (?, ?, ?, ?, ?, ?)',
                         (session['user_id'], f"storage/images/{img_filename}", source, emotion, confidence, f"{t:.3f}s"))
            conn.commit(); conn.close()
            
            save_json_backup('image_data', {
                "user_id": session['user_id'],
                "image_source": source,
                "image_path": f"storage/images/{img_filename}",
                "emotion": emotion,
                "confidence": round(confidence * 100, 2),
                "timestamp": datetime.now().isoformat()
            })
            log_emotion(session['user_id'], emotion, confidence, 'image')
        except Exception as e:
            print(f"[API] History Save Error: {e}")

        return jsonify({
            "emotion": emotion,
            "confidence": confidence,
            "results": results,
            "image": result_img,
            "time": f"{t:.3f}s",
            "label": emotion,
            "probabilities": primary['probabilities'],
            "engine": primary['engine']
        })
    except Exception as e:
        print(f"[API] ❌ Engine Error: {e}")
        return jsonify({"error": "Internal AI Processing Error", "details": str(e)})

@image_bp.route('/predict', methods=['POST'])
@login_required
def predict():
    return image_emotion_api()
