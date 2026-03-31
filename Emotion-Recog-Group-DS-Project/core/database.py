import sqlite3
import os
import json
import time
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

DATABASE = 'saas_database.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

class User:
    def __init__(self, row):
        self.id = row['id']
        self.name = row['full_name']
        self.email = row['email']
        self.password = row['password_hash']
        self.role = row['role']

def get_user_by_email(email):
    conn = get_db_connection()
    user_row = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    if user_row:
        return User(user_row)
    return None

def init_db():
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT DEFAULT 'user', plan TEXT DEFAULT 'free', is_active BOOLEAN DEFAULT 1, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, last_login TEXT DEFAULT '2026-01-01 00:00:00', force_reset BOOLEAN DEFAULT 0)''')
    conn.execute('''CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        user_id INTEGER, 
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        logout_time TIMESTAMP, 
        duration_minutes REAL DEFAULT 0, 
        ip_address TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id))''')
    conn.execute('''CREATE TABLE IF NOT EXISTS text_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, text TEXT, emotion TEXT, confidence REAL, model_used TEXT, processing_time TEXT, text_length INTEGER, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id))''')
    conn.execute('''CREATE TABLE IF NOT EXISTS webcam_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, duration REAL, fps REAL, dom_emotion TEXT, avg_confidence REAL, dom_age TEXT, dom_gender TEXT, session_logs TEXT, module_name TEXT DEFAULT 'webcam', timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id))''')
    conn.execute('''CREATE TABLE IF NOT EXISTS image_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, image_path TEXT, image_source TEXT, emotion TEXT, confidence REAL, processing_time TEXT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id))''')
    conn.execute('''CREATE TABLE IF NOT EXISTS audio_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, audio_path TEXT, emotion TEXT, confidence REAL, duration REAL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id))''')
    conn.execute('''CREATE TABLE IF NOT EXISTS video_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, video_path TEXT, duration REAL, dominant_emotion TEXT, emotion_counts TEXT, confidence REAL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id))''')
    conn.execute('''CREATE TABLE IF NOT EXISTS dataset_analysis_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, dataset_name TEXT, rows_processed INTEGER, emotion TEXT, confidence REAL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id))''')
    conn.execute('''CREATE TABLE IF NOT EXISTS emotion_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, emotion_label TEXT, confidence_score REAL, source_module TEXT, context_text TEXT, language TEXT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id))''')
    conn.execute('''CREATE TABLE IF NOT EXISTS system_settings (
        id INTEGER PRIMARY KEY, 
        admin_email TEXT DEFAULT 'admin@emotionhub.io', 
        alert_enabled BOOLEAN DEFAULT 1,
        confidence_threshold REAL DEFAULT 0.70,
        alert_cooldown INTEGER DEFAULT 30)''')
    
    # Migrate/Ensure system_settings columns exist for existing DBs
    try:
        conn.execute("ALTER TABLE system_settings ADD COLUMN confidence_threshold REAL DEFAULT 0.70")
    except: pass
    try:
        conn.execute("ALTER TABLE system_settings ADD COLUMN alert_cooldown INTEGER DEFAULT 30")
    except: pass
    
    # Ensure default settings exist with your primary email
    if not conn.execute("SELECT * FROM system_settings WHERE id = 1").fetchone():
        conn.execute("INSERT INTO system_settings (id, admin_email, alert_enabled, confidence_threshold, alert_cooldown) VALUES (1, 'mohammedkiaf8297@gmail.com', 1, 0.70, 30)")
    else:
        # Force update to the requested email
        conn.execute("UPDATE system_settings SET admin_email='mohammedkiaf8297@gmail.com' WHERE id=1")
    conn.execute('''CREATE TABLE IF NOT EXISTS user_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, action TEXT, details TEXT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id))''')
    conn.execute('''CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, alert_type TEXT, message TEXT, severity TEXT, status TEXT DEFAULT 'active', timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id))''')

    # Seeding
    from werkzeug.security import generate_password_hash
    admin = conn.execute("SELECT * FROM users WHERE email = 'admin@emotionai.com'").fetchone()
    if not admin:
        conn.execute("INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
                     ("System Administrator", "admin@emotionai.com", generate_password_hash("admin123"), "admin"))
    
    conn.commit()
    conn.close()

def save_json_backup(category, data):
    path = os.path.join('storage', f'{category}.json')
    os.makedirs('storage', exist_ok=True)
    try:
        with open(path, 'r') as f: existing = json.load(f)
    except: existing = []
    existing.append(data)
    with open(path, 'w') as f: json.dump(existing, f, indent=4)

def log_session(user_id, ip='127.0.0.1'):
    try:
        conn = get_db_connection()
        conn.execute('INSERT INTO user_sessions (user_id, ip_address) VALUES (?,?)', (user_id, ip))
        conn.execute('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', (user_id,))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Session Log Error: {e}")

# 📧 SMTP LIVE CONFIGURATION (For: "on the spot auto email message")
SMTP_SENDER = 'mohammedkiaf8297@gmail.com'
SMTP_PWD = 'YOUR_APP_PASSWORD_HERE' # 🚨 PLEASE UPDATE THIS KEY FOR REAL SENDING
_last_alert_time = 0

def send_admin_alert_email(alert_data):
    """Internal helper to dispatch real-time SMTP alerts from the database layer."""
    global _last_alert_time
    conn = get_db_connection()
    s = conn.execute("SELECT * FROM system_settings WHERE id = 1").fetchone()
    conn.close()
    if not s: return
    
    settings = dict(s)
    current_time = time.time()
    
    # Check Cooldown (Default 30s)
    cooldown = settings.get('alert_cooldown') or 30
    if (current_time - _last_alert_time) < cooldown:
        # print(f"🛡️ [SMTP] Cooldown Active. Skipping for {int(cooldown - (current_time - _last_alert_time))}s")
        return
        
    recipient = settings.get('admin_email', 'mohammedkiaf8297@gmail.com')
    msg = MIMEMultipart()
    msg['From'] = f"Emotion AI Security Core <{SMTP_SENDER}>"
    msg['To'] = recipient
    msg['Subject'] = f"🚨 SECURITY ANOMALY: {alert_data['label'].upper()} DETECTED"

    body = f"""
    SYSTEM-WIDE EMOTION ALERT DISPATCH
    ----------------------------------
    Identity: {alert_data['user_id']}
    Behavioral Path: {alert_data['source']}
    Detected Tone: {alert_data['label']}
    Confidence: {float(alert_data['confidence'])*100:.2f}%
    Timestamp: {alert_data['timestamp']}
    
    Action: Security Center alerted. Neural Dashboard Beep Activated.
    """
    msg.attach(MIMEText(body, 'plain'))

    try:
        if SMTP_PWD == 'YOUR_APP_PASSWORD_HERE':
            # print("⚠️ [SMTP ERROR] YOUR_APP_PASSWORD_HERE is not set. Email cannot be delivered.")
            # print("👉 Please generate a Google App Password to enable REAL-TIME sending.")
            return False
            
        print(f"📡 [SMTP] Attempting Dispatch to {recipient}...")
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.set_debuglevel(0)
        server.starttls()
        server.login(SMTP_SENDER, SMTP_PWD)
        server.sendmail(SMTP_SENDER, recipient, msg.as_string())
        server.close()
        print(f"✅ [SMTP] Critical Alert successfully DISPATCHED to {recipient}")
        _last_alert_time = current_time
        return True
    except Exception as e:
        print(f"❌ [SMTP FAILURE] Details: {e}")
        return False

def log_emotion(user_id, label, confidence, source, context=None, language='en', timestamp=None):
    try:
        if not timestamp:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
        conn = get_db_connection()
        conn.execute('INSERT INTO emotion_history (user_id, emotion_label, confidence_score, source_module, context_text, language, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
                     (user_id, label, confidence, source, context, language, timestamp))
        
        # 🚨 LIVE TRIGGER (Requirement: "on the spot auto email message for this emotion")
        s = conn.execute("SELECT * FROM system_settings WHERE id = 1").fetchone()
        if s:
            settings = dict(s)
            if label.lower() in ['angry', 'fear', 'sad'] and confidence > settings.get('confidence_threshold', 0.70):
                send_admin_alert_email({
                    'user_id': user_id, 'label': label, 'confidence': confidence, 
                    'source': source, 'timestamp': timestamp
                })
        
        if label.lower() in ['angry', 'fear'] and confidence > 0.8:
            conn.execute("INSERT INTO alerts (user_id, alert_type, message, severity) VALUES (?, ?, ?, ?)",
                         (user_id, label.upper() + ' SPIKE', f"High intensity {label} detected.", 'high'))
        
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Failed to log emotion: {e}")

def log_action(user_id, action, details):
    try:
        conn = get_db_connection()
        conn.execute('INSERT INTO user_logs (user_id, action, details) VALUES (?, ?, ?)', (user_id, action, details))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Audit Log Error: {e}")

def log_admin_action(admin_id, action, details):
    try:
        conn = get_db_connection()
        conn.execute('INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)', (admin_id, action, details))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Admin Audit Log Error: {e}")
