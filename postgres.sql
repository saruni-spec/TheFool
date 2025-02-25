-- PostgreSQL conversion from SQLite dump
BEGIN;
-- Create tables with PostgreSQL data types
CREATE TABLE Article (
    article_name TEXT PRIMARY KEY,
    article_content TEXT,
    comments TEXT
);
CREATE TABLE Writer (
    username TEXT PRIMARY KEY,
    topics TEXT,
    article TEXT
);
CREATE TABLE Reader (
    username TEXT PRIMARY KEY,
    password TEXT
);
CREATE TABLE Draft (
    username TEXT PRIMARY KEY,
    topics TEXT,
    article TEXT
);
-- No data in Draft table from the dump
COMMIT;