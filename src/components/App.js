import React from 'react';
import Pomodoro from './Pomodoro';
import Footer from './Footer';
import Header from './Header';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { SnackbarProvider } from '../SnackbarContext'; // Import SnackbarProvider
import Statistics from './Statistics';
import { useSelector } from 'react-redux';

const App = () => {
  const isDarkMode = useSelector((state) => state.settings.isDarkMode);

  return (
    <ThemeProvider theme={theme(isDarkMode ? 'dark' : 'light')}>
      <CssBaseline />
      <SnackbarProvider>
        <Header />
        <Pomodoro />
        <Statistics />
        <Footer />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
