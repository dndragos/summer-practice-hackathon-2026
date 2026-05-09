import { Box, Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 4, md: 8 },
          borderRadius: 5,
          background: "linear-gradient(135deg, #fff6ed 0%, #ffe5d0 100%)",
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Chip label="Sports Matching, Reimagined" color="secondary" />
          </Box>
          <Typography variant="h2">Find your team. Pick a venue. Just show up.</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700 }}>
            ShowUp2Move helps you create a profile, set availability, get matched into events,
            coordinate with your group, and keep everything simple.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button href="/dashboard" variant="contained" size="large">
              Open Dashboard
            </Button>
            <Button href="/events-map" variant="outlined" size="large">
              View Events Map
            </Button>
            <Button href="/profile" variant="outlined" size="large">
              Complete Profile
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
