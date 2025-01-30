from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField,BooleanField
from wtforms.validators import DataRequired,Email,EqualTo
from wtforms import ValidationError

class StrongPassword(object):
    def __init__(self, message=None):
        if not message:
            message = 'Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        self.message = message

    def __call__(self, form, field):
        password = field.data
        if len(password) < 12 or \
                not any(char.isupper() for char in password) or \
                not any(char.islower() for char in password) or \
                not any(char.isdigit() for char in password) or \
                not any(char in '!@#$%^&*()_+-=,./?;:[]{}|' for char in password):
            form.password_error = self.message
            raise ValidationError(self.message)
        else:
            form.password_error = ''


class UserForm(FlaskForm):
    username=StringField("Email",validators=[DataRequired(),Email()])
    password=PasswordField("Password",validators=[DataRequired(),StrongPassword()])
    confirm_password=PasswordField("confirm_password",validators=[DataRequired(),EqualTo('password')])
    be_writer=BooleanField("WAnt to write articles?",default=False)

    def validate_password(form, field):
        password = field.data
        if len(password) < 12:
            raise ValidationError("Password must be at least 12 characters long.")
        elif not any(char.isdigit() for char in password):
            raise ValidationError("Password must contain at least one digit.")
        elif not any(char.isupper() for char in password):
            raise ValidationError("Password must contain at least one uppercase letter.")
        elif not any(char.islower() for char in password):
            raise ValidationError("Password must contain at least one lowercase letter.")
        elif not any(char in "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?`~" for char in password):
            raise ValidationError("Password must contain at least one special character.")

    password_error = ''