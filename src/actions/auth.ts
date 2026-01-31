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

import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Missing fields" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Create default Reader profile
        readerProfile: {
          create: {}
        }
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to create user" };
  }
}
