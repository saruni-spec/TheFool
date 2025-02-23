from models.db import DB
from werkzeug.security import generate_password_hash


class Reader(DB):
    def __init__(self, email):
        super().__init__()  # Initialize the DB connection
        self.id = email
        self.email = email

    def is_authenticated(self):
        # return True if the user is authenticated, False otherwise
        return True

    def get_id(self):
        return self.id

    def save(self, password):
        self.password = generate_password_hash(password)

        param = (self.email, self.password)
        query = "INSERT INTO Reader(username,password) values (?,?)"
        self.execute_query(query, param)
        self.conn.commit()

    def get(self, email):

        param = (email,)
        query = "SELECT * FROM Reader WHERE username =? "

        user = self.execute_query(query, param)
        return user.fetchone()

    def delete(self, username):

        param = (username,)
        query = "DELETE FROM Reader WHERE username = ?"
        self.execute_query(query, param)
        self.conn.commit()
