from flask import Blueprint, send_file
import os

bp = Blueprint("db", __name__)


@bp.route("/db")
def download_db():
    db_path = os.path.join(os.getcwd(), "articles.db")

    if os.path.exists(db_path):
        return send_file(db_path, as_attachment=True, download_name="backup.sqlite")
    else:
        return "Database not found", 404
