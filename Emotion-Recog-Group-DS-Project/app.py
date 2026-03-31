import os
from flask import Flask, session, request, jsonify, url_for, render_template, redirect
from core.database import init_db, log_emotion, get_db_connection
from analytics_store import get_all_data
from core.utils import login_required
from datetime import timedelta

# REFRESH TRIGGER: 13:16

# Blueprints
from routes.auth import auth_bp
from routes.additional_features import additional_bp
from routes.text_routes import text_bp
from routes.dashboard import dashboard_bp
from routes.analytics import analytics_bp
from routes.info_routes import info_bp
from routes.admin import admin_bp

app = Flask(__name__)
app.secret_key = "your_secret_key"
app.permanent_session_lifetime = timedelta(days=30)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(text_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(additional_bp)
app.register_blueprint(info_bp)
app.register_blueprint(admin_bp, url_prefix='/admin')

# New Production Image Module
from modules.image_module import image_bp
app.register_blueprint(image_bp)


# Global Shared AI services (initialized once in core.shared)
from core.shared import ai, webcam

@app.route("/")
def index():
    """Enterprise Landing Page"""
    return jsonify({"status": "Online", "engine_version": "Hybrid 2.0"}), 200

@app.route("/api/history")
def history_api():
    """STRICT API: Get all historical data"""
    return jsonify(get_all_data())

# Admin route is now handled by admin_bp

if __name__ == '__main__':
    os.makedirs('static/uploads', exist_ok=True)
    init_db()
    app.run(debug=True, threaded=True)
