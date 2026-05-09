export type FakeEvent = {
    id: string;
    title: string;
    sportName: string;
    locationName: string;
    locationLat: number;
    locationLng: number;
    scheduledTime: Date;
    status: string;
    participants: number;
};

export const fakeEventsData: FakeEvent[] = [
    {
        id: "event-1",
        title: "Friday Night Football",
        sportName: "Football",
        locationName: "Central Park Arena",
        locationLat: 40.7829,
        locationLng: -73.9654,
        scheduledTime: new Date("2026-05-15T19:00:00"),
        status: "upcoming",
        participants: 12,
    },
    {
        id: "event-2",
        title: "Basketball Championship",
        sportName: "Basketball",
        locationName: "Madison Square Garden",
        locationLat: 40.7505,
        locationLng: -73.9972,
        scheduledTime: new Date("2026-05-16T18:30:00"),
        status: "upcoming",
        participants: 24,
    },
    {
        id: "event-3",
        title: "Tennis Tournament",
        sportName: "Tennis",
        locationName: "Flushing Meadows Park",
        locationLat: 40.7282,
        locationLng: -73.8648,
        scheduledTime: new Date("2026-05-17T14:00:00"),
        status: "upcoming",
        participants: 8,
    },
    {
        id: "event-4",
        title: "Volleyball Beach Match",
        sportName: "Volleyball",
        locationName: "Rockaway Beach",
        locationLat: 40.5795,
        locationLng: -73.8129,
        scheduledTime: new Date("2026-05-18T16:00:00"),
        status: "upcoming",
        participants: 10,
    },
    {
        id: "event-5",
        title: "Morning Running Club",
        sportName: "Running",
        locationName: "Hudson River Greenway",
        locationLat: 40.7614,
        locationLng: -73.9776,
        scheduledTime: new Date("2026-05-15T07:00:00"),
        status: "upcoming",
        participants: 15,
    },
    {
        id: "event-6",
        title: "Swimming Race",
        sportName: "Swimming",
        locationName: "East River Pool",
        locationLat: 40.7249,
        locationLng: -73.9680,
        scheduledTime: new Date("2026-05-19T09:00:00"),
        status: "upcoming",
        participants: 20,
    },
    {
        id: "event-7",
        title: "Padel Tournament",
        sportName: "Padel",
        locationName: "Manhattan Sports Club",
        locationLat: 40.7480,
        locationLng: -73.9862,
        scheduledTime: new Date("2026-05-20T17:00:00"),
        status: "upcoming",
        participants: 12,
    },
    {
        id: "event-8",
        title: "Table Tennis League",
        sportName: "Table Tennis",
        locationName: "Downtown Recreation Center",
        locationLat: 40.7128,
        locationLng: -74.0060,
        scheduledTime: new Date("2026-05-21T19:00:00"),
        status: "upcoming",
        participants: 6,
    },
];
