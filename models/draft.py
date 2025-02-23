from models.db import DB


class Draft(DB):
    def __init__(self, email, topics, article):
        super().__init__()
        self.username = email
        self.topics = topics
        self.article = article

    def save(self):

        param = (self.username, self.topics, self.article)
        query = "INSERT INTO Draft(username, topics, article) VALUES (%s, %s, %s)"
        self.execute_query(query, param)
        self.conn.commit()

    def get(self, username):

        if username == "all":
            query = "SELECT * FROM Draft"

            draft = self.execute_query(query)
            return draft

        param = (username,)
        query = "SELECT * FROM Draft WHERE username=?"

        draft = self.execute_query(query, param)
        return draft.fetchone()

    def delete(self, username):

        param = (username,)
        query = "DELETE FROM Draft WHERE username=?"
        self.execute_query(query, param)
        self.conn.commit()

    def close_connection(self):
        """Explicitly close the connection."""
        self.close()  # Use the close() method inherited from DB
