import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" }),
});

async function check() {
  // List all users with their emails (no passwords stored)
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, availableToday: true },
    orderBy: { createdAt: "asc" },
  });
  console.log("\n=== USERS IN DATABASE ===");
  users.forEach(u => console.log(`  [${u.name}] ${u.email} | available: ${u.availableToday}`));

  // List all events with their group members
  const events = await prisma.event.findMany({
    include: {
      groups: {
        include: {
          captain: { select: { name: true, email: true } },
          members: { include: { user: { select: { name: true, email: true } } } },
        },
      },
    },
  });
  console.log("\n=== EVENTS AND GROUPS ===");
  events.forEach(e => {
    console.log(`\n  Event: "${e.title}" (${e.sportName})`);
    e.groups.forEach(g => {
      console.log(`    Captain: ${g.captain?.email || "none"}`);
      console.log(`    Members: ${g.members.map(m => m.user.email).join(", ")}`);
    });
  });

  await prisma.$disconnect();
}

check();
