"use client";

import { useState } from "react";
import { toggleAvailability } from "@/app/actions/dashboardActions";
import { generateMatches } from "@/app/actions/matchmakingActions";
import { Button, Typography, Paper, Box, CircularProgress, Divider } from "@mui/material";

export default function DashboardClient({ initialAvailable, userName }: { initialAvailable: boolean, userName: string | null }) {
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
    <Paper elevation={4} sx={{ p: 6, mt: 4, textAlign: 'center', borderRadius: 4, 
      background: available ? 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)' : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' 
    }}>
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
            background: available ? 'linear-gradient(45deg, #00c6ff, #0072ff)' : 'linear-gradient(45deg, #ff416c, #ff4b2b)',
            boxShadow: available ? '0 10px 30px rgba(0, 114, 255, 0.5)' : '0 10px 30px rgba(255, 75, 43, 0.5)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: available ? '0 15px 40px rgba(0, 114, 255, 0.7)' : '0 15px 40px rgba(255, 75, 43, 0.7)',
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
