"use client";

import { useState } from "react";
import { Box, Paper, Stack, Chip, Button, CircularProgress, Alert } from "@mui/material";
import { exitEvent } from "@/app/actions/eventActions";

type Event = {
    id: string;
    title: string;
    sportName: string;
    locationName: string;
    scheduledTime: Date;
};

interface MyEventsClientProps {
    events: Event[];
}

export default function MyEventsClient({ events }: MyEventsClientProps) {
    const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
    const [exitedEventId, setExitedEventId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleExitEvent = async (eventId: string) => {
        setLoadingEventId(eventId);
        setError(null);
        try {
            await exitEvent(eventId);
            setExitedEventId(eventId);
            // Remove the event from the display
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err: any) {
            setError(err.message || "Failed to exit event");
            setLoadingEventId(null);
        }
    };

    // Filter out exited events
    const displayedEvents = events.filter((e) => e.id !== exitedEventId);

    if (exitedEventId && displayedEvents.length === 0) {
        return (
            <Stack spacing={2}>
                <Alert severity="success">You have successfully exited the event!</Alert>
            </Stack>
        );
    }

    return (
        <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {displayedEvents.map((event) => (
                <Paper key={event.id} sx={{ p: 3 }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{ justifyContent: "space-between", alignItems: { xs: "start", sm: "center" } }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ fontWeight: "bold", fontSize: "1.1rem", mb: 0.5 }}>
                                {event.title}
                            </Box>
                            <Box sx={{ color: "text.secondary", fontSize: "0.95rem", mb: 0.25 }}>
                                {event.locationName}
                            </Box>
                            <Box sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                                {new Date(event.scheduledTime).toLocaleString()}
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <Chip label={event.sportName} color="secondary" />
                            <Button href={`/events/${event.id}`} variant="contained" size="small">
                                Open
                            </Button>
                            <Button
                                onClick={() => handleExitEvent(event.id)}
                                disabled={loadingEventId !== null}
                                variant="outlined"
                                color="error"
                                size="small"
                            >
                                {loadingEventId === event.id ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    "Exit"
                                )}
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
}
