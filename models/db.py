import sqlite3


class DB:
    def __init__(self, db_path="articles.db"):
        """
        Initialize database connection
        Args:
            db_path (str): Path to SQLite database file
        """

        self.db_path = db_path
        self.connect()

    def connect(self):
        """Establish connection to the database"""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.cursor = self.conn.cursor()
            return self.conn
        except sqlite3.Error as e:
            print(f"Error connecting to database: {e}")
            raise

    def close(self):
        """Close database connection and cursor"""
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.commit()
            self.conn.close()
            self.conn = None
            self.cursor = None

    def __enter__(self):
        """Context manager entry"""
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, traceback):
        """Context manager exit"""
        self.close()

    def execute_query(self, query, params=None):
        """
        Execute a SQL query
        Args:
            query (str): SQL query to execute
            params (tuple): Optional parameters for the query
        Returns:
            cursor object with query results
        """
        try:
            if params:
                return self.cursor.execute(query, params)
            return self.cursor.execute(query)
        except sqlite3.Error as e:
            print(f"Error executing query: {e}")
            raise
