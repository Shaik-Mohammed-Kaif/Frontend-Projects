import pandas as pd
import numpy as np
from flask import Blueprint, render_template, session, jsonify, Response
from core.database import get_db_connection
from core.utils import login_required
from analytics_engine import generate_dashboard_data

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/user-home')
@login_required
def dashboard_page():
    conn = get_db_connection()
    user_id = session.get('user_id')
    is_admin = session.get('role') == 'admin'
    
    where = "" if is_admin else "WHERE user_id = ?"
    params = () if is_admin else (user_id,)
    
    # Fetch Text Analytics Data
    t_rows = conn.execute(f"SELECT emotion FROM text_history {where}", params).fetchall()
    t_full = [dict(r) for r in t_rows]
    total_t = len(t_full)
    
    # Fetch Webcam Analytics Data
    w_rows = conn.execute(f"SELECT dom_emotion FROM webcam_history {where}", params).fetchall()
    w_full = [dict(r) for r in w_rows]
    total_w = len(w_full)

    # Fetch Image Analytics Data
    i_rows = conn.execute(f"SELECT emotion FROM image_history {where}", params).fetchall()
    i_full = [dict(r) for r in i_rows]
    total_i = len(i_full)
    
    conn.close()
    
    return render_template('dashboard.html', 
                         user=session, 
                         total_t=total_t, 
                         total_w=total_w,
                         total_i=total_i,
                         t_full=t_full, 
                         w_full=w_full,
                         i_full=i_full)

@dashboard_bp.route('/api/emotion_analytics')
@login_required
def emotion_analytics_api():
    conn = get_db_connection()
    user_id = session['user_id']
    is_admin = session.get('role') == 'admin'
    
    # Extract data for analytics engine
    where = "" if is_admin else "WHERE user_id = ?"
    params = () if is_admin else (user_id,)
    
    # Unified Global Data Fetch
    text_df = pd.read_sql(f"SELECT * FROM text_history {where}", conn, params=params)
    img_df = pd.read_sql(f"SELECT * FROM image_history {where}", conn, params=params)
    webcam_df = pd.read_sql(f"SELECT * FROM webcam_history {where}", conn, params=params)
    audio_df = pd.read_sql(f"SELECT * FROM audio_history {where}", conn, params=params)
    video_df = pd.read_sql(f"SELECT * FROM video_history {where}", conn, params=params)
    ds_df = pd.read_sql(f"SELECT * FROM dataset_analysis_history {where}", conn, params=params)
    emotion_df = pd.read_sql(f"SELECT emotion_label as emotion, confidence_score as confidence, source_module as module, timestamp FROM emotion_history {where}", conn, params=params)
    
    conn.close()
    
    # Generate high-performance analytical payload
    data = generate_dashboard_data(text_df, img_df, webcam_df, audio_df, video_df, ds_df, emotion_df)
    
    # Return everything the frontend needs
    return jsonify({
        "success": True,
        "kpis": data['kpis'],
        "charts": {
            "emotion_distribution": data['charts']['distribution'],
            "timeline": data['charts']['timeline'],
            "confidence_trend": data['charts']['confidences'],
            "module_usage": data['charts']['module_usage'],
            "sentiment_share": data['charts']['sentiment_share'],
            "heatmap": data['charts'].get('heatmap'),
            "clusters": data['charts'].get('clusters'),
            "confusion_matrix": data['charts'].get('confusion_matrix')
        },
        "live": data['live']
    })

@dashboard_bp.route('/api/export/csv')
@login_required
def export_csv():
    conn = get_db_connection()
    user_id = session['user_id']
    is_admin = session.get('role') == 'admin'
    query_param = () if is_admin else (user_id,)
    where_clause = "" if is_admin else "WHERE user_id = ?"
    
    df = pd.read_sql_query(f"SELECT * FROM text_history {where_clause}", conn, params=query_param)
    conn.close()
    
    csv_data = df.to_csv(index=False)
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-disposition": "attachment; filename=emotion_analytics_export.csv"}
    )
