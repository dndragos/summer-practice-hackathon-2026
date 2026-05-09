import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Container, Typography, Box, Paper, Button, Stack } from "@mui/material";
import MyEventsClient from "@/components/MyEventsClient";

export default async function MyEventsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const events = await prisma.event.findMany({
    where: {
      groups: {
        some: {
          OR: [{ captainId: session.user.id }, { members: { some: { userId: session.user.id } } }],
        },
      },
    },
    orderBy: { scheduledTime: "asc" },
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          My Events
        </Typography>
        {events.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", bgcolor: "background.default" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You have not joined or created events yet.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" href="/dashboard">
                Find Events
              </Button>
            </Box>
          </Paper>
        ) : (
          <MyEventsClient events={events} />
        )}
      </Box>
    </Container>
  );
}
