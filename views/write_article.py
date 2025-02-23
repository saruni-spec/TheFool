from flask import Blueprint, render_template, request, redirect
from models.article import Article
from flask_login import login_required

bp = Blueprint("write_article", __name__)


@bp.route("/write_article", methods=["POST", "GET"])
@login_required
def write_article():
    if request.method == "POST":
        article_name = request.form.get("title")
        article_content = request.form.get("article_content")
        article = Article()
        article.save(article_content, title=article_name)
        return redirect("/write_article")
    return render_template("write_article.html")
