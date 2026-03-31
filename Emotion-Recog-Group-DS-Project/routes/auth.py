from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from core.database import get_db_connection, get_user_by_email
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/')
def home():
    return render_template('home.html')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login_page():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        # 🔥 SECURE ADMIN INFRASTRUCTURE ACCESS (MANDATED 4 ADMINS + ALTERNATES)
        ADMIN_CREDENTIALS = {
            "mohammedkaif3239@gmail.com": "Mohammed@3239",
            "mohammed3239@gmail.com": "Mohammed@3239", # Added per User Request
            "Siddhu3242@gmail.com": "Siddhu@3242",
            "CNarasimha3210@gmail.com": "CNarasimha@3210",
            "MadigaChinna3226@gmail.com": "MChinna@3226"
        }
        
        if email in ADMIN_CREDENTIALS and password == ADMIN_CREDENTIALS[email]:
            session.clear()
            session["user_id"] = 0 # Root Authority Node
            session["user_name"] = email.split('@')[0].capitalize() + " Admin"
            session["full_name"] = email.split('@')[0].capitalize() + " Admin"
            session["role"] = "admin"
            session.permanent = True
            
            # Log Admin Login
            conn = get_db_connection()
            conn.execute('INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)', (0, 'LOGIN', f'Admin {email} logged into Infrastructure Control'))
            conn.commit(); conn.close()
            
            return redirect(url_for('admin.dashboard'))
            
        user = get_user_by_email(email)
        
        if user and check_password_hash(user.password, password):
            # Requirements: create session: session["user_id"] = user.id, session["user_name"] = user.name
            session.clear()
            session["user_id"] = user.id
            session["user_name"] = user.name
            # For UI compatibility (base.html uses full_name)
            session["full_name"] = user.name
            # For Dashboard logic (role check)
            session["role"] = user.role
            session.permanent = True
            
            # Using standard session intelligence helper
            from core.database import log_session
            log_session(user.id, request.remote_addr)
            
            return redirect("/user-home")
        else:
            return render_template("login.html", error="Invalid email or password")
            
    return render_template('login.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register_page():
    if request.method == 'POST':
        full_name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        
        if not full_name or not email or not password:
            flash("All fields are required.", "error")
            return redirect(url_for('auth.register_page'))
            
        conn = get_db_connection()
        if conn.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone():
            flash("Email already registered.", "error")
            conn.close()
            return redirect(url_for('auth.register_page'))
            
        conn.execute('INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
                     (full_name, email, generate_password_hash(password)))
        conn.commit(); conn.close()
        flash("Registration successful. Please login.", "success")
        return redirect(url_for('auth.login_page'))
    return render_template('register.html')

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash("Successfully logged out.", "success")
    return redirect(url_for('auth.login_page'))
