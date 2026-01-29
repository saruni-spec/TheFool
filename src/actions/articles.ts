"use server";

import { prisma } from "@/lib/prisma";

export async function getArticle(slug: string) {
  try {
    const isId = /^\d+$/.test(slug);
    const where = isId ? { id: parseInt(slug) } : { title: decodeURIComponent(slug) };

    const article = await prisma.article.findFirst({
      where: where,
      include: {
        author: {
          select: {
            name: true,
          },
        },
        comments: {
          include: {
            reader: {
              include: {
                user: { select: { name: true } }
              }
            }
          },
          orderBy: { createdAt: "desc" }
        },
      },
    });
    return article;
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return null;
  }
}

export async function createArticle(formData: FormData, authorId: number) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const article = await prisma.article.create({
      data: {
        title,
        content,
        description,
        image,
        slug,
        authorId,
      },
    });
    return { success: true, article };
  } catch (error) {
    console.error("Failed to create article:", error);
    return { error: "Failed to create article" };
  }
}

export async function getUserArticles(userId: number) {
  try {
    return await prisma.article.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { comments: true } }
      }
    });
  } catch (error) {
     return [];
  }
}

export async function getLatestArticles(take = 6) {
  try {
    const articles = await prisma.article.findMany({
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return articles;
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}
