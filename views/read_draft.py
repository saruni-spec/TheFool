from flask import render_template, current_app
from flask import Blueprint
from models.draft import Draft
from flask_login import login_required

bp = Blueprint('read_draft', __name__)


@bp.route("/read_draft", methods=['POST', 'GET'])
@login_required
def read_draft():
    with current_app.app_context():
        drafts = Draft.get(username='all')
        
        return render_template("editor.html", drafts=drafts)
