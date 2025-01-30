from flask import render_template, request, Blueprint, current_app
from models.article import Article


bp = Blueprint("article", __name__)


@bp.route("/article/<title>")
def article(title):
    with current_app.app_context():
        article = Article().get(title)

        return render_template("article.html", title=article[0], content=article[1])
