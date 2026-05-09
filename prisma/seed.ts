import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  }),
});

async function main() {
  // Make seed deterministic and re-runnable.
  await prisma.message.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.event.deleteMany();
  await prisma.sportPreference.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "andrei.popescu@example.com",
        name: "Andrei Popescu",
        bio: "Product designer who plays football on weekends and likes evening runs.",
        availableToday: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "bianca.ionescu@example.com",
        name: "Bianca Ionescu",
        bio: "Padel and tennis fan, always looking for technical rallies.",
        availableToday: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "claudiu.marin@example.com",
        name: "Claudiu Marin",
        bio: "Software engineer, basketball guard, enjoys fast-paced games.",
        availableToday: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "diana.stan@example.com",
        name: "Diana Stan",
        bio: "Morning runner and recreational volleyball player.",
        availableToday: false,
      },
    }),
    prisma.user.create({
      data: {
        email: "elena.rusu@example.com",
        name: "Elena Rusu",
        bio: "Competitive tennis player and occasional swimmer.",
        availableToday: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "florin.petrescu@example.com",
        name: "Florin Petrescu",
        bio: "Football midfielder, focused on tactical play and consistency.",
        availableToday: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "george.enache@example.com",
        name: "George Enache",
        bio: "CrossFit enthusiast, joins basketball and football pickup games.",
        availableToday: false,
      },
    }),
    prisma.user.create({
      data: {
        email: "ioana.dobre@example.com",
        name: "Ioana Dobre",
        bio: "Volleyball and running, prefers team coordination and communication.",
        availableToday: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "mihai.ilie@example.com",
        name: "Mihai Ilie",
        bio: "Beginner at tennis, experienced in football, open to mixed groups.",
        availableToday: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "sorana.nistor@example.com",
        name: "Sorana Nistor",
        bio: "Basketball wing player and city park runner.",
        availableToday: true,
      },
    }),
  ]);

  const byEmail = Object.fromEntries(users.map((u) => [u.email, u]));

  await prisma.sportPreference.createMany({
    data: [
      { userId: byEmail["andrei.popescu@example.com"].id, sportName: "Football", skillLevel: "Advanced" },
      { userId: byEmail["andrei.popescu@example.com"].id, sportName: "Running", skillLevel: "Intermediate" },

      { userId: byEmail["bianca.ionescu@example.com"].id, sportName: "Padel", skillLevel: "Advanced" },
      { userId: byEmail["bianca.ionescu@example.com"].id, sportName: "Tennis", skillLevel: "Advanced" },

      { userId: byEmail["claudiu.marin@example.com"].id, sportName: "Basketball", skillLevel: "Advanced" },
      { userId: byEmail["claudiu.marin@example.com"].id, sportName: "Football", skillLevel: "Intermediate" },

      { userId: byEmail["diana.stan@example.com"].id, sportName: "Running", skillLevel: "Intermediate" },
      { userId: byEmail["diana.stan@example.com"].id, sportName: "Volleyball", skillLevel: "Beginner" },

      { userId: byEmail["elena.rusu@example.com"].id, sportName: "Tennis", skillLevel: "Pro" },
      { userId: byEmail["elena.rusu@example.com"].id, sportName: "Swimming", skillLevel: "Advanced" },

      { userId: byEmail["florin.petrescu@example.com"].id, sportName: "Football", skillLevel: "Advanced" },
      { userId: byEmail["florin.petrescu@example.com"].id, sportName: "Volleyball", skillLevel: "Beginner" },

      { userId: byEmail["george.enache@example.com"].id, sportName: "Basketball", skillLevel: "Intermediate" },
      { userId: byEmail["george.enache@example.com"].id, sportName: "Football", skillLevel: "Intermediate" },

      { userId: byEmail["ioana.dobre@example.com"].id, sportName: "Volleyball", skillLevel: "Advanced" },
      { userId: byEmail["ioana.dobre@example.com"].id, sportName: "Running", skillLevel: "Intermediate" },

      { userId: byEmail["mihai.ilie@example.com"].id, sportName: "Football", skillLevel: "Intermediate" },
      { userId: byEmail["mihai.ilie@example.com"].id, sportName: "Tennis", skillLevel: "Beginner" },

      { userId: byEmail["sorana.nistor@example.com"].id, sportName: "Basketball", skillLevel: "Advanced" },
      { userId: byEmail["sorana.nistor@example.com"].id, sportName: "Running", skillLevel: "Intermediate" },
    ],
  });

  const footballEvent = await prisma.event.create({
    data: {
      title: "Saturday 5v5 Football",
      sportName: "Football",
      locationName: "Baza Sportiva 2, Timisoara",
      locationLat: 45.7708,
      locationLng: 21.2256,
      scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 26),
      status: "Scheduled",
    },
  });

  const footballGroup = await prisma.group.create({
    data: {
      eventId: footballEvent.id,
      isAutoGenerated: false,
      captainId: byEmail["florin.petrescu@example.com"].id,
    },
  });

  await prisma.groupMember.createMany({
    data: [
      { groupId: footballGroup.id, userId: byEmail["florin.petrescu@example.com"].id },
      { groupId: footballGroup.id, userId: byEmail["andrei.popescu@example.com"].id },
      { groupId: footballGroup.id, userId: byEmail["mihai.ilie@example.com"].id },
      { groupId: footballGroup.id, userId: byEmail["claudiu.marin@example.com"].id },
      { groupId: footballGroup.id, userId: byEmail["george.enache@example.com"].id },
    ],
  });

  await prisma.message.createMany({
    data: [
      {
        groupId: footballGroup.id,
        senderId: byEmail["florin.petrescu@example.com"].id,
        content: "I booked the field for 19:00. Please arrive 15 minutes early.",
      },
      {
        groupId: footballGroup.id,
        senderId: byEmail["andrei.popescu@example.com"].id,
        content: "Perfect, I can bring extra bibs.",
      },
      {
        groupId: footballGroup.id,
        senderId: byEmail["mihai.ilie@example.com"].id,
        content: "Can we split teams based on positions when we get there?",
      },
    ],
  });

  const basketballEvent = await prisma.event.create({
    data: {
      title: "Evening Basketball Run",
      sportName: "Basketball",
      locationName: "Parcul Rozelor Court",
      locationLat: 45.7503,
      locationLng: 21.2297,
      scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 30),
      status: "Scheduled",
    },
  });

  const basketballGroup = await prisma.group.create({
    data: {
      eventId: basketballEvent.id,
      isAutoGenerated: true,
      captainId: byEmail["claudiu.marin@example.com"].id,
    },
  });

  await prisma.groupMember.createMany({
    data: [
      { groupId: basketballGroup.id, userId: byEmail["claudiu.marin@example.com"].id },
      { groupId: basketballGroup.id, userId: byEmail["sorana.nistor@example.com"].id },
      { groupId: basketballGroup.id, userId: byEmail["george.enache@example.com"].id },
      { groupId: basketballGroup.id, userId: byEmail["andrei.popescu@example.com"].id },
    ],
  });

  await prisma.message.createMany({
    data: [
      {
        groupId: basketballGroup.id,
        senderId: byEmail["claudiu.marin@example.com"].id,
        content: "Let us start with 4v4 half-court and rotate every game.",
      },
      {
        groupId: basketballGroup.id,
        senderId: byEmail["sorana.nistor@example.com"].id,
        content: "Sounds good, I will be there at 18:45.",
      },
    ],
  });

  const tennisEvent = await prisma.event.create({
    data: {
      title: "Sunday Tennis Doubles",
      sportName: "Tennis",
      locationName: "Arena Tivoli Tennis Club",
      locationLat: 45.7489,
      locationLng: 21.2432,
      scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 52),
      status: "Scheduled",
    },
  });

  const tennisGroup = await prisma.group.create({
    data: {
      eventId: tennisEvent.id,
      isAutoGenerated: false,
      captainId: byEmail["elena.rusu@example.com"].id,
    },
  });

  await prisma.groupMember.createMany({
    data: [
      { groupId: tennisGroup.id, userId: byEmail["elena.rusu@example.com"].id },
      { groupId: tennisGroup.id, userId: byEmail["bianca.ionescu@example.com"].id },
      { groupId: tennisGroup.id, userId: byEmail["mihai.ilie@example.com"].id },
      { groupId: tennisGroup.id, userId: byEmail["diana.stan@example.com"].id },
    ],
  });

  await prisma.message.createMany({
    data: [
      {
        groupId: tennisGroup.id,
        senderId: byEmail["elena.rusu@example.com"].id,
        content: "Court 3 is reserved from 10:00 to 12:00.",
      },
      {
        groupId: tennisGroup.id,
        senderId: byEmail["bianca.ionescu@example.com"].id,
        content: "Great, we can do two sets and then switch partners.",
      },
    ],
  });

  const volleyballEvent = await prisma.event.create({
    data: {
      title: "Friendly Volleyball Meetup",
      sportName: "Volleyball",
      locationName: "UVT Sports Hall",
      locationLat: 45.7474,
      locationLng: 21.2319,
      scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 40),
      status: "Scheduled",
    },
  });

  const volleyballGroup = await prisma.group.create({
    data: {
      eventId: volleyballEvent.id,
      isAutoGenerated: true,
      captainId: byEmail["ioana.dobre@example.com"].id,
    },
  });

  await prisma.groupMember.createMany({
    data: [
      { groupId: volleyballGroup.id, userId: byEmail["ioana.dobre@example.com"].id },
      { groupId: volleyballGroup.id, userId: byEmail["diana.stan@example.com"].id },
      { groupId: volleyballGroup.id, userId: byEmail["florin.petrescu@example.com"].id },
      { groupId: volleyballGroup.id, userId: byEmail["andrei.popescu@example.com"].id },
    ],
  });

  await prisma.message.createMany({
    data: [
      {
        groupId: volleyballGroup.id,
        senderId: byEmail["ioana.dobre@example.com"].id,
        content: "Please bring knee pads if you have them.",
      },
      {
        groupId: volleyballGroup.id,
        senderId: byEmail["diana.stan@example.com"].id,
        content: "Noted. I can also bring a spare ball.",
      },
    ],
  });

  console.log("Seed complete: 10 users, 20 sport preferences, 4 events, 4 groups, 15 memberships, 9 messages.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
