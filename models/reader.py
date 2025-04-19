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

    def is_active(self):
        return True

    def get_id(self):
        return self.id

    def save(self, password):
        self.password = generate_password_hash(password)

        param = (self.email, self.password)
        query = "INSERT INTO users(name,password) values (%s,%s)"
        self.execute_query(query, param)
        self.conn.commit()

    def get(self):

        param = (self.email,)
        query = "SELECT * FROM users WHERE name =%s "

        user = self.execute_query(query, param)
        return user.fetchone()

    def delete(self, name):

        param = (name,)
        query = "DELETE FROM users WHERE name =%s"
        self.execute_query(query, param)
        self.conn.commit()
