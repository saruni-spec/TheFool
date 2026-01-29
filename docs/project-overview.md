# Project Overview & Migration Docs

## 1. Technology Stack (Current)
- **Backend Framework**: Flask (Python)
- **Database**: SQL (PostgreSQL/MySQL dialect in queries), using `psycopg2` / `mysql-connector`.
- **ORM/Access Layer**: Custom `DB` class wrapper around raw SQL queries.
- **Templating**: Jinja2 (server-side rendering).
- **Authentication**: `Flask-Login` with `werkzeug.security` for password hashing.
- **Forms**: `Flask-WTF`.

## 2. Database Schema (Inferred from Models)

### `users`
- `id` (PK)
- `name` (Username/Email?)
- `password` (Hashed)

### `reader`
- `id` (PK)
- `user_id` (FK -> `users.id`)

### `writer` (Inferred)
- `username`
- `topics`
- `article`

### `article`
- `id` (PK)
- `article_name` (Title)
- `article_content` (Body)
- `author` (Author ID?)
- `description`

### `comment`
- `id` (PK)
- `article_id` (FK -> `article.id`)
- `reader_id` (FK -> `reader.id`)
- `comment` (Text)

## 3. Routes & Features Map (Flask Blueprints)

| Route Path | View File | Description |
|Data Route| `models/` | Direct DB access |
| `/`, `/home` | `views/home.py` | Landing page, lists articles. |
| `/login` | `views/login.py` | User login (Reader/Writer). |
| `/article/<title>` | `views/article.py` | View single article + comments. |
| `/register` | `views/register_user.py` | User registration. |
| `/write` | `views/write_article.py` | (Inferred) Write new article. |
| `/edit` | `views/edit_article.py` | (Inferred) Edit existing article. |
| `/draft` | `views/draft.py` | (Inferred) View drafts. |
| `/about` | `views/about.py` | Static about page. |
| `/privacy` | `views/privacy.py` | Privacy policy. |
| `/help` | `views/help.py` | Help center. |

## 4. User Flows

### Public / Guest
- **Landing**: Visit `/` to see latest articles.
- **Read**: Click article -> `/article/<title>`.
- **Auth**: Can navigate to `/login` or `/register`.

### Registered User (Reader)
- **Login**: Authenticate via `/login`.
- **Comment**: On `/article/<title>`, submit a comment form.
- **Profile**: (Likely via `reader` model) manage basic info.

### Writer (Admin/Content Creator)
- **Write**: Access `/write` to create content.
- **Edit**: Access `/edit` to modify content.
- **Drafts**: Save and manage drafts.

## 5. Next.js Refactor Strategy

### Architecture
- **Framework**: Next.js 14+ (App Router).
- **Language**: TypeScript.
- **Styling**: Tailwind CSS (for modern aesthetics).
- **Database**: Prisma via Postgres (recommended to replace raw SQL).
- **Auth**: NextAuth.js (replacing Flask-Login).

### Migration Steps
1.  **Setup**: Initialize Next.js app.
2.  **Database**: Introspect existing DB with Prisma or define new schema matching `docs` above.
3.  **API Migration**:
    -   Port `home` (get all articles) -> Server Component or API Route.
    -   Port `article` (get one + comments) -> Server Component or dynamic route `app/article/[slug]/page.tsx`.
    -   Port `auth` (login/register) -> NextAuth route handlers.
    -   Port `write/edit` -> Protected routes with rich text editor.
4.  **Frontend**: Rebuild `templates/*.html` as React Components.
