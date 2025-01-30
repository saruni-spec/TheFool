from flask import render_template,Blueprint,redirect,current_app,make_response
from forms.login_form import LoginForm
from werkzeug.security import check_password_hash
from flask_login import login_user
from models.reader import Reader
from datetime import timedelta
from flask import session



bp=Blueprint('login',__name__)

@bp.route('/login', methods=['POST', 'GET'])
def login():
    with current_app.app_context():
        form = LoginForm()
        error = None
        if form.validate_on_submit():
            username = form.username.data
            password = form.password.data
            user = Reader.get(username)
            
            if user is None or not user:
                error = 'Invalid username or password'
                
            elif user and check_password_hash(user[1], password):
                print(username, ' login')

                reader = Reader(username)
                login_user(reader)
                next_url = session.get('next_url', '/home')
                print(next_url,'next url')
                response = make_response(redirect(next_url))
                response.set_cookie('username', username, max_age=timedelta(days=1))
                return response
            else:
                error = 'Invalid username or password'
                
        
        return render_template('login.html', form=form, error=error)