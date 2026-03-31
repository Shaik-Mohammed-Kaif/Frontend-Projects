import time
from flask import Blueprint, request, jsonify, session, render_template
from core.database import get_db_connection, log_emotion
from core.utils import login_required

dataset_bp = Blueprint('dataset_analysis', __name__)

@dataset_bp.route('/dataset')
@login_required
def dataset_page():
    return render_template('dataset_module.html', user=session)

@dataset_bp.route('/dataset-ai', methods=['POST'])
@login_required
def dataset_emotion_api():
    from app import ai
    
    # Batch process simulation
    dist, t, df, evals, avg_conf = ai.predict_dataset(None)
    
    conn = get_db_connection()
    conn.execute('INSERT INTO dataset_analysis_history (user_id, dataset_name, rows_processed, emotion, confidence) VALUES (?, ?, ?, ?, ?)',
                 (session['user_id'], 'dataset_upload.csv', len(df), 'Multiple', avg_conf))
    conn.commit(); conn.close()
    
    log_emotion(session['user_id'], 'Dataset', avg_conf, 'dataset')
    
    return jsonify({
        "rows": len(df),
        "time": round(t, 2),
        "distribution": dist,
        "eval": evals,
        "scatter": df[['Predicted_Emotion', 'Confidence']].rename(columns={'Predicted_Emotion': 'emotion', 'Confidence': 'confidence'}).to_dict('records')
    })
