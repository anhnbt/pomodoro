import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = (mode) =>
  createTheme({
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      timer: {
        fontSize: 110,
        fontWeight: 'bold',
      },
    },
    palette: {
      mode: mode,
      primary: {
        main: '#ba4949',
      },
      secondary: {
        main: '#ffffff',
      },
      pomodoro: {
        main: '#ba4949',
      },
      shortBreak: {
        main: 'rgb(70, 142, 145)',
      },
      longBreak: {
        main: 'rgb(67, 126, 168)',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#ffffff',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#000000',
        secondary: mode === 'dark' ? '#b0b0b0' : '#4f4f4f',
      },
    },
  });

export default theme;
