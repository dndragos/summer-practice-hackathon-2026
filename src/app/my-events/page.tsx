"use client";

import React from "react";
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Button } from "@mui/material";
import Link from "next/link";

export default function MyEventsPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          My Events
        </Typography>
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't joined or created any events yet.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" component={Link} href="/dashboard">
              Find Events
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
