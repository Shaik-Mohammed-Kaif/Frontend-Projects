from flask import Blueprint, request, jsonify, render_template, session
from core.database import get_db_connection, log_emotion
from core.utils import login_required
from services.image_service import analyze_image_file, analyze_image_url

# New unified blueprint for the Image Emotion Module
image_bp = Blueprint('image_routes', __name__)

@image_bp.route('/image-ai')
@login_required
def image_page():
    """Renders the main Image Intelligence page with history"""
    conn = get_db_connection()
    img_hist = conn.execute('SELECT id, image_source as source, emotion, confidence, timestamp FROM image_history WHERE user_id = ? ORDER BY timestamp ASC', (session['user_id'],)).fetchall()
    conn.close()
    return render_template('image_module.html', user=session, image_data=[dict(d) for d in img_hist])

@image_bp.route('/analyze-image', methods=['POST'])
@login_required
def analyze_image_api():
    """Unified API for processing image file uploads and URLs"""
    result = None
    source = "Unknown"
    
    if "image" in request.files:
        file = request.files["image"]
        result = analyze_image_file(file)
        source = "Upload"
    elif "url" in request.form:
        url = request.form.get("url")
        result = analyze_image_url(url)
        source = "URL"
    else:
        return jsonify({"status": "error", "error": "No image data or URL provided."}), 400

    if result.get("status") == "success" and result.get("emotion") not in ["No Face Detected", "No face detected"]:
        # Unified IST Analytics Integration
        user_id = session.get('user_id', 1)
        raw_conf = result.get("confidence", 0.0)
        label = result.get("emotion", "Neutral")
        
        # Save to both DB (via log_emotion inside save_event) and Global Analytics
        from analytics_store import save_event
        save_event(f"IMAGE_{source.upper()}", f"Img Analysis ({source})", label, raw_conf)

    return jsonify(result)

# Backwards compatibility and redundant route aliasing cleanup
@image_bp.route('/image-emotion', methods=['POST'])
@login_required
def image_emotion_legacy():
    return analyze_image_api()

@image_bp.route('/api/image/history/export/<fmt>')
@login_required
def export_image_history(fmt):
    import pandas as pd
    import io
    from flask import send_file
    conn = get_db_connection()
    user_id = session.get('user_id')
    rows = conn.execute('SELECT image_source as source, emotion, confidence, timestamp FROM image_history WHERE user_id = ? ORDER BY timestamp DESC', (user_id,)).fetchall()
    conn.close()
    
    if not rows:
        return jsonify({"error": "No data available to export"}), 404
        
    df = pd.DataFrame([dict(r) for r in rows])
    
    if fmt == 'csv':
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return send_file(io.BytesIO(output.getvalue().encode()), mimetype='text/csv', as_attachment=True, download_name='image_history.csv')
    
    elif fmt == 'json':
        output = io.BytesIO(df.to_json(orient='records').encode())
        return send_file(output, mimetype='application/json', as_attachment=True, download_name='image_history.json')
        
    return jsonify({"error": "Invalid format"}), 400
