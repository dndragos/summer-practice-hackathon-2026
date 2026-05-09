"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function updateEventLocation(eventId: string, locationName: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Optional: verify the user is the captain of a group in this event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { groups: true }
  });

  if (!event) throw new Error("Event not found");

  const isCaptain = event.groups.some(g => g.captainId === session.user.id);
  if (!isCaptain) throw new Error("Only the captain can update the location");

  await prisma.event.update({
    where: { id: eventId },
    data: { locationName }
  });

  revalidatePath(`/events/${eventId}`);
  return { success: true };
}
