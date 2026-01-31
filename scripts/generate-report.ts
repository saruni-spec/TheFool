import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  console.log("Generating definitive legacy user report...");

  const users = await prisma.user.findMany({
    where: {
      tempPassword: { not: null },
    },
    orderBy: {
      createdAt: 'asc', 
    }
  });

  const report: string[] = ["Definitive User Report", "=====================", "Name | Current Password", "-------------------------"];

  for (const user of users) {
    report.push(`${user.name} | ${user.tempPassword}`);
    console.log(`${user.name} -> ${user.tempPassword}`);
  }

  const reportPath = "final_migration_report.txt";
  fs.writeFileSync(reportPath, report.join("\n"));
  
  console.log(`\nReport generated: ${reportPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
