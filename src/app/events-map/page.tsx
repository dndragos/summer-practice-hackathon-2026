"use client";

import { useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import EventsMap from "@/components/EventsMap";
import { fakeEventsData } from "@/lib/fakeEventsData";

export default function EventsMapPage() {
    const [selectedEvent, setSelectedEvent] = useState(fakeEventsData[0]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                    🗺️ Events Map
                </Typography>
                <Typography color="text.secondary">
                    View all upcoming events on the map and find the perfect match near you.
                </Typography>
            </Box>

            <EventsMap events={fakeEventsData} selectedEvent={selectedEvent} />
        </Container>
    );
}
