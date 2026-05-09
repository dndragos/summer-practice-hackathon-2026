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
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const { data: session, status } = useSession();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        .catch(() => { });
    }
  }, [status]);

  const displayImage = userImage ?? session?.user?.image ?? undefined;
  const displayName = userName ?? session?.user?.name ?? "User";

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Events Map", href: "/events-map" },
    { label: "New Event", href: "/events/new" },
    { label: "My Events", href: "/my-events" },
    { label: "Profile", href: "/profile" },
  ];

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          background: "linear-gradient(90deg, #c86b2d 0%, #e09c64 100%)",
          zIndex: 1000,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              ShowUp2Move
            </Link>
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            {navLinks.map((link) => (
              <Button key={link.href} color="inherit" component={Link} href={link.href}>
                {link.label}
              </Button>
            ))}

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

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleCloseMobileMenu}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#fff9f3",
            width: 280,
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleCloseMobileMenu}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <List sx={{ pt: 0 }}>
          {navLinks.map((link) => (
            <ListItem
              key={link.href}
              button
              component={Link}
              href={link.href}
              onClick={handleCloseMobileMenu}
              sx={{
                color: "#c86b2d",
                fontWeight: 500,
                "&:hover": { backgroundColor: "#ffe0c1" },
              }}
            >
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* User Section in Mobile Menu */}
        <Box sx={{ p: 2 }}>
          {status === "loading" ? (
            <Typography color="text.secondary">Loading...</Typography>
          ) : session ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                  p: 1.5,
                  backgroundColor: "#fff2e3",
                  borderRadius: 1,
                }}
              >
                <Avatar
                  alt={displayName}
                  src={displayImage as string | undefined}
                  sx={{ width: 40, height: 40 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {displayName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {session.user?.email}
                  </Typography>
                </Box>
              </Box>
              <Button
                fullWidth
                component={Link}
                href="/profile"
                variant="outlined"
                color="inherit"
                sx={{
                  color: "#c86b2d",
                  borderColor: "#c86b2d",
                  mb: 1,
                  "&:hover": { backgroundColor: "#ffe0c1" },
                }}
                onClick={handleCloseMobileMenu}
              >
                View Profile
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  background: "linear-gradient(45deg, #c86b2d, #e09c64)",
                  color: "white",
                }}
                onClick={() => {
                  signOut();
                  handleCloseMobileMenu();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #c86b2d, #e09c64)",
                color: "white",
              }}
              onClick={() => {
                signIn();
                handleCloseMobileMenu();
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Drawer>

      {/* Spacing to account for fixed navbar */}
      <Box sx={{ height: 64 }} />
    </>
  );
}
