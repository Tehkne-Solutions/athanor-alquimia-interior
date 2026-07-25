import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { validateContent } from './content/validate';
import './styles/global.css';
import './styles/homologation.css';
import './styles/research.css';
import './styles/water.css';
import './styles/water-lament.css';
import './styles/water-memory.css';
import './styles/water-trust.css';
import './styles/water-chalice.css';
import './styles/water-chapter.css';
import './styles/fire.css';
import './styles/fire-mission.css';
import './styles/fire-interval.css';

validateContent();

createRoot(document.getElementById('root')!).render(
  <StrictMode><BrowserRouter><App/></BrowserRouter></StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {
      // A aplicação permanece funcional online quando o cache offline não puder ser registrado.
    });
  });
}
