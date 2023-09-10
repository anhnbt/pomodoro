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
      fontSize: 110,
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
    pomodoro: {
      main: "#ba4949",
    },
    shortBreak: {
      main: "rgb(70, 142, 145)",
    },
    longBreak: {
      main: "rgb(67, 126, 168)",
    },
  }
});

export default theme;
