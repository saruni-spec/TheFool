from flask_login import logout_user,login_required
from flask import Blueprint,redirect,current_app

bp=Blueprint('logout',__name__)

bp.route('/logout')

@bp.route('/logout')
@login_required
def logout():
    with current_app.app_context():
        logout_user()
        return redirect('/login')