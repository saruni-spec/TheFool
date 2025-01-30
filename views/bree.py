from flask import render_template, current_app,Blueprint,request
from models.article import Article
from flask_wtf.csrf import validate_csrf
from wtforms.validators import ValidationError

bp=Blueprint('bree',__name__)

@bp.route('/bree',methods=['GET','POST'])
def bree():
    with current_app.app_context():
        if request.method == 'POST':
            token = request.form.get('csrf_token')
            try:
                validate_csrf(token)
            except ValidationError as error:
                print('error in article_edit csrf',error)
            if request.form['submit'] == 'view':
                title=request.form.get('title')
                article=Article.get(title)
                article_content=article[1]
                return render_template('bree.html',title=title,article_content=article_content)
            elif request.form['submit'] == 'update':
                title=request.form.get('title')
                article_content=request.form.get('article_content')
                Article.update(title,article_content)
            elif request.form['submit'] == 'save':
                title=request.form.get('title')
                article_content=request.form.get('article_content')
                article=Article(title,article_content,writer='bree')
                article.save()
            elif request.form['submit'] == 'post':
                title=request.form.get('title')
                article=Article(title,article_content,writer='bree')
                article.save()
                    
        return render_template('bree.html')