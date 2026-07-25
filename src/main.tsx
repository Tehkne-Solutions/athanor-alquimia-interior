import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { validateContent } from './content/validate';
import './styles/global.css';

validateContent();

createRoot(document.getElementById('root')!).render(
  <StrictMode><BrowserRouter><App/></BrowserRouter></StrictMode>
);
