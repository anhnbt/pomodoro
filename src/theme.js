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
        letterSpacing: '0.05em',
        textShadow:
          mode === 'dark'
            ? '0 2px 10px rgba(255, 255, 255, 0.3)'
            : '0 2px 10px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease-in-out',
      },
      h6: {
        fontWeight: 500,
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
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
        light: '#cf6363',
        dark: '#9e3a3a',
        contrastText: '#ffffff',
      },
      shortBreak: {
        main: 'rgb(70, 142, 145)',
        light: 'rgb(106, 167, 169)',
        dark: 'rgb(56, 114, 116)',
        contrastText: '#ffffff',
      },
      longBreak: {
        main: 'rgb(67, 126, 168)',
        light: 'rgb(102, 150, 184)',
        dark: 'rgb(54, 101, 134)',
        contrastText: '#ffffff',
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
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            transition: 'all 0.3s ease',
            fontWeight: 500,
          },
          containedPrimary: {
            boxShadow: '0 4px 10px rgba(186, 73, 73, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 15px rgba(186, 73, 73, 0.4)',
            },
          },
          containedSecondary: {
            boxShadow:
              mode === 'dark'
                ? '0 4px 10px rgba(255, 255, 255, 0.15)'
                : '0 4px 10px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow:
                mode === 'dark'
                  ? '0 6px 15px rgba(255, 255, 255, 0.2)'
                  : '0 6px 15px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            transition: 'all 0.5s ease-in-out',
          },
          circle: {
            strokeLinecap: 'round',
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease-in-out',
          },
        },
      },
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  });

export default theme;
