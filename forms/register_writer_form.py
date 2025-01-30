from flask_wtf import FlaskForm
from wtforms import SelectMultipleField,widgets,TextAreaField,BooleanField,StringField
from wtforms.validators import DataRequired,Email,EqualTo

class RegisterWriterForm(FlaskForm):
    topics=SelectMultipleField("What topics would you want to write about",choices=[
        ('technology','Tech'),('potitics','Politics'),
        ('physics','Physics'),('health','Health'),
        ('psychology','Psychology'),('philosophy','philosophy')],
        option_widget=widgets.CheckboxInput(),
        widget=widgets.ListWidget(prefix_label=False))
    experience=BooleanField('have you published articles before? Select if Yes',default=False)
    article=TextAreaField("submit an article or a url to article published",validators=[DataRequired()])




