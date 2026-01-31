"use server";

import { prisma } from "@/lib/prisma";

export async function checkLegacyUser(username: string) {
  try {
    if (!username) return { error: "Username required" };

    const user = await prisma.user.findFirst({
      where: { name: username },
      select: { tempPassword: true }
    });

    if (user && user.tempPassword) {
      return { found: true, tempPassword: user.tempPassword };
    }

    return { found: false };
  } catch (error) {
    console.error("Check legacy user error:", error);
    return { error: "Failed to check user" };
  }
}
