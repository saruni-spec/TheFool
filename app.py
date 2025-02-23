from flask import Flask
from flask import redirect, flash
from flask_mail import Mail
from models.reader import Reader
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from views.home import bp as home_bp
from views.login import bp as login_bp
from views.article import bp as article_bp
from views.write_article import bp as write_article_bp
from views.register_user import bp as register_user_bp
from views.read_draft import bp as read_draft_bp
from views.writer import bp as register_writer_bp
from views.draft import bp as draft_bp
from views.about import bp as about_bp
from views.privacy import bp as privacy_bp
from views.help import bp as help_bp
from views.edit_article import bp as edit_article_bp
from views.logout import bp as logout_bp
from views.verification import bp as verification_bp
from views.add_comment import bp as add_comment_bp
from views.database import bp as db_bp
from flask import session, request


app = Flask(__name__, template_folder="template", static_folder="static")

app.config["SECRET_KEY"] = "mysecretkey"

app.register_blueprint(verification_bp)
app.register_blueprint(home_bp)
app.register_blueprint(login_bp)
app.register_blueprint(article_bp)
app.register_blueprint(write_article_bp)
app.register_blueprint(register_user_bp)
app.register_blueprint(register_writer_bp)
app.register_blueprint(read_draft_bp)
app.register_blueprint(draft_bp)
app.register_blueprint(about_bp)
app.register_blueprint(privacy_bp)
app.register_blueprint(help_bp)
app.register_blueprint(edit_article_bp)
app.register_blueprint(logout_bp)
app.register_blueprint(add_comment_bp)
app.register_blueprint(db_bp)


# Serve static files
@app.route("/static/<path:path>")
def static_file(path):
    return app.send_static_file(path)


@app.route("/")
def index():
    return redirect("/home")


csrf = CSRFProtect()
csrf.init_app(app)


login_manager = LoginManager(app)
login_manager.login_view = "login.login"


@login_manager.user_loader
def load_user(username):
    # This callback is used by the login manager to load the current user.

    return Reader(username)


@app.before_request
def store_next_url():
    if request.endpoint != "login.login" and request.endpoint != "static":
        session["next_url"] = request.url
        print(session["next_url"])


@login_manager.unauthorized_handler
def unauthorized():
    flash("You must be logged in to log out.")
    return redirect("/login")


app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "oddsthingshere@gmail.com"
app.config["MAIL_PASSWORD"] = "uwit xwod fcuu upee"
app.config["MAIL_DEFAULT_SENDER"] = "oddsthingshere@gmail.com"

mail = Mail(app)


if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", 5000))  # Render assigns a port dynamically
    app.run(host="0.0.0.0", port=port)
