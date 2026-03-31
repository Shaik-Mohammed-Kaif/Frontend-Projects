from flask import Blueprint, render_template, session
from core.utils import login_required

analytics_bp = Blueprint('analytics_hub', __name__)

@analytics_bp.route('/analytics')
@login_required
def analytics_page():
    return render_template('analytics.html', user=session)
