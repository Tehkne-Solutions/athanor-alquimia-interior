import { useLocation } from 'react-router-dom';

const routeLabels: Record<string, string> = {
  '/temple': 'Átrio da Presença',
  '/temple/map': 'Mapa do Templo',
  '/temple/proverbs-library': 'Biblioteca dos Provérbios',
  '/mission/word-before-response': 'Missão A Palavra Antes da Resposta',
  '/mission/word-before-response/classification': 'Classificação da missão',
  '/mission/word-before-response/chain': 'Cadeia simbólica da Palavra Clara',
  '/crafting/clear-word-lamp': 'Forja da Lâmpada da Palavra Clara',
  '/items/clear-word-lamp': 'Lâmpada da Palavra Clara',
  '/review/clear-word-lamp': 'Revisão da Lâmpada da Palavra Clara',
  '/inventory': 'Inventário',
  '/codex': 'Codex',
  '/character': 'Ficha do personagem',
  '/settings/accessibility': 'Configurações de acessibilidade',
  '/homologation': 'Modo de homologação'
};

export function RouteAnnouncer() {
  const location = useLocation();
  const label = routeLabels[location.pathname] ?? 'Athanor — Alquimia Interior';

  return <p className="route-announcer visually-hidden" role="status" aria-live="polite" aria-atomic="true">Página atual: {label}</p>;
}
