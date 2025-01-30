from flask import render_template, Blueprint, current_app
from models.article import Article
from cachelib import SimpleCache

bp = Blueprint("home", __name__)

cache = SimpleCache()


def cached_articles():
    cache_key = "articles"
    data = cache.get(cache_key)
    if data is None:
        data = Article().get_all()
        cache.set(cache_key, data, timeout=60)
    return data


@bp.route("/home", methods=["POST", "GET"])
def home():
    with current_app.app_context():
        articles = cached_articles()

        return render_template("home.html", articles=articles)
