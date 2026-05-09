"use client";

import { useMemo } from "react";
import { Paper, Box, Typography, Stack, Chip, Card, CardContent } from "@mui/material";
import { FakeEvent } from "@/lib/fakeEventsData";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EventIcon from "@mui/icons-material/Event";

interface MapProps {
    events: FakeEvent[];
    selectedEvent?: FakeEvent | null;
}

export default function EventsMap({ events, selectedEvent }: MapProps) {
    // Calculate bounds
    const bounds = useMemo(() => {
        if (events.length === 0)
            return {
                minLat: 40.7,
                maxLat: 40.8,
                minLng: -74.0,
                maxLng: -73.9,
            };

        let minLat = events[0].locationLat;
        let maxLat = events[0].locationLat;
        let minLng = events[0].locationLng;
        let maxLng = events[0].locationLng;

        events.forEach((event) => {
            minLat = Math.min(minLat, event.locationLat);
            maxLat = Math.max(maxLat, event.locationLat);
            minLng = Math.min(minLng, event.locationLng);
            maxLng = Math.max(maxLng, event.locationLng);
        });

        // Add padding
        const latPadding = (maxLat - minLat) * 0.15;
        const lngPadding = (maxLng - minLng) * 0.15;

        return {
            minLat: minLat - latPadding,
            maxLat: maxLat + latPadding,
            minLng: minLng - lngPadding,
            maxLng: maxLng + lngPadding,
        };
    }, [events]);

    // Convert lat/lng to pixel coordinates
    const getPixelPosition = (lat: number, lng: number) => {
        const mapWidth = 800;
        const mapHeight = 500;

        const x =
            ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * mapWidth;
        const y =
            ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * mapHeight;

        return { x, y };
    };

    const getSportColor = (sport: string): string => {
        const colors: { [key: string]: string } = {
            Football: "#e74c3c",
            Basketball: "#f39c12",
            Tennis: "#27ae60",
            Volleyball: "#3498db",
            Running: "#9b59b6",
            Swimming: "#1abc9c",
            Padel: "#e67e22",
            "Table Tennis": "#34495e",
        };
        return colors[sport] || "#95a5a6";
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
        >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                📍 Events Map
            </Typography>

            <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
                {/* Map Canvas */}
                <Box
                    sx={{
                        flex: 1,
                        position: "relative",
                        backgroundColor: "#e8f4f8",
                        borderRadius: 2,
                        border: "2px solid #3498db",
                        overflow: "hidden",
                        minHeight: 500,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 800 500"
                        style={{ backgroundColor: "#e8f4f8" }}
                    >
                        {/* Background grid */}
                        <defs>
                            <pattern
                                id="grid"
                                width="50"
                                height="50"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 50 0 L 0 0 0 50"
                                    fill="none"
                                    stroke="#bdc3c7"
                                    strokeWidth="0.5"
                                />
                            </pattern>
                        </defs>
                        <rect width="800" height="500" fill="url(#grid)" />

                        {/* Event markers */}
                        {events.map((event) => {
                            const pos = getPixelPosition(
                                event.locationLat,
                                event.locationLng
                            );
                            const isSelected = selectedEvent?.id === event.id;

                            return (
                                <g key={event.id}>
                                    {/* Marker pin */}
                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r={isSelected ? 16 : 12}
                                        fill={getSportColor(event.sportName)}
                                        opacity={isSelected ? 1 : 0.8}
                                        style={{
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                    />
                                    {/* Inner circle */}
                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r={isSelected ? 8 : 6}
                                        fill="white"
                                    />
                                    {/* Participant count */}
                                    <text
                                        x={pos.x}
                                        y={pos.y + 25}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fontWeight="bold"
                                        fill="#2c3e50"
                                    >
                                        {event.participants} players
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </Box>

                {/* Events List */}
                <Box
                    sx={{
                        flex: 0.5,
                        maxHeight: 500,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Events ({events.length})
                    </Typography>

                    <Stack spacing={2}>
                        {events.map((event) => (
                            <Card
                                key={event.id}
                                sx={{
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    borderLeft: `4px solid ${getSportColor(event.sportName)}`,
                                    backgroundColor:
                                        selectedEvent?.id === event.id ? "#fff9e6" : "white",
                                    "&:hover": {
                                        boxShadow: 3,
                                        transform: "translateX(4px)",
                                    },
                                }}
                            >
                                <CardContent sx={{ py: 1.5, px: 2 }}>
                                    <Stack spacing={1}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: "bold", fontSize: "0.95rem" }}
                                        >
                                            {event.title}
                                        </Typography>

                                        <Stack spacing={0.5} sx={{ fontSize: "0.85rem" }}>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{ alignItems: "center" }}
                                            >
                                                <SportsSoccerIcon sx={{ fontSize: "1rem" }} />
                                                <Typography variant="caption">
                                                    {event.sportName}
                                                </Typography>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{ alignItems: "center" }}
                                            >
                                                <LocationOnIcon sx={{ fontSize: "1rem" }} />
                                                <Typography variant="caption">
                                                    {event.locationName}
                                                </Typography>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{ alignItems: "center" }}
                                            >
                                                <EventIcon sx={{ fontSize: "1rem" }} />
                                                <Typography variant="caption">
                                                    {new Date(event.scheduledTime).toLocaleDateString()}{" "}
                                                    {new Date(event.scheduledTime).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </Typography>
                                            </Stack>
                                        </Stack>

                                        <Chip
                                            label={`${event.participants} players`}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{ alignSelf: "flex-start" }}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Box>
            </Box>

            {/* Legend */}
            <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #bdc3c7" }}>
                <Typography variant="caption" sx={{ fontWeight: "bold", display: "block", mb: 1 }}>
                    Sports Legend:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    {[
                        "Football",
                        "Basketball",
                        "Tennis",
                        "Volleyball",
                        "Running",
                        "Swimming",
                        "Padel",
                        "Table Tennis",
                    ].map((sport) => (
                        <Box
                            key={sport}
                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: getSportColor(sport),
                                }}
                            />
                            <Typography variant="caption">{sport}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
}
