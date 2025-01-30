
from flask import render_template,Blueprint,redirect,current_app,request,session
from forms.register_user_form import UserForm
from flask import url_for
from flask_mail import Message
import random


def generate_verification_code():
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    length = 6
    code = ''.join(random.choices(chars, k=length))
    return code

bp=Blueprint('register_user',__name__)

@bp.route('/register_user',methods=['POST','GET'])
def register_user():
    from app import mail
    with current_app.app_context():
        form=UserForm()
        email_error = ''
        if request.method=='POST':
            if form.validate_on_submit():
                username=form.username.data
                password=form.password.data
                accept_terms=form.be_writer.data
                session['username']=username
                session['password']=password
                
                if accept_terms is False:
                    return render_template('register_user.html',form=form,email_error='You have not accepted terms and policies')
                else:
                    with open('/home/boss/TheFool/TheFool/Blog/template/confirmation.html', 'r') as f:
                        html_content = f.read()
                    email = username
                    confirmation_code = generate_verification_code() 
                    message = Message('Confirmation Code', recipients=[email])
                    message.html = html_content.format(confirmation_code=confirmation_code)
                    mail.send(message)
                    session['confirmation_code'] = confirmation_code
                    print(confirmation_code,'confirmation')
                    return redirect(url_for('verification.verification', email=email)) 
            else:
                print(form.errors)
            if 'password' in form.errors:
                form.password_error = form.errors['password'][0]
            else:
                email_error = form.errors.get('username', '')
            
        return render_template('register_user.html',form=form,email_error=email_error)


    
