import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Container, Typography, Paper, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Chip, Grid } from "@mui/material";
import VenueSuggestions from "./VenueSuggestions";
import Chat from "@/components/Chat";
import { Star as CaptainIcon } from "@mui/icons-material";

export default async function EventDetailsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // In Next.js 15+, params is a Promise and must be awaited
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      groups: {
        include: {
          members: {
            include: {
              user: true
            }
          },
          captain: true,
          messages: {
            include: {
              sender: {
                select: { id: true, name: true, image: true }
              }
            },
            orderBy: { createdAt: 'asc' }
          }
        }
      }
    }
  });

  if (!event) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">Event not found.</Typography>
      </Container>
    );
  }

  // Assuming one group per event for auto-generated matches
  const group = event.groups[0];
  if (!group) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">Event has no group yet.</Typography>
      </Container>
    );
  }
  const isCaptain = group?.captainId === session.user.id;

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          {event.title}
        </Typography>
        <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={event.sportName} color="primary" />
          <Chip label={event.status} color={event.status === "Scheduled" ? "success" : "default"} />
          <Chip label={new Date(event.scheduledTime).toLocaleString()} variant="outlined" />
        </Box>

        <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#f9f9f9' }}>
          <Typography variant="h6" color="text.secondary">
            Current Location
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {event.locationName}
          </Typography>
        </Paper>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Team Roster
            </Typography>
            <List sx={{ mb: 4 }}>
              {group?.members.map(member => {
                const isMemberCaptain = member.userId === group.captainId;
                return (
                  <ListItem key={member.id} sx={{ bgcolor: isMemberCaptain ? '#fff8e1' : 'transparent', borderRadius: 2, mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar src={member.user.image || ""} alt={member.user.name || "User Avatar"} />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography fontWeight={isMemberCaptain ? "bold" : "normal"}>
                          {member.user.name || "Unknown Athlete"}
                        </Typography>
                      } 
                      secondary={isMemberCaptain ? "Team Captain" : "Player"} 
                    />
                    {isMemberCaptain && <CaptainIcon color="warning" fontSize="large" />}
                  </ListItem>
                );
              })}
            </List>

            {isCaptain && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Captain Controls
                </Typography>
                <VenueSuggestions eventId={event.id} sportName={event.sportName} />
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Chat 
              groupId={group.id} 
              initialMessages={group.messages || []} 
              currentUserId={session.user.id} 
            />
          </Grid>
        </Grid>

      </Paper>
    </Container>
  );
}
