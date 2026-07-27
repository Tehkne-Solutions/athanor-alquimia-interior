import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { validateContent } from './content/validate';
import './content/validateContinuousCollection';
import './content/validateContinuousCycle';
import './content/validateContinuousMap';
import './content/validateContinuousReceive';
import './content/validateContinuousResponse';
import './content/validateContinuousReturn';
import './content/validateContinuousShare';
import './content/validateContinuousTheme';
import './content/validateContinuousThemeCycle';
import './content/validateContinuousTrail';
import './content/validateContinuousVariation';
import './content/validateNewWork';
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
import './styles/fire-boundary.css';
import './styles/fire-courage.css';
import './styles/fire-transformation.css';
import './styles/fire-shield.css';
import './styles/fire-chapter.css';
import './styles/earth.css';
import './styles/earth-body.css';
import './styles/earth-work.css';
import './styles/earth-resources.css';
import './styles/earth-rhythm.css';
import './styles/earth-order.css';
import './styles/earth-stone.css';
import './styles/earth-chapter.css';
import './styles/spirit.css';
import './styles/spirit-thread.css';
import './styles/spirit-center.css';
import './styles/spirit-council.css';
import './styles/spirit-decision.css';
import './styles/spirit-return.css';
import './styles/spirit-orb.css';
import './styles/spirit-chapter.css';
import './styles/new-work.css';
import './styles/continuous-cycle.css';
import './styles/continuous-trail.css';
import './styles/continuous-theme-cycle.css';
import './styles/continuous-map.css';
import './styles/continuous-collection.css';
import './styles/continuous-share.css';
import './styles/continuous-receive.css';
import './styles/continuous-response.css';
import './styles/continuous-return.css';

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
