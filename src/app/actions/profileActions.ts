"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const image = formData.get("image") as string;
  const sportsData = formData.get("sports") as string;

  let sports: { sportName: string; skillLevel: string }[] = [];
  if (sportsData) {
    try {
      sports = JSON.parse(sportsData);
    } catch (e) {
      console.error("Failed to parse sports data", e);
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      bio,
      image: image || null,
    },
  });

  await prisma.sportPreference.deleteMany({
    where: { userId: session.user.id },
  });

  if (sports.length > 0) {
    await prisma.sportPreference.createMany({
      data: sports.map((s) => ({
        userId: session.user.id as string,
        sportName: s.sportName.trim(),
        skillLevel: s.skillLevel,
      })),
    });
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  redirect("/dashboard?saved=1");
}
