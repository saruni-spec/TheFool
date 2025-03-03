from flask import render_template, Blueprint, current_app
from models.article import Article
from cachelib import SimpleCache

bp = Blueprint("home", __name__)
cache = SimpleCache()


def cached_articles():
    cache_key = "all_articles"
    articles = cache.get(cache_key)
    if not articles:
        articles = Article().get_all()
        # Cache indefinitely (0 seconds means never expire)
        cache.set(cache_key, articles, timeout=0)
    return articles


@bp.route("/")
@bp.route("/home")
def home():
    with current_app.app_context():
        return render_template("home.html", articles=cached_articles())
