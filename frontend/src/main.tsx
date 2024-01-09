import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from 'styled-components';
import { theme } from './assets/app-theme';
import { GlobalStyles } from './assets/globalStyles.ts';
import { ListProvider } from './context/listContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ListProvider>
        <GlobalStyles />
        <App />
      </ListProvider>
    </ThemeProvider>
  </React.StrictMode>
);
