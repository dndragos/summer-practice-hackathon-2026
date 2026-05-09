"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const sportsData = formData.get("sports") as string; // JSON string of sports

  let sports: { sportName: string; skillLevel: string }[] = [];
  if (sportsData) {
    try {
      sports = JSON.parse(sportsData);
    } catch (e) {
      console.error("Failed to parse sports data", e);
    }
  }

  // Update User basic info
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      bio,
    },
  });

  // Handle sports preferences
  if (sports.length > 0) {
    // First delete existing preferences for this user
    await prisma.sportPreference.deleteMany({
      where: { userId: session.user.id },
    });

    // Create new ones
    await prisma.sportPreference.createMany({
      data: sports.map((s) => ({
        userId: session.user.id as string,
        sportName: s.sportName,
        skillLevel: s.skillLevel,
      })),
    });
  }

  revalidatePath("/profile");
}
