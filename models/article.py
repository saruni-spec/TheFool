from .db import DB
from ast import literal_eval


# convert string to list
def convert_str(comments):
    if comments is None:
        return []
    try:
        return literal_eval(comments)
    except (ValueError, SyntaxError):
        return []


class Article(DB):
    def __init__(
        self,
    ):
        super().__init__()

    def save(self, content, title):

        query = "INSERT INTO Article (article_name,article_content) values (?,?)"
        self.execute_query(query, (title, content))
        self.conn.commit()

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
        self.conn.commit()

    def update(self, title, content):

        query = "UPDATE Article set article_content=%s where article_name=?"
        param = (content, title)
        self.execute_query(query, param)
        self.conn.commit()

    def add_comment(self, title, comment):
        # Add the comment to the article with the given title
        # Comment is a list
        query = "SELECT comments FROM Article where article_name=?"
        param = (title,)
        article = self.execute_query(query, param)

        comments = article.fetchone()
        if comments is None:
            comments = []
        comments = convert_str(comments[0])
        comments.append(comment)

        # Convert the list to a string representation SQLite can handle
        comments_str = str(comments)

        print(comments_str)
        query = "UPDATE Article set comments=? where article_name=?"
        param = (comments_str, title)
        self.execute_query(query, param)
        # commit the changes
        self.conn.commit()
