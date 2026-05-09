import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: "file:./prisma/dev.db",
  }),
});

async function check() {
  try {
    const count = await prisma.user.count();
    console.log(`User count: ${count}`);
    const users = await prisma.user.findMany({ take: 5 });
    console.log("Sample users:", JSON.stringify(users, null, 2));
  } catch (e) {
    console.error("Database error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
