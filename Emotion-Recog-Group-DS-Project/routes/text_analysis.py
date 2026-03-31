import time
from datetime import datetime
from flask import Blueprint, request, jsonify, session, render_template
from core.database import get_db_connection, save_json_backup, log_emotion
from core.utils import login_required

text_bp = Blueprint('text_analysis', __name__)

@text_bp.route('/text-ai')
@login_required
def text_page():
    conn = get_db_connection()
    text_hist = conn.execute('SELECT id, text, emotion, confidence, timestamp FROM text_history WHERE user_id = ? ORDER BY timestamp ASC', (session['user_id'],)).fetchall()
    conn.close()
    return render_template('text_module.html', user=session, text_data=[dict(d) for d in text_hist])

@text_bp.route('/text-emotion', methods=['POST'])
@login_required
def text_emotion_api():
    print("\n[API] /text-emotion endpoint hit")
    from app import ai
    
    text = request.form.get('text')
    model_type = request.form.get('model', 'Transformer')
    
    if not text:
        return jsonify({"error": "No meaningful text data provided."})

    try:
        label, conf, t, used, probs = ai.predict_text(text, model_type)
        
        # Save to database and history
        try:
            conn = get_db_connection()
            conn.execute('INSERT INTO text_history (user_id, text, emotion, confidence, model_used, processing_time, text_length) VALUES (?, ?, ?, ?, ?, ?, ?)',
                         (session['user_id'], text, label, conf, used, f"{t:.3f}s", len(text)))
            conn.commit(); conn.close()
            
            save_json_backup('text_data', {
                "user_id": session['user_id'],
                "text": text,
                "emotion": label,
                "confidence": round(conf * 100, 2),
                "model": used,
                "timestamp": datetime.now().isoformat()
            })
            log_emotion(session['user_id'], label, conf, 'text')
        except Exception as e:
            print(f"[API] History Save Error: {e}")

        return jsonify({
            "emotion": label,
            "confidence": conf,
            "results": [{"label": label, "confidence": conf, "probabilities": probs, "engine": used}],
            "time": f"{t:.3f}s",
            "label": label,
            "probabilities": probs,
            "engine": used
        })
    except Exception as e:
        print(f"[API] ❌ Engine Error: {e}")
        return jsonify({"error": "Internal AI Processing Error", "details": str(e)})
