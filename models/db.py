import psycopg2
from psycopg2 import pool
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables


class DB:
    def __init__(self, connection_string=None):
        """
        Initialize database connection to Neon PostgreSQL
        Args:
            connection_string (str): Direct PostgreSQL connection string (if provided)
        """
        self.connection_string = connection_string or os.getenv(
            "NEON_CONNECTION_STRING"
        )

        if not self.connection_string:
            raise ValueError(
                "Neon connection string not provided or found in environment variables"
            )

        self.conn = None
        self.cursor = None
        self.connect()

    def connect(self):
        """Establish connection to the Neon PostgreSQL database"""
        try:
            # Connect to Neon (SSL is enabled by default in Neon)
            self.conn = psycopg2.connect(self.connection_string, sslmode="require")
            self.conn.autocommit = False
            self.cursor = self.conn.cursor()
            return self.conn
        except psycopg2.Error as e:
            print(f"Error connecting to Neon database: {e}")
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
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            return self.cursor
        except psycopg2.Error as e:
            print(f"Error executing query: {e}")
            raise
