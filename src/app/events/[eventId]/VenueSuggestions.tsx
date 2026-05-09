"use client";

import { useState, useEffect } from "react";
import { updateEventLocation } from "@/app/actions/eventActions";
import { Box, Typography, Button, CircularProgress, Card, CardContent, CardActions } from "@mui/material";
import { LocationOn } from "@mui/icons-material";

type Venue = {
  name: string;
  address: string;
  rating: number;
  lat?: number;
  lng?: number;
};

export default function VenueSuggestions({ eventId, sportName }: { eventId: string, sportName: string }) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const res = await fetch(`/api/venues?sportName=${encodeURIComponent(sportName)}`);
        const data = await res.json();
        if (data.results) {
          setVenues(data.results);
        }
      } catch (error) {
        console.error("Failed to fetch venues", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, [sportName]);

  const handleSelectVenue = async (venue: Venue) => {
    setSaving(true);
    try {
      await updateEventLocation(eventId, venue.name, venue.lat, venue.lng);
      alert("Location updated successfully!");
    } catch (error) {
      console.error("Failed to update location", error);
      alert("Failed to update location.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}><CircularProgress size={24} /> <Typography>Finding nearby venues...</Typography></Box>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationOn color="primary" /> Venue Suggestions
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        As the team captain, you can select a venue for this match.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
        {venues.map((venue, idx) => (
          <Card key={idx} variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderRadius: 2 }}>
            <CardContent sx={{ pb: '16px !important' }}>
              <Typography variant="h6" fontWeight="bold">{venue.name}</Typography>
              <Typography variant="body2" color="text.secondary">{venue.address}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Rating: ⭐ {venue.rating}</Typography>
            </CardContent>
            <CardActions sx={{ pr: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                disabled={saving}
                onClick={() => handleSelectVenue(venue)}
                sx={{ borderRadius: 2 }}
              >
                Select
              </Button>
            </CardActions>
          </Card>
        ))}
        {venues.length === 0 && <Typography>No venues found nearby.</Typography>}
      </Box>
    </Box>
  );
}
