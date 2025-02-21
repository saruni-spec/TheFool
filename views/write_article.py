from flask import render_template, Blueprint, redirect, current_app
from models.article import Article
from forms.write_article_form import WriteArticleForm
from flask_login import login_required


bp = Blueprint("write_article", __name__)


@bp.route("/write_article", methods=["POST", "GET"])
@login_required
def write_article():
    with current_app.app_context():
        form = WriteArticleForm()
        if form.validate_on_submit():
            article_name = form.title.data
            article_content = form.article.data
            article = Article(article_name)
            article.save(article_content, writer="")
            return redirect("/write_article")

        else:
            return render_template("write_article.html", form=form)
