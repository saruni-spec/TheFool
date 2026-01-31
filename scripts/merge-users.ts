import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function mergeUsers(primaryName: string, aliasNames: string[]) {
  console.log(`\nMerging into '${primaryName}': ${aliasNames.join(", ")}`);

  // 1. Find Primary User
  const primaryUser = await prisma.user.findFirst({
    where: { name: primaryName },
  });

  if (!primaryUser) {
    console.error(`Primary user '${primaryName}' not found.`);
    return;
  }
  console.log(`Primary User ID: ${primaryUser.id}`);

  // 2. Process Aliases
  for (const alias of aliasNames) {
    const duplicateUsers = await prisma.user.findMany({
      where: { name: alias },
    });

    for (const dup of duplicateUsers) {
      if (dup.id === primaryUser.id) continue; // Skip self

      console.log(`Processing Duplicate: ${dup.name} (ID: ${dup.id})`);

      // — Merge Articles —
      const articles = await prisma.article.updateMany({
        where: { authorId: dup.id },
        data: { authorId: primaryUser.id },
      });
      console.log(`  Moved ${articles.count} articles.`);

      // — Merge Comments —
      // Comments are linked via Reader profile or directly? 
      // Schema: Comment -> Reader -> User
      // First, get dup's Reader profile
      const dupReader = await prisma.reader.findUnique({
        where: { userId: dup.id },
      });
      
      const primaryReader = await prisma.reader.findUnique({
        where: { userId: primaryUser.id },
      });
      
      // Ensure primary has a reader profile if needed
      let targetReaderId = primaryReader?.id;
      if (!targetReaderId) {
          const newReader = await prisma.reader.create({ data: { userId: primaryUser.id }});
          targetReaderId = newReader.id;
      }

      if (dupReader) {
        // Move comments from dupReader to primaryReader
        const comments = await prisma.comment.updateMany({
            where: { readerId: dupReader.id },
            data: { readerId: targetReaderId }
        });
        console.log(`  Moved ${comments.count} comments.`);
        
        // Delete dup Reader profile
        await prisma.reader.delete({ where: { id: dupReader.id } });
      }

      // — Merge Author Profile —
      const dupAuthor = await prisma.author.findUnique({ where: { userId: dup.id }});
      if (dupAuthor) {
          await prisma.author.delete({ where: { id: dupAuthor.id }});
      }

      // — Delete Duplicate User —
      await prisma.user.delete({
        where: { id: dup.id },
      });
      console.log(`  Deleted duplicate user ID: ${dup.id}`);
    }
  }
}

async function main() {
  // Merge "Reader J." group
  // Primary: "Reader J."
  // Aliases: "Reader J", "Reader J. "
  await mergeUsers("Reader J.", ["Reader J", "Reader J. "]);

  // Merge "Kws" group
  // Primary: "Kws"
  // Aliases: "kws ", "kws" (if case sensitivity differs)
  await mergeUsers("Kws", ["kws ", "kws"]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
