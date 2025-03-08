from flask import Blueprint, request

bp = Blueprint("cache_control", __name__)


@bp.after_app_request
def add_cache_control(response):
    # Add cache control headers to static files
    if request.path.startswith("/static/"):
        # CSS files - cache for 1 week
        if request.path.endswith(".css"):
            response.headers["Cache-Control"] = "public, max-age=604800"
    return response
