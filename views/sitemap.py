from flask import Blueprint, send_from_directory, current_app

bp = Blueprint("sitemap", __name__)


@bp.route("/sitemap.xml")
def sitemap():
    # Serve the existing sitemap.xml file from the root directory
    return send_from_directory(current_app.root_path, "sitemap.xml")
