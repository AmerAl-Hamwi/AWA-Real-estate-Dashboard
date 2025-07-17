import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#01C38D', // Green
    },
    secondary: {
      main: '#191E29', // Grayish brown
    },
    background: {
      default: '#ffffff',   // White for the page background
      paper: '#f5f5f5',     // Light grey paper/card backgrounds
    },
    text: {
      primary: '#333333',   // Dark gray
      secondary: '#5d5a55', // Lighter gray
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
