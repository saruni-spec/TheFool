"use server";

import { prisma } from "@/lib/prisma";

export async function getArticle(slug: string) {
  try {
    const isId = /^\d+$/.test(slug);
    const where = isId ? { id: parseInt(slug) } : { slug: slug };

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
  const customJs = formData.get("customJs") as string;

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
        customJs,
        slug,
        authorId,
      },
    });

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/dashboard");
    
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

export async function updateArticle(articleId: number, formData: FormData, authorId: number) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const customJs = formData.get("customJs") as string;

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  // Optional: Update slug if title changes? Usually better to keep slug stable to avoid breaking links.
  // For now, let's keep slug stable unless explicitly requested (which we aren't supporting yet).

  try {
    const article = await prisma.article.findUnique({
        where: { id: articleId }
    });

    if (!article) {
        return { error: "Article not found" };
    }

    if (article.authorId !== authorId) {
        return { error: "Unauthorized" };
    }

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        content,
        description,
        image,
        customJs,
      },
    });
    
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/article/${updatedArticle.slug || updatedArticle.id}`);

    return { success: true, article: updatedArticle };
  } catch (error) {
    console.error("Failed to update article:", error);
    return { error: "Failed to update article" };
  }
}
