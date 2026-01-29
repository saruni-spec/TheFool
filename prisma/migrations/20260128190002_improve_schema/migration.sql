/*
 Warnings:
 
 - A unique constraint covering the columns `[slug]` on the table `article` will be added. If there are existing duplicate values, this will fail.
 
 */
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('READER', 'WRITER', 'ADMIN');
-- DropForeignKey
ALTER TABLE "author" DROP CONSTRAINT IF EXISTS "authors_user_id_fkey";
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT IF EXISTS "comments_article_id_fkey";
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT IF EXISTS "comments_reader_id_fkey";
-- DropForeignKey
ALTER TABLE "reader" DROP CONSTRAINT IF EXISTS "readers_user_id_fkey";
-- RenameConstraint (separate statements)
ALTER TABLE "article"
  RENAME CONSTRAINT "articles_pkey" TO "article_pkey";
-- AlterTable article
ALTER TABLE "article"
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "slug" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- RenameConstraint author
ALTER TABLE "author"
  RENAME CONSTRAINT "authors_pkey" TO "author_pkey";
-- RenameConstraint comment  
ALTER TABLE "comment"
  RENAME CONSTRAINT "comments_pkey" TO "comment_pkey";
-- AlterTable comment
ALTER TABLE "comment"
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- RenameConstraint reader
ALTER TABLE "reader"
  RENAME CONSTRAINT "readers_pkey" TO "reader_pkey";
-- AlterTable users
ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "role" "UserRole" NOT NULL DEFAULT 'READER',
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "article_slug_key" ON "article"("slug");
-- AddForeignKey
ALTER TABLE "article"
ADD CONSTRAINT "article_author_fkey" FOREIGN KEY ("author") REFERENCES "users"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "comment"
ADD CONSTRAINT "comment_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "comment"
ADD CONSTRAINT "comment_reader_id_fkey" FOREIGN KEY ("reader_id") REFERENCES "reader"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "author"
ADD CONSTRAINT "author_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "reader"
ADD CONSTRAINT "reader_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- RenameIndex
ALTER INDEX "articles_article_name_key"
RENAME TO "article_article_name_key";
-- RenameIndex
ALTER INDEX "authors_user_id_key"
RENAME TO "author_user_id_key";
-- RenameIndex
ALTER INDEX "readers_user_id_key"
RENAME TO "reader_user_id_key";