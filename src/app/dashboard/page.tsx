import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  const upcomingEvents = await prisma.event.findMany({
    where: {
      groups: {
        some: {
          OR: [{ captainId: session.user.id }, { members: { some: { userId: session.user.id } } }],
        },
      },
    },
    orderBy: { scheduledTime: "asc" },
    take: 4,
    select: {
      id: true,
      title: true,
      sportName: true,
      scheduledTime: true,
      locationName: true,
    },
  });

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <DashboardClient
        initialAvailable={user.availableToday}
        userName={user.name}
        upcomingEvents={upcomingEvents}
      />
    </div>
  );
}
