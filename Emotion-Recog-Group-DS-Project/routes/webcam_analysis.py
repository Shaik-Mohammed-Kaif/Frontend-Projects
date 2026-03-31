import json
from flask import Blueprint, render_template, Response, session, jsonify
from core.database import get_db_connection, log_emotion
from core.utils import login_required

webcam_bp = Blueprint('webcam_analysis', __name__)

@webcam_bp.route('/webcam')
@login_required
def webcam_page():
    return render_template('webcam_module.html', user=session)

@webcam_bp.route('/video_feed')
@login_required
def video_feed():
    from app import webcam
    def gen(cam):
        while cam.is_running:
            frame = cam.get_frame()
            if frame:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    
    if not webcam.is_running: webcam.start()
    return Response(gen(webcam), mimetype='multipart/x-mixed-replace; boundary=frame')

@webcam_bp.route('/webcam-status')
@login_required
def webcam_status():
    from app import webcam
    return jsonify({
        "running": webcam.is_running,
        "emotion": webcam.cur_emotion,
        "confidence": round(webcam.cur_conf, 2),
        "fps": round(webcam.fps, 1)
    })

@webcam_bp.route('/webcam-stop', methods=['POST'])
@login_required
def webcam_stop():
    from app import webcam
    if webcam.is_running:
        webcam.stop()
        log_emotion(session['user_id'], webcam.cur_emotion, webcam.cur_conf, 'webcam')
        
        # Save session history
        duration = round(time.time() - webcam.start_time, 2) if webcam.start_time else 0
        conn = get_db_connection()
        conn.execute('INSERT INTO webcam_history (user_id, duration, fps, dom_emotion, avg_confidence) VALUES (?, ?, ?, ?, ?)',
                     (session['user_id'], duration, webcam.fps, webcam.cur_emotion, webcam.cur_conf))
        conn.commit(); conn.close()
        return jsonify({"success": True})
    return jsonify({"success": False})
