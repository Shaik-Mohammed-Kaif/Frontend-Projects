from functools import wraps
from flask import session, redirect, url_for, flash

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash("Please log in to access this module.", "info")
            return redirect(url_for('auth.login_page'))
        
        # 🔥 REQUIREMENT: Admins are RESTRICTED from using standard User Webapp modules
        if session.get('role') == 'admin':
            return "<div style='background:#111;color:#f43f5e;height:100vh;display:flex;align-items:center;justify-content:center;font-family:monospace;flex-direction:column;text-align:center;'><h1>[RESTRICTED ACCESS]</h1><p>Administrative Nodes are prohibited from Standard Interface Operations.<br>Please use the Strategic Intelligence Dashboard.</p><a href='/admin' style='color:#6366f1;margin-top:20px;text-decoration:none;border:1px solid #6366f1;padding:10px 20px;border-radius:8px;'>Return to Admin Panel</a></div>", 403
            
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('role') != 'admin':
            return "<div style='background:#111;color:#f43f5e;height:100vh;display:flex;align-items:center;justify-content:center;font-family:monospace;flex-direction:column;text-align:center;'><h1>[ACCESS DENIED]</h1><p>Infrastructure Node Restricted. Authority Level 4 Required.</p></div>", 403
        return f(*args, **kwargs)
    return decorated_function
