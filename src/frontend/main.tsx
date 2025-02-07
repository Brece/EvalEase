import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './app/styles/index.css';
import App from './app/App';

const STALE_TIME = {
  oneMinute: 1000 * 60,
  fiveMinutes: 1000 * 60 * 5,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME.fiveMinutes,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
