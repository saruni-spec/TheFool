from flask_wtf import FlaskForm
from wtforms import TextAreaField,StringField
from wtforms.validators import DataRequired

class WriteArticleForm(FlaskForm):
    title=StringField('title',validators=[DataRequired()])
    article=TextAreaField('article',validators=[DataRequired()])