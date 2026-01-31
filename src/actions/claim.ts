"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Simple Levenshtein distance implementation
function levenshteinDistance(a: string, b: string) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export async function checkClaimStatus(username: string) {
  // 1. Exact Match Check
  const exactUser = await prisma.user.findUnique({
    where: { name: username },
  });

  if (exactUser) {
    if (exactUser.tempPassword) {
      // Unclaimed Legacy User
      return { status: "unclaimed", userId: exactUser.id, name: exactUser.name };
    } else {
      // Already claimed or registered
      return { status: "taken" };
    }
  }

  // 2. Fuzzy Match Check (only against unclaimed legacy users)
  // Fetch all unclaimed users (small list)
  const unclaimedUsers = await prisma.user.findMany({
    where: { tempPassword: { not: null } },
  });

  let bestMatch = null;
  let minDistance = Infinity;

  for (const user of unclaimedUsers) {
    // Basic normalization for comparison
    const dist = levenshteinDistance(
      username.toLowerCase().trim(), 
      user.name.toLowerCase().trim()
    );

    // Threshold: Allow minor typos (e.g. 1-2 chars difference)
    // Adjust threshold based on length to avoid matching "Jo" to "Bo"
    if (dist < minDistance && dist <= 3) {
      minDistance = dist;
      bestMatch = user;
    }
  }

  if (bestMatch) {
    return { 
        status: "fuzzy_match", 
        suggestion: bestMatch.name, 
        userId: bestMatch.id 
    };
  }

  // 3. No match -> Available for new registration
  return { status: "available" };
}

export async function claimAccount(userId: number, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        tempPassword: null, // Clear temp password to mark as claimed
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Claim account error:", error);
    return { error: "Failed to claim account" };
  }
}
