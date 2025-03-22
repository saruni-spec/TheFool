from .db import DB


class Article(DB):
    def __init__(self):
        super().__init__()

    def save(self, content, title, author_id):
        """Create a new article with the given title, content and author ID"""
        query = "INSERT INTO article (article_name, article_content, author) VALUES (%s, %s, %s) RETURNING id"
        result = self.execute_query(query, (title, content, author_id))
        self.conn.commit()
        return result.fetchone()[0]  # Return the new article ID

    def get(self, title):
        """Get an article by title with its comments"""
        query = """
            SELECT a.id, a.article_name, a.article_content, a.author, 
                   array_agg(DISTINCT jsonb_build_object('id', c.id, 'content', c.comment, 'author', r.user_id, 'name', u.name)) as comments
            FROM article a
            LEFT JOIN comment c ON a.id = c.article_id
            LEFT JOIN reader r ON c.reader_id = r.id
            LEFT JOIN users u ON r.user_id = u.id
            WHERE a.article_name = %s
            GROUP BY a.id
        """
        param = (title,)
        result = self.execute_query(query, param)
        article = result.fetchone()
        return article

    def get_all(self):
        """Get all articles"""
        query = "SELECT id, article_name, article_content, author FROM article"
        articles = self.execute_query(query)
        return articles.fetchall()

    def delete(self, title):
        """Delete an article by title"""
        query = "DELETE FROM article WHERE article_name = %s"
        param = (title,)
        self.execute_query(query, param)
        self.conn.commit()

    def update(self, title, content):
        """Update an article's content"""
        query = "UPDATE article SET article_content = %s WHERE article_name = %s"
        param = (content, title)
        self.execute_query(query, param)
        self.conn.commit()

    def get_article_id(self, title):
        """Get an article's ID by its title"""
        query = "SELECT id FROM article WHERE article_name = %s"
        param = (title,)
        result = self.execute_query(query, param)
        article = result.fetchone()
        return article[0] if article else None

    def add_comment(self, article_title, reader_id, comment_text):
        """Add a comment to an article"""
        # Get the article ID
        article_id = self.get_article_id(article_title)
        if article_id is None:
            return False

        # Insert the comment
        query = (
            "INSERT INTO comment (reader_id, comment, article_id) VALUES (%s, %s, %s)"
        )
        param = (reader_id, comment_text, article_id)
        self.execute_query(query, param)
        self.conn.commit()
        return True

    def get_comments(self, article_id):
        """Get all comments for an article"""
        query = """
            SELECT c.id, c.comment, r.user_id,u.name
            FROM comment c
            JOIN reader r ON c.reader_id = r.id,
            JOIN users u ON r.user_id = u.id
            WHERE c.article_id = %s
            ORDER BY c.id
        """
        param = (article_id,)
        result = self.execute_query(query, param)
        return result.fetchall()


class Reader(DB):
    def __init__(self):
        super().__init__()

    def get_or_create(self, name):
        """Get a reader by user_id or create if doesn't exist"""
        # Check if reader exists
        query = "SELECT id FROM users where name = %s"
        param = (name,)
        result = self.execute_query(query, param)
        user = result.fetchone()[0]
        #
        if not user:
            query = "INSERT INTO users (name) VALUES (%s) RETURNING id"
            param = (name,)
            result = self.execute_query(query, param)
            user = result.fetchone()[0]
        #
        query = "SELECT id FROM reader WHERE user_id = %s"
        param = (user,)
        result = self.execute_query(query, param)
        reader = result.fetchone()

        if reader:
            return reader[0]

        # Create new reader
        query = "INSERT INTO reader (user_id) VALUES (%s) RETURNING id"
        param = (user[0],)
        result = self.execute_query(query, param)
        self.conn.commit()
        return result.fetchone()[0]
