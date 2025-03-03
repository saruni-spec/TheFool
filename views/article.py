from flask import render_template, request, Blueprint, current_app
from models.article import Article
from ast import literal_eval
from cachelib import SimpleCache

cache = SimpleCache()


# convert string to list
def convert_str(comments):
    if comments is None:
        return []
    try:
        return literal_eval(comments)
    except (ValueError, SyntaxError):
        return []


bp = Blueprint("article", __name__)


@bp.route("/article/<title>")
def article(title):
    with current_app.app_context():
        # Cache individual articles
        cache_key = f"article_{title}"
        article_data = cache.get(cache_key)

        if not article_data:
            article_data = Article().get(title)
            if article_data:
                # Cache indefinitely if article exists
                cache.set(cache_key, article_data, timeout=0)
            else:
                return "Article not found", 404

        comments = convert_str(article_data[2])
        return render_template(
            "article.html",
            title=article_data[0],
            content=article_data[1],
            comments=comments,
        )
