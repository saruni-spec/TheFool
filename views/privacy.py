from flask import Blueprint,render_template

bp = Blueprint('terms', __name__)

@bp.route('/terms')
def terms():
    return render_template('terms.html')
