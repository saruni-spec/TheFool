from flask import render_template, request, Blueprint, current_app
from models.article import Article
from ast import literal_eval


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
        article = Article().get(title)
        comments_str = article[2]
        comments = convert_str(comments_str)

        return render_template(
            "article.html",
            title=article[0],
            content=article[1],
            comments=comments,
        )
