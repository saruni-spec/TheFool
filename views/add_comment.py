from flask import Blueprint, request, jsonify
from models.article import Article

bp = Blueprint("add_comment", __name__)


@bp.route("/add_comment", methods=["POST"])
def add_comment():
    article_title = request.form.get("article_id")
    content = request.form.get("content")
    author = request.form.get("author")

    comment = {"content": content, "author": author}

    article = Article()
    article.add_comment(article_title, comment=comment)

    # Return JSON response instead of redirecting
    return jsonify({"success": True, "author": author, "content": content})
