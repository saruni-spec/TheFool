from .db import DB


class Article(DB):
    def __init__(self):
        super().__init__()

    def save(self, content, writer):
        self.content = content
        self.author = writer

        query = "INSERT INTO Article (article_name,article_content,author) values (%s,%s,%s)"
        self.execute_query(query, (self.content, self.author))

    def get(self, title):

        query = "SELECT * FROM Article where article_name=?"
        param = (title,)
        article = self.execute_query(query, param)

        return article.fetchone()

    def get_all(self):
        query = "SELECT * FROM Article"
        article = self.execute_query(query)
        return article.fetchall()

    def delete(self, title):

        query = "DELETE FROM Article where article_name=?"
        param = (title,)
        self.execute_query(query, param)

    def update(self, title, content):

        query = "UPDATE Article set article_content=%s where article_name=?"
        param = (content, title)
        self.execute_query(query, param)
