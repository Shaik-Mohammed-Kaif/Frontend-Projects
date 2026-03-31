from flask import Blueprint, render_template, send_file
import os

info_bp = Blueprint('info', __name__)

@info_bp.route('/assets/<path:filename>')
def serve_public_assets(filename):
    # Mapping to the artifacts directory
    base_path = r"C:\Users\Admin\.gemini\antigravity\brain\ddca744c-84b5-4cdb-a12c-0c0caa78eb23"
    return send_file(os.path.join(base_path, filename))

@info_bp.route('/docs')
def documentation():
    return render_template('docs.html')

@info_bp.route('/api-docs')
def api_reference():
    return render_template('api_docs.html')

@info_bp.route('/community')
def community():
    return render_template('community.html')

@info_bp.route('/terms')
def terms():
    return render_template('terms.html')

@info_bp.route('/privacy')
def privacy():
    return render_template('policy.html')

@info_bp.route('/ethics')
def ethics():
    return render_template('ethics.html')
