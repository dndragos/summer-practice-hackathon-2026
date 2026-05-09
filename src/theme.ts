'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#c86b2d",
      light: "#e8a16d",
      dark: "#994816",
      contrastText: "#fff7f2",
    },
    secondary: {
      main: "#6b8f71",
      light: "#91b497",
      dark: "#4d6d53",
    },
    background: {
      default: "#fff8f1",
      paper: "#fffdf9",
    },
    text: {
      primary: "#3f291f",
      secondary: "#7f5d4f",
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #f2dfd2",
        },
      },
    },
  },
});

export default theme;
