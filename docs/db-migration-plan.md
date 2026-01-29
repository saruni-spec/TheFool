# Database Migration & Improvement Plan

## 1. Current State Analysis
Based on Flask Models:
- **`users`**: `id`, `name`, `password`.
- **`reader`**: `id`, `user_id`. (1:1 with users?)
- **`writer`**: `username`, `topics` (unknown format, likely string), `article` (FK?). *Note: The Flask model `Writer` looks inconsistent vs `Reader`.*
- **`article`**: `id`, `article_name`, `article_content`, `author`, `description`.
- **`comment`**: `id`, `article_id`, `reader_id`, `comment`.

## 2. Issues & Improvements
1.  **Normalization**: `users` table only has `name`. It should probably have `email`.
2.  **Consistency**: `writer.username` vs `reader.user_id`.
3.  **Timestamps**: No `created_at` or `updated_at` on any tables. Essential for ordering and "freshness".
4.  **Relationships**: `article.author` should link to a User or Writer ID definitively.
5.  **Security**: Check password hashing compatibility.

## 3. Proposed Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String    // Hash
  role          UserRole  @default(READER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  readerProfile Reader?
  writerProfile Writer?
  comments      Comment[]
  articles      Article[] // If users directly author
}

enum UserRole {
  READER
  WRITER
  ADMIN
}

model Article {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.Text
  description String?
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  comments    Comment[]
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  
  articleId String
  article   Article  @relation(fields: [articleId], references: [id])
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}

// ... Additional models
```

## 4. Migration Strategy
1.  **Baseline**: Since we want to *improve* it, we might create a new schema side-by-side or alter the existing one.
    -   *Decision*: Alter existing if empty/low data, or use Prisma to `migrate resolve` if we want to keep data.
    -   Given "Project Refactor", we will attempt to **Migration Class A**: Add columns/tables, keep data.
2.  **Steps**:
    -   `npx prisma db pull`: Get current raw schema.
    -   Refine `schema.prisma` with new names/types (using `@map` to point to old tables if renaming, or just create new ones).
    -   `npx prisma migrate dev`: Apply changes.
