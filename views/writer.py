from forms.register_writer_form import RegisterWriterForm
from flask import Blueprint, render_template,current_app,redirect
from models.draft import Draft
from flask_login import login_required


def name(list):
    if list :
        username=list[0]
        return username
    else:
        return ''
    

bp = Blueprint('register_writer', __name__)

@login_required
@bp.route('/register_writer/<username>', methods=['POST', 'GET'])
def verify_writer(username):
    with current_app.app_context():
        save_name=name('applicant')
        form = RegisterWriterForm()
        if form.validate_on_submit():
            topics =','.join( form.topics.data)
            article = form.article.data
            draft=Draft(save_name,topics,article)
            draft.save()
            return redirect('/home')
        return render_template('register_writer.html', username=username,form=form)

