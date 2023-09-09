import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    timer: {
      fontSize: 120,
      fontWeight: "bold",
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#ba4949",
    },
    secondary: {
      main: "#ffffff",
    },
  }
});

export default theme;
