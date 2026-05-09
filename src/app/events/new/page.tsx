"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Paper, Typography, TextField, Button, Box, MenuItem, Alert } from "@mui/material";
import { createManualEvent } from "@/app/actions/eventActions";

const sports = [
  "Football", "Basketball", "Tennis", "Volleyball", "Running", "Swimming", "Padel", "Table Tennis"
];

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    try {
      const result = await createManualEvent(formData);
      if (result?.id) {
        router.push(`/events/${result.id}`);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
          Create New Event
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Organize your own match and lead your team!
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            required
            fullWidth
            label="Match Title"
            name="title"
            placeholder="e.g. Friday Night Football"
            variant="outlined"
          />

          <TextField
            select
            required
            fullWidth
            label="Sport"
            name="sportName"
            defaultValue=""
          >
            {sports.map((sport) => (
              <MenuItem key={sport} value={sport}>
                {sport}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            fullWidth
            label="Date and Time"
            name="scheduledTime"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            required
            fullWidth
            label="Location Name"
            name="locationName"
            placeholder="e.g. Central Park Arena"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ 
              mt: 2, 
              py: 1.5, 
              borderRadius: 2, 
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textTransform: 'none'
            }}
          >
            {loading ? "Creating..." : "Create Event"}
          </Button>
          
          <Button
            fullWidth
            variant="text"
            onClick={() => router.back()}
            disabled={loading}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
