from flask import Blueprint, render_template, request, redirect, url_for,session,make_response
from flask_wtf.csrf import validate_csrf
from wtforms.validators import ValidationError
from models.reader import Reader
from flask_login import login_user
from datetime import timedelta


def  get_confirmation_code():
    return session.get('confirmation_code', None)  

bp=Blueprint('verification', __name__)

@bp.route('/confirmation/<email>', methods=['GET', 'POST'])
def verification(email):
    if request.method == 'POST':
        token = request.form.get('csrf_token')
        try:
            validate_csrf(token)
        except ValidationError as error:
            print('error in article_edit csrf',error)
        confirmation_code = request.form.get('confirmation_code')
        
        code=get_confirmation_code()
        print(code,'verify')
        if confirmation_code == code:  
            username=session.get('username',None)
            password=session.get('password',None)
            reader=Reader(username)
            reader.save(password)
            login_user(reader)
            response = make_response(redirect('home'))
            response.set_cookie('username', username, max_age=timedelta(days=1))
            return response
        else:
            return render_template('verification.html', email=email, error='Invalid confirmation code')
    return render_template('verification.html', email=email)


