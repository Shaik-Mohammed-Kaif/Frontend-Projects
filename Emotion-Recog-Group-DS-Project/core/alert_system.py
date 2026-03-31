import os
import json
import smtplib
import threading
import time
from datetime import datetime
from email.message import EmailMessage

CONFIG_PATH = os.path.join(os.getcwd(), 'config.json')
ALERTS_DIR = os.path.join(os.getcwd(), 'alerts')

# Ensuring Alerts Directory
if not os.path.exists(ALERTS_DIR):
    os.makedirs(ALERTS_DIR, exist_ok=True)

class AlertSystem:
    _last_alert_time = 0
    _lock = threading.Lock()

    @staticmethod
    def get_config():
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

    @staticmethod
    def trigger_webcam_alert(emotion, confidence, frame):
        """Main entry point for webcam triggers."""
        config = AlertSystem.get_config()
        current_time = time.time()
        cooldown = config.get('cooldown_seconds', 10)

        with AlertSystem._lock:
            if (current_time - AlertSystem._last_alert_time) < cooldown:
                return False
            AlertSystem._last_alert_time = current_time

        # 1. Save Image Proof
        timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"webcam_{emotion.lower()}_{timestamp_str}.jpg"
        filepath = os.path.join(ALERTS_DIR, filename)
        
        import cv2
        cv2.imwrite(filepath, frame)

        # 2. Dispatch Threaded Email
        alert_data = {
            "emotion": emotion,
            "confidence": confidence,
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "image_path": filepath
        }
        
        thread = threading.Thread(target=AlertSystem._send_email, args=(alert_data,))
        thread.daemon = True
        thread.start()
        return True

    @staticmethod
    def _send_email(data):
        config = AlertSystem.get_config()
        admin_email = config.get('admin_email', '').strip()
        raw_password = config.get('app_password', '').strip()

        # 🔍 ROOT CAUSE FIX 1: Remove all spaces from App Password
        app_password = raw_password.replace(" ", "")

        # 🧠 ROOT CAUSE FIX 4: Credential Validation
        if not admin_email or not app_password:
            print("⚠️ Alert System Error: Admin Email or App Password is empty!")
            return

        msg = EmailMessage()
        msg['Subject'] = f"🚨 EMERGENCY ALERT: {data['emotion'].upper()}"
        msg['From'] = admin_email
        msg['To'] = admin_email

        body = f"""
🚨 EMERGENCY ALERT DETECTED

📌 Module     : Webcam Emotion Detection
👤 User       : Camera S1 (Live Ingress)
😡 Emotion    : {data['emotion'].upper()}
📊 Confidence : {float(data['confidence']) * 100:.1f}%

🕒 Time       : {data['time']}

⚠️ Reason     :
Unusual emotional behavior detected (Risk Emotion Detected)

📎 Proof      :
Visual evidence captured from webcam node (See Attachment)

🔍 System     :
EmotionAI Surveillance Engine v2.4
"Automated high-priority alert. Processed via Neural Incursion Calibration."
        """
        msg.set_content(body)

        # 📎 ATTACHMENT PROOF
        if os.path.exists(data['image_path']):
            with open(data['image_path'], 'rb') as f:
                file_data = f.read()
                file_name = os.path.basename(data['image_path'])
                msg.add_attachment(file_data, maintype='image', subtype='jpeg', filename=file_name)

        try:
            # 🔐 SMTP SSL SETTINGS (Port 465)
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                # 🔍 ROOT CAUSE FIX 3: SMTP Debug Logging
                smtp.set_debuglevel(1)
                
                smtp.login(admin_email, app_password)
                smtp.send_message(msg)
            print(f"✅ Alert Dispatch SUCCESS to {admin_email}")
        except Exception as e:
            print(f"❌ Alert Dispatch FAILURE Detail: {e}")
