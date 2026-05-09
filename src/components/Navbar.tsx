"use client";

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <AppBar
      position="sticky"
      color="primary"
      sx={{
        mb: 4,
        background: "linear-gradient(90deg, #c86b2d 0%, #e09c64 100%)",
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            ShowUp2Move
          </Link>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} href="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} href="/events/new">
            New Event
          </Button>
          <Button color="inherit" component={Link} href="/my-events">
            My Events
          </Button>
          <Button color="inherit" component={Link} href="/profile">
            Profile
          </Button>

          {status === "loading" ? (
            <Button color="inherit" disabled>Loading...</Button>
          ) : session ? (
            <>
              <Avatar alt={session.user?.name || "User"} src={session.user?.image || undefined} />
              <Button color="inherit" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => signIn()}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
