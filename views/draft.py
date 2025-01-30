from flask import Blueprint,current_app,render_template,request,redirect
from models.draft import Draft
from models.writers import Writer
from flask_wtf.csrf import validate_csrf
from wtforms import ValidationError
from flask_login import login_required



    

bp=Blueprint('draft',__name__)

@bp.route('/draft/<username>',methods=['GET','POST'])
@login_required
def draft(username):
    with current_app.app_context():
        token = request.form.get('csrf_token')
        try:
            validate_csrf(token)
        except ValidationError as error:
            print('error in draft csrf',error)
        draft=Draft.get(username)
        if request.method=='POST':        
            accept_writer = request.form.get('accept_writer')
            if accept_writer is not None:
                writer=Writer(draft[0],draft[1],draft[2])
                writer.save()
                return redirect('/read_draft')
            else:
                Draft.delete(draft[0])
                return redirect('/read_draft')
        
        return render_template('draft.html',username=draft[0],article=draft[2],topics=draft[1])
    
