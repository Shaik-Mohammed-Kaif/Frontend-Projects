from flask import Blueprint, request, jsonify, render_template, session
from core.database import get_db_connection, log_emotion
from core.utils import login_required
from services.text_service import predict_text
from analytics_store import save_event

text_bp = Blueprint('text_routes', __name__)

@text_bp.route('/text-ai')
@login_required
def text_page():
    conn = get_db_connection()
    text_hist = conn.execute('SELECT id, text, emotion, confidence, timestamp FROM text_history WHERE user_id = ? ORDER BY timestamp ASC', (session['user_id'],)).fetchall()
    conn.close()
    return render_template('text_module.html', user=session, text_data=[dict(d) for d in text_hist])

@text_bp.route('/text-emotion', methods=['POST'])
@login_required
def text_emotion():
    """Endpoint for Text Emotion analysis"""
    text = request.form.get('text')
    if not text:
        return jsonify({"error": "No meaningful text data provided."}), 400
    
    # Process text through advanced NLP engine (Multilingual + Sarcasm)
    results = predict_text(text)
    
    user_id = session.get('user_id', 1)
    label = results.get('emotion', 'Neutral')
    conf = results.get('confidence', 0.0)
    lang = results.get('language', 'en')
    
    # Save to module-specific history for the dashboard view
    try:
        conn = get_db_connection()
        # Removed manual timestamp to ensure DB default (CURRENT_TIMESTAMP) handles formatting
        conn.execute('INSERT INTO text_history (user_id, text, emotion, confidence, model_used) VALUES (?, ?, ?, ?, ?)',
                     (user_id, text, label, conf, f"NLP-v2-{lang}"))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"DEBUG: Text History Save Error: {e}")

    # Unified Analytics: save_event handles both persistence (DB) and real-time data
    save_event("text", text, label, conf, language=lang)
    
    # Standard response format
    return jsonify(results)

@text_bp.route('/api/text/history/export/<fmt>')
@login_required
def export_text_history(fmt):
    import pandas as pd
    import io
    from flask import send_file
    conn = get_db_connection()
    rows = conn.execute('SELECT text, emotion, confidence, timestamp FROM text_history WHERE user_id = ? ORDER BY timestamp DESC', (session['user_id'],)).fetchall()
    conn.close()
    
    if not rows:
        return jsonify({"error": "No data to export"}), 404
        
    df = pd.DataFrame([dict(r) for r in rows])
    
    if fmt == 'csv':
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return send_file(io.BytesIO(output.getvalue().encode()), mimetype='text/csv', as_attachment=True, download_name='text_history.csv')
    
    elif fmt == 'json':
        output = io.BytesIO(df.to_json(orient='records').encode())
        return send_file(output, mimetype='application/json', as_attachment=True, download_name='text_history.json')
    
    return jsonify({"error": "Invalid format"}), 400

@text_bp.route('/api/text/wordcloud')
@login_required
def get_user_text_wordcloud():
    try:
        conn = get_db_connection()
        user_id = session.get('user_id')
        rows = conn.execute("SELECT text FROM text_history WHERE user_id = ? AND text IS NOT NULL AND text != ''", (user_id,)).fetchall()
        conn.close()
        
        words_pool = []
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'it', 'that', 'with', 'for', 'on', 'this', 'that', 'at', 'by', 'as', 'will', 'be', 'i', 'my', 'me', 'you', 'he', 'she', 'they', 'we', 'from', 'up'}
        for r in rows:
            text = str(r['text']).lower()
            clean_text = "".join([c if c.isalnum() or c.isspace() else "" for c in text])
            words = [w for w in clean_text.split() if w not in stop_words and len(w) > 2]
            words_pool.extend(words)
        from collections import Counter
        counts = Counter(words_pool).most_common(40)
        return jsonify([{'word': w, 'count': c} for w, c in counts])
    except Exception as e:
        print(f"Error: {e}")
        return jsonify([])
