import { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material';
import AppRoutes from './routes/routes';
import './App.css';

function App() {
  const colors = {
    violetBrandLight: '#714FB6',
    violetBrand: '#493570',
    white: '#FFFFFF',
    black: '#000000',
    lightGray: '#E3E3E9',
    darkGray: '#363745',
    brandRed: '#AD3459',
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: colors.violetBrand,
        light: colors.violetBrandLight,
      },
      secondary: {
        main: colors.brandRed,
      },
      error: {
        main: colors.brandRed,
      },
      background: {
        default: colors.lightGray,
        paper: colors.white,
      },
      text: {
        primary: colors.black,
        secondary: colors.darkGray,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<h1>Loading...</h1>}>
        <AnimatePresence>
          <AppRoutes />
        </AnimatePresence>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
