from flask import render_template, Blueprint, request, current_app
from models.article import Article
from flask_wtf.csrf import validate_csrf
from wtforms.validators import ValidationError
from flask_login import login_required


bp = Blueprint("edit_articles", __name__)


@bp.route("/edit_articles", methods=["GET", "POST"])
@login_required
def edit_articles():
    with current_app.app_context():
        if request.method == "POST" and request.form["form_name"] == "view":
            token = request.form.get("csrf_token")
            try:
                validate_csrf(token)
            except ValidationError as error:
                print("error in article_edit csrf", error)
            title = request.form.get("title")
            article = Article().get(title)
            if article is not None:
                article_content = article[1]
            else:
                article_content = ""
            return render_template(
                "edit_articles.html", title=title, article_content=article_content
            )
        if request.method == "POST" and request.form["form_name"] == "update":
            token = request.form.get("csrf_token")
            try:
                validate_csrf(token)
            except ValidationError as error:
                print("error in article_edit csrf", error)
            title = request.form.get("title")
            content = request.form.get("article_content")
            Article().update(title, content)

            return render_template(
                "edit_articles.html", title="", article_content="update complete!"
            )
        return render_template("edit_articles.html")
