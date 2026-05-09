"use client";

import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const { data: session, status } = useSession();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Fetch fresh image from DB whenever the session is available
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/me")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) {
            setUserImage(data.image);
            setUserName(data.name);
          }
        })
        .catch(() => {});
    }
  }, [status]);

  const displayImage = userImage ?? session?.user?.image ?? undefined;
  const displayName = userName ?? session?.user?.name ?? "User";

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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            ShowUp2Move
          </Link>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
            <Button color="inherit" disabled>
              Loading...
            </Button>
          ) : session ? (
            <>
              <Tooltip title={`${displayName} — View Profile`}>
                <IconButton component={Link} href="/profile" sx={{ p: 0 }}>
                  <Avatar
                    alt={displayName}
                    src={displayImage as string | undefined}
                    sx={{
                      width: 38,
                      height: 38,
                      border: "2px solid rgba(255,255,255,0.8)",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  />
                </IconButton>
              </Tooltip>
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
