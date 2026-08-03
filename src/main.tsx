import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import appConfig from '@/config/env';
import './index.css';
import './i18n';

(function preconnectApiOrigin() {
  try {
    const { origin } = new URL(appConfig.backendUrl);
    if (origin === window.location.origin) return;
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  } catch {
    
  }
})();

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
