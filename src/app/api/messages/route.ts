import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    if (!groupId) {
      return NextResponse.json({ error: "groupId is required" }, { status: 400 });
    }

    // Efficient membership check
    const isMember = await prisma.group.findFirst({
      where: {
        id: groupId,
        OR: [
          { captainId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      },
      select: { id: true }
    });

    if (!isMember) {
      return NextResponse.json({ error: "Not a member of this group" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { groupId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Reverse to show in chronological order
    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error("Message fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId, content } = await req.json();
    const trimmedContent = String(content || "").trim();

    if (!groupId || !trimmedContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify user is part of the group or is the captain
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true }
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const isMember = group.members.some((m) => m.userId === session.user.id) || group.captainId === session.user.id;
    if (!isMember) {
      return NextResponse.json({ error: "Not a member of this group" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        groupId,
        senderId: session.user.id,
        content: trimmedContent,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Message creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
