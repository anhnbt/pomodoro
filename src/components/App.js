import React from "react";
import Pomodoro from "./Pomodoro";
import Footer from "./Footer";
import Header from "./Header";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { SnackbarProvider } from "../SnackbarContext"; // Import SnackbarProvider

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <Header />
        <Pomodoro />
        <Footer />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
