"use client";

import { useState } from "react";
import { toggleAvailability } from "@/app/actions/dashboardActions";
import { generateMatches } from "@/app/actions/matchmakingActions";
import { Button, Typography, Paper, Box, CircularProgress, Divider, Stack, Chip } from "@mui/material";
import Link from "next/link";

type EventPreview = {
  id: string;
  title: string;
  sportName: string;
  scheduledTime: Date;
  locationName: string;
};

export default function DashboardClient({
  initialAvailable,
  userName,
  upcomingEvents,
}: {
  initialAvailable: boolean;
  userName: string | null;
  upcomingEvents: EventPreview[];
}) {
  const [available, setAvailable] = useState(initialAvailable);
  const [loading, setLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleAvailability(available);
      setAvailable(!available);
    } catch (e) {
      console.error("Failed to toggle availability", e);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchmaking = async () => {
    setMatchLoading(true);
    try {
      const res = await generateMatches();
      alert(res.message);
    } catch (e) {
      console.error("Matchmaking failed", e);
      alert("Failed to generate matches.");
    } finally {
      setMatchLoading(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 6,
        mt: 4,
        textAlign: "center",
        borderRadius: 4,
        background: available
          ? "linear-gradient(135deg, #fff2e3 0%, #ffe0c1 100%)"
          : "linear-gradient(135deg, #fff8f1 0%, #ffe7d2 100%)",
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Welcome back, {userName || 'Athlete'}!
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
        {available ? "You are ready to play today! 🔥" : "Taking a rest today? 💤"}
      </Typography>

      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Button
          onClick={handleToggle}
          disabled={loading}
          sx={{
            width: 250,
            height: 250,
            borderRadius: '50%',
            fontSize: '2rem',
            fontWeight: '900',
            textTransform: 'none',
            color: 'white',
            background: available
              ? "linear-gradient(45deg, #c86b2d, #e09c64)"
              : "linear-gradient(45deg, #b96a3d, #d98659)",
            boxShadow: "0 10px 30px rgba(191, 110, 51, 0.35)",
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: "0 15px 40px rgba(191, 110, 51, 0.45)",
            }
          }}
        >
          {loading ? (
            <CircularProgress color="inherit" size={60} />
          ) : available ? (
            "I'm Showing Up!"
          ) : (
            "ShowUpToday?"
          )}
        </Button>
      </Box>

      {/* Demo Only */}
      <Divider sx={{ my: 4 }} />
      <Box sx={{ textAlign: "left", mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upcoming Events
        </Typography>
        {upcomingEvents.length === 0 ? (
          <Typography color="text.secondary">No upcoming events yet.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {upcomingEvents.map((event) => (
              <Paper key={event.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography fontWeight="bold">{event.title}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {new Date(event.scheduledTime).toLocaleString()} - {event.locationName}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip size="small" label={event.sportName} color="secondary" />
                    <Button component={Link} href={`/events/${event.id}`} variant="outlined" size="small">
                      Open
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Hackathon Demo Controls
        </Typography>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={handleMatchmaking}
          disabled={matchLoading}
        >
          {matchLoading ? <CircularProgress size={24} /> : "Trigger Matchmaking"}
        </Button>
      </Box>
    </Paper>
  );
}
