import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting legacy user migration...");

  // Find users with no password
  // Note: Adjust criteria if 'legacy' users are defined differently
  const legacyUsers = await prisma.user.findMany({
    where: {
      tempPassword: null,
    },
    orderBy: {
      createdAt: 'asc', // ordered by when they joined
    }
  });

  console.log(`Found ${legacyUsers.length} users with no password.`);

  if (legacyUsers.length === 0) {
    console.log("No legacy users to migrate.");
    return;
  }

  const updates = [];
  const report: string[] = ["User Migration Report", "=====================", "Name | Generated Password", "-------------------------"];

  // Helper to append suffix (st, nd, rd, th)
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  for (let i = 0; i < legacyUsers.length; i++) {
    const user = legacyUsers[i];
    // Generate password: 1stfool, 2ndfool, 3rdfool...
    const plainPassword = `${getOrdinal(i + 1)}fool`;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    updates.push(
      prisma.user.update({
        where: { id: user.id },
        data: { 
            password: hashedPassword,
            tempPassword: plainPassword 
        },
      })
    );

    report.push(`${user.name} | ${plainPassword}`);
    console.log(`Prepared update for ${user.name}: ${plainPassword}`);
  }

  // Execute transaction
  await prisma.$transaction(updates);

  // Write report to file
  const reportPath = "migration_report.txt";
  fs.writeFileSync(reportPath, report.join("\n"));
  
  console.log(`\nMigration complete! Updated ${updates.length} users.`);
  console.log(`Passwords saved to ${reportPath} for your records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
