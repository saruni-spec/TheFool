from models.db import DB


class Writer(DB):
    def __init__(self, email, topics, article):
        super().__init__()
        self.topics = topics
        self.article = article
        self.username = email

    def save(self):

        query = "INSERT INTO Writer (username,topics,article) values (%s,%s,%s)"
        param = (self.username, self.topics, self.article)
        self.execute_query(query, param)
        self.conn.commit()

    def get(self, email):

        query = "SELECT * FROM Writer WHERE username=?"
        param = (email,)
        user = self.execute_query(query, param)
        return user.fetchone()

    def delete(self, email):

        query = "DELETE * FROM Writer WHERE username=?"
        param = (email,)
        self.execute_query(query, param)
        self.conn.commit()
