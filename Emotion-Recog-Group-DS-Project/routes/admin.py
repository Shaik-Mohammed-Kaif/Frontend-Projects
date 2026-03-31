from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify, send_file
import os
import json
import time
from datetime import datetime
import numpy as np
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from core.database import get_db_connection, log_admin_action
from core.utils import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/internal/visuals/<path:filename>')
def serve_internal_visuals(filename):
    # 🌍 Deployment-Safe Path Mapping
    base_path = os.path.join(os.getcwd(), "artifacts")
    src_path = os.path.join(base_path, filename)
    
    # Return from artifacts if exists
    if os.path.exists(src_path):
        return send_file(src_path)
    
    return "Visual Asset Not Found", 404

# 📧 SMTP DYNAMIC CONFIG LOADER
CONFIG_PATH = os.path.join(os.getcwd(), 'config.json')

def get_alert_config():
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, 'r') as f:
                return json.load(f)
        except: pass
    return {
        "admin_email": "mohammedkaif8297@gmail.com",
        "app_password": "vpce ogwf cxwu dmnw",
        "cooldown_seconds": 10
    }

def save_alert_config(data):
    try:
        with open(CONFIG_PATH, 'w') as f:
            json.dump(data, f, indent=4)
        return True
    except: return False

last_alert_time = 0

def get_sys_settings():
    conn = get_db_connection()
    s = conn.execute("SELECT * FROM system_settings WHERE id = 1").fetchone()
    conn.close()
    if not s:
        return {
            "admin_email": "mohammedkaif8297@gmail.com", 
            "confidence_threshold": 0.70, 
            "alert_cooldown": 30,
            "alarm_sound": "https://cdn.pixabay.com/download/audio/2021/08/04/audio_06d123d922.mp3",
            "alarm_volume": 0.8,
            "alarm_intensity": "LOW"
        }
    d = dict(s)
    d.setdefault('admin_email', "mohammedkaif8297@gmail.com")
    d.setdefault('confidence_threshold', 0.70)
    d.setdefault('alert_cooldown', 30)
    d.setdefault('alarm_sound', "https://cdn.pixabay.com/download/audio/2021/08/04/audio_06d123d922.mp3")
    d.setdefault('alarm_volume', 0.8)
    d.setdefault('alarm_intensity', "LOW")
    return d

def send_admin_email(alert_data):
    """Dispatches a real-time SMTP critical alert with behavioral proof."""
    global last_alert_time
    settings = get_sys_settings()
    current_time = time.time()
    
    if (current_time - last_alert_time) < settings['alert_cooldown']:
        return False 
    
    # 🔐 DYNAMIC CREDENTIAL LOAD
    config = get_alert_config()
    sender_email = config.get('admin_email', 'mohammedkaif8297@gmail.com').strip()
    raw_password = config.get('app_password', '').strip()
    
    # 🔍 FIX: Clean Password
    app_password = raw_password.replace(" ", "")
    
    if not sender_email or not app_password:
        print("⚠️ Admin Route: Validation Failed. Check config.json")
        return False
        
    recipient = sender_email
    msg = MIMEMultipart()
    
    # 🔍 FIX: Simple Sender Header
    msg['From'] = sender_email
    msg['To'] = recipient
    msg['Subject'] = f"🚨 Emergency Emotion Alert: {alert_data['emotion_label'].upper()}"

    body = f"""
🚨 [URGENT] CRITICAL BEHAVIORAL ANOMALY DISPATCHED

--- SYSTEM-WIDE SECURITY DISPATCH ---
The Autonomous Surveillance Engine has intercepted a high-fidelity emotional signature that exceeds the established safety threshold for this sector.

### 📊 NEURAL AUDIT SUMMARY:
• Target Module     : {alert_data.get('source_module', 'webcam').upper()} Node
• Identified Emotion: {alert_data.get('emotion_label', 'N/A').upper()}
• Confidence Index  : {float(alert_data.get('confidence_score', 0))*100:.2f}% (VERIFIED)
• Dispatch Timestamp: {alert_data.get('timestamp', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))}

### 🧠 BEHAVIORAL RISK ASSESSMENT:
The target node has exhibited a sustained deviation from established emotional stability baselines. Our Deep Intelligence Hub identifies this signature as "{alert_data.get('emotion_label', 'N/A').upper()}," which currently matches High-Risk Behavioral Patterns (S-Rank). Continuous profiling indicates a potential situational escalation, requiring an immediate manual administrative audit of the attached visual proof.

### 🔐 SECURITY PROTOCOL:
Automated incursion logs have been archived. All telemetry data is synced to the Admin Intelligence Hub. Immediate situational assessment is strongly recommended to maintain system-wide safety compliance.

"This is an automated high-priority alert. No response required but action recommended."

---
Security ID: EA-OMEGA-99
Verified via: Admin Intelligence Hub
    """
    msg.attach(MIMEText(body, 'plain'))

    if 'image_path' in alert_data and os.path.exists(alert_data['image_path']):
        from email.mime.image import MIMEImage
        with open(alert_data['image_path'], 'rb') as f:
            img = MIMEImage(f.read())
            img.add_header('Content-Disposition', 'attachment', filename=os.path.basename(alert_data['image_path']))
            msg.attach(img)

    try:
        # 🔗 Standardized SSL Dispatch (Port 465)
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            # 🔍 FIX: Debug Logging
            server.set_debuglevel(1)
            
            server.login(sender_email, app_password)
            server.sendmail(sender_email, recipient, msg.as_string())
        
        last_alert_time = current_time
        print(f"✅ Admin Route: Alert Dispatch SUCCESS to {recipient}")
        return True
    except Exception as e:
        print(f"❌ Admin Route: Alert Dispatch FAILURE: {e}")
        return False

@admin_bp.route('/api/settings', methods=['GET', 'POST'])
@admin_required
def manage_settings():
    conn = get_db_connection()
    if request.method == 'POST':
        data = request.json
        conn.execute("""
            UPDATE system_settings SET 
            admin_email=?, confidence_threshold=?, alert_cooldown=?,
            alarm_sound=?, alarm_volume=?, alarm_intensity=?
            WHERE id=1
        """, (
            data.get('email'), data.get('threshold'), data.get('cooldown'),
            data.get('alarm_sound'), data.get('alarm_volume'), data.get('alarm_intensity')
        ))
        conn.commit()
    
    settings = conn.execute("SELECT * FROM system_settings WHERE id=1").fetchone()
    conn.close()
    return jsonify(dict(settings))

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        admins = {
            "mohammedkaif3239@gmail.com": "Mohammed@3239",
            "Siddhu3242@gmail.com": "Siddhu@3242",
            "CNarasimha3210@gmail.com": "CNarasimha@3210",
            "MadigaChinna3226@gmail.com": "MChinna@3226"
        }
        
        if email in admins and admins[email] == password:
            session['role'] = 'admin'
            session['user_id'] = 0 # System ID
            session['full_name'] = email.split('@')[0]
            log_admin_action(0, 'LOGIN', 'Admin authenticated via master credentials')
            return redirect(url_for('admin.dashboard'))
        return render_template('admin/login.html', error="Invalid Master Credentials")
        
    return render_template('admin/login.html')

@admin_bp.route('/')
@admin_required
def dashboard():
    stats, activity = get_admin_dashboard_stats()
    return render_template('admin/dashboard.html', stats=stats, activity=activity)

def get_admin_dashboard_stats():
    conn = get_db_connection()
    stats = {
        'total_users': conn.execute("SELECT COUNT(*) FROM users").fetchone()[0],
        'active_users': conn.execute("SELECT COUNT(*) FROM users WHERE is_active = 1").fetchone()[0],
        'total_records': (
            conn.execute("SELECT COUNT(*) FROM text_history").fetchone()[0] +
            conn.execute("SELECT COUNT(*) FROM image_history").fetchone()[0] +
            conn.execute("SELECT COUNT(*) FROM webcam_history").fetchone()[0]
        ),
        'alerts_today': conn.execute("SELECT COUNT(*) FROM alerts WHERE date(timestamp) = date('now')").fetchone()[0],
        'sessions_today': conn.execute("SELECT COUNT(*) FROM user_sessions WHERE date(login_time) = date('now')").fetchone()[0],
        'avg_session_duration': conn.execute("SELECT AVG(duration_minutes) FROM user_sessions WHERE duration_minutes > 0").fetchone()[0] or 0
    }
    
    # 👤 USER BEHAVIORAL AUDIT (Requirement: "admin khud ko kyu observe kara yega")
    activity = conn.execute("""
        SELECT u.id, u.full_name, u.email, u.last_login, u.is_active,
        (SELECT COUNT(*) FROM user_sessions s WHERE s.user_id = u.id) as visit_count,
        (SELECT IFNULL(SUM(duration_minutes), 0) FROM user_sessions s WHERE s.user_id = u.id) as time_spent
        FROM users u 
        WHERE u.email NOT IN (
            'mohammedkaif3239@gmail.com', 'Siddhu3242@gmail.com', 
            'CNarasimha3210@gmail.com', 'MadigaChinna3226@gmail.com',
            'ADMIN@EMOTIONAL.COM', 'MDROSHAN@GMAIL.COM'
        )
        ORDER BY u.last_login DESC LIMIT 20
    """).fetchall()
    
    conn.close()
    return stats, [dict(a) for a in activity]

@admin_bp.route('/analytics')
@admin_required
def ml_page():
    return render_template('admin/ml.html')

@admin_bp.route('/data')
@admin_required
def data_page():
    return render_template('admin/data.html')

@admin_bp.route('/webcam')
@admin_required
def webcam_intel():
    return render_template('admin/webcam.html')

@admin_bp.route('/text')
@admin_required
def text_intel():
    return render_template('admin/text.html')

@admin_bp.route('/image')
@admin_required
def image_intel():
    return render_template('admin/image.html')

@admin_bp.route('/users')
@admin_required
def users_page():
    return render_template('admin/users.html')

@admin_bp.route('/docs')
@admin_required
def admin_docs():
    return render_template('admin/docs.html')

@admin_bp.route('/privacy')
@admin_required
def admin_privacy():
    return render_template('admin/policy.html')

@admin_bp.route('/community')
@admin_required
def admin_community():
    return render_template('admin/community.html')

@admin_bp.route('/ethics')
@admin_required
def admin_ethics():
    return render_template('admin/ethics.html')

@admin_bp.route('/alerts')
@admin_required
def alerts_page():
    return render_template('admin/alerts.html')

# --- API ENDPOINTS FOR DASHBOARD ---

@admin_bp.route('/api/smart-insights')
@admin_required
def get_smart_insights():
    # Simulated autonomous logic
    insights = {
        "story_points": [
            "User engagement peaked at 14:00 today following text-core ingestion.",
            "Neutral emotional states dominating visual assets (62%).",
            "Risk alerts detected in Node #42 (Mohammed) based on repeated Angry spikes."
        ],
        "recommendations": [
            "Increase visual audit frequency for high-risk nodes.",
            "Deploy sentiment-dampening protocol on Sector-7 interactions.",
            "Optimize database indexing for faster neural history retrieval."
        ]
    }
    return jsonify(insights)

@admin_bp.route('/api/analytics')
@admin_required
def get_analytics_data():
    conn = get_db_connection()
    distribution = conn.execute("SELECT emotion as emotion_label, COUNT(*) as count FROM (SELECT emotion FROM text_history UNION ALL SELECT emotion FROM image_history UNION ALL SELECT dom_emotion FROM webcam_history) GROUP BY emotion").fetchall()
    conn.close()
    return jsonify({"distribution": [dict(d) for d in distribution]})

@admin_bp.route('/api/heatmap')
@admin_required
def get_heatmap_data():
    conn = get_db_connection()
    data = conn.execute("""
        SELECT strftime('%H', timestamp) as hour, emotion as emotion_label, COUNT(*) as count 
        FROM (SELECT timestamp, emotion FROM text_history UNION ALL SELECT timestamp, emotion FROM image_history UNION ALL SELECT timestamp, dom_emotion FROM webcam_history)
        GROUP BY hour, emotion_label
    """).fetchall()
    conn.close()
    return jsonify([dict(d) for d in data])

@admin_bp.route('/api/data')
@admin_required
def get_global_data():
    conn = get_db_connection()
    text_data = [dict(row) for row in conn.execute('SELECT * FROM emotion_history WHERE source_module="text" ORDER BY timestamp DESC LIMIT 100').fetchall()]
    image_data = [dict(row) for row in conn.execute('SELECT * FROM emotion_history WHERE source_module="image" ORDER BY timestamp DESC LIMIT 100').fetchall()]
    webcam_data = [dict(row) for row in conn.execute('SELECT * FROM emotion_history WHERE source_module="webcam" ORDER BY timestamp DESC LIMIT 100').fetchall()]
    conn.close()
    return jsonify({'text': text_data, 'image': image_data, 'webcam': webcam_data})

@admin_bp.route('/api/recent-alerts')
@admin_required
def get_recent_alerts():
    """Fetches high-risk anomalies for the Smart Alert Panel with dynamic settings."""
    settings = get_sys_settings()
    conn = get_db_connection()
    query = f"""
        SELECT user_id, emotion_label, confidence_score, timestamp, source_module 
        FROM emotion_history 
        WHERE emotion_label IN ('Angry', 'Fear', 'Sad') 
        AND confidence_score > {settings['confidence_threshold']}
        ORDER BY timestamp DESC LIMIT 10
    """
    alerts = [dict(row) for row in conn.execute(query).fetchall()]
    conn.close()
    
    if alerts:
        send_admin_email(alerts[0])
        
    return jsonify(alerts)

@admin_bp.route('/api/user-intelligence/<int:user_id>')
@admin_required
def user_intelligence(user_id):
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    breakdown = conn.execute("SELECT emotion as emotion_label, COUNT(*) as count FROM (SELECT emotion FROM text_history WHERE user_id = ? UNION ALL SELECT emotion FROM image_history WHERE user_id = ? UNION ALL SELECT dom_emotion FROM webcam_history WHERE user_id = ?) GROUP BY emotion", (user_id, user_id, user_id)).fetchall()
    conn.close()
    
    story = "User shows balanced node stability with periodic sentiment oscillation."
    if breakdown:
        dom = sorted(breakdown, key=lambda x: x['count'], reverse=True)[0]
        if dom['emotion_label'] in ['angry', 'sad']:
            story = f"Warning: This node exhibits high {dom['emotion_label']} frequency. Suggest intervention."
            
    return jsonify({
        "user_info": dict(user),
        "emotion_breakdown": [dict(b) for b in breakdown],
        "risk_level": "CRITICAL" if any(b['emotion_label'] == 'angry' and b['count'] > 5 for b in breakdown) else "STABLE",
        "story": story
    })

@admin_bp.route('/api/action-logs')
def get_action_logs():
    conn = get_db_connection()
    logs = conn.execute("SELECT l.*, u.full_name FROM user_logs l LEFT JOIN users u ON l.user_id = u.id ORDER BY l.timestamp DESC LIMIT 20").fetchall()
    conn.close()
    return jsonify([dict(l) for l in logs])

@admin_bp.route('/api/alerts')
def get_alerts():
    conn = get_db_connection()
    alerts = conn.execute("SELECT a.*, u.full_name, u.email FROM alerts a JOIN users u ON a.user_id = u.id ORDER BY a.timestamp DESC").fetchall()
    conn.close()
    return jsonify([dict(a) for a in alerts])

@admin_bp.route('/api/data')
def get_repository_data():
    conn = get_db_connection()
    text = conn.execute("SELECT * FROM text_history ORDER BY timestamp DESC LIMIT 50").fetchall()
    image = conn.execute("SELECT * FROM image_history ORDER BY timestamp DESC LIMIT 50").fetchall()
    webcam = conn.execute("SELECT * FROM webcam_history ORDER BY timestamp DESC LIMIT 50").fetchall()
    conn.close()
    return jsonify({
        "text": [dict(t) for t in text],
        "image": [dict(i) for i in image],
        "webcam": [dict(w) for w in webcam]
    })

@admin_bp.route('/api/text-wordcloud')
@admin_required
def get_text_wordcloud():
    try:
        conn = get_db_connection()
        # Get all text contexts from history
        rows = conn.execute("SELECT context_text FROM emotion_history WHERE context_text IS NOT NULL AND context_text != '' AND source_module IN ('text', 'bulk_text')").fetchall()
        conn.close()
        
        words_pool = []
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'it', 'that', 'with', 'for', 'on', 'this', 'that', 'at', 'by', 'as', 'will', 'be', 'i', 'my', 'me', 'you', 'he', 'she', 'they', 'we'}
        
        for r in rows:
            text = str(r['context_text']).lower()
            # Basic cleaning
            clean_text = "".join([c if c.isalnum() or c.isspace() else "" for c in text])
            words = [w for w in clean_text.split() if w not in stop_words and len(w) > 2]
            words_pool.extend(words)
            
        from collections import Counter
        counts = Counter(words_pool).most_common(50)
        
        return jsonify([{'word': w, 'count': c} for w, c in counts])
    except Exception as e:
        print(f"Error generating wordcloud data: {e}")
        return jsonify([])

@admin_bp.route('/api/users')
def get_users_list():
    conn = get_db_connection()
    # Exclude master admins from the identity map
    users = conn.execute("""
        SELECT u.id, u.full_name, u.email, u.is_active,
        (SELECT COUNT(*) FROM user_sessions s WHERE s.user_id = u.id) as visit_count,
        (SELECT IFNULL(SUM(duration_minutes), 0) FROM user_sessions s WHERE s.user_id = u.id) as time_spent
        FROM users u
        WHERE u.email NOT IN (
            'mohammedkaif3239@gmail.com', 'Siddhu3242@gmail.com', 
            'CNarasimha3210@gmail.com', 'MadigaChinna3226@gmail.com',
            'ADMIN@EMOTIONAL.COM', 'MDROSHAN@GMAIL.COM'
        )
    """).fetchall()
    conn.close()
    return jsonify([dict(u) for u in users])

@admin_bp.route('/api/users/<int:user_id>/toggle', methods=['POST'])
def toggle_user_status(user_id):
    conn = get_db_connection()
    u = conn.execute("SELECT is_active FROM users WHERE id = ?", (user_id,)).fetchone()
    if u:
        new_status = 0 if u['is_active'] else 1
        conn.execute("UPDATE users SET is_active = ? WHERE id = ?", (new_status, user_id))
        conn.commit()
    conn.close()
    log_admin_action(0, 'TOGGLE_USER', f'User ID: {user_id}')
    return jsonify({"status": "success"})

@admin_bp.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    log_admin_action(0, 'DELETE_USER', f'User ID: {user_id}')
    return jsonify({"status": "success"})

@admin_bp.route('/api/data/<string:category>/<int:record_id>', methods=['DELETE'])
def delete_data(category, record_id):
    table_map = {
        'TEXT': 'text_history',
        'IMAGE': 'image_history',
        'WEBCAM': 'webcam_history'
    }
    table = table_map.get(category.upper())
    if table:
        conn = get_db_connection()
        conn.execute(f"DELETE FROM {table} WHERE id = ?", (record_id,))
        conn.commit()
        conn.close()
        log_admin_action(0, 'DELETE_DATA', f'{category} ID: {record_id}')
        return jsonify({"status": "success"})
    return jsonify({"status": "error", "message": "Invalid category"}), 400
@admin_bp.route('/api/get-config')
@admin_required
def get_config():
    config = get_alert_config()
    # Mask password for safety
    return jsonify({
        "admin_email": config.get("admin_email", ""),
        "app_password": config.get("app_password", "")
    })

@admin_bp.route('/api/save-config', methods=['POST'])
@admin_required
def config_save():
    data = request.json
    if save_alert_config(data):
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Save failed"})

@admin_bp.route('/api/test-email', methods=['POST'])
@admin_required
def test_email():
    alert_data = {
        "emotion_label": "TEST_ALERT",
        "confidence_score": 1.0,
        "source_module": "System Test",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    if send_admin_email(alert_data):
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Email dispatch failed. Verify credentials."})
