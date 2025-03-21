from flask import Blueprint, request, jsonify
from models.article import Article, Reader

bp = Blueprint("add_comment", __name__)


@bp.route("/add_comment", methods=["POST"])
def add_comment():
    article_title = request.form.get("article_id")
    content = request.form.get("content")
    author_name = request.form.get("author")

    # Create or get reader
    reader = Reader()
    user_id = None

    # In a real app, you'd likely get the user_id from session
    # For now, we'll use the author name as a simple user identifier
    reader_id = reader.get_or_create(author_name)

    # Add the comment
    article = Article()
    success = article.add_comment(article_title, reader_id, content)

    # Return JSON response
    return jsonify({"success": success, "author": author_name, "content": content})
