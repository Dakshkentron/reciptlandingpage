import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { initDatadogRum } from '@/lib/datadog';
import './index.css';

// Before the first render, so RUM sees the initial page load timings.
initDatadogRum();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
