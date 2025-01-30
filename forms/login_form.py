from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField
from wtforms.validators import Email,DataRequired,ValidationError


class LoginForm(FlaskForm):
    username=StringField('Email',validators=[DataRequired(),Email()])
    password=PasswordField('password',validators=[DataRequired()])

    
