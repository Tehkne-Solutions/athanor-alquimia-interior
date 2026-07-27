import { BookOpen, Boxes, ClipboardCheck, MailOpen, Map, ScrollText, Settings2, UserRound } from 'lucide-react';
import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAthanorStore } from '../state/useAthanorStore';
import { RouteAnnouncer } from './RouteAnnouncer';

const navItems = [
  { to: '/temple', label: 'Templo', icon: Map },
  { to: '/character', label: 'Personagem', icon: UserRound },
  { to: '/mission/word-before-response', label: 'Jornada', icon: ScrollText },
  { to: '/inventory', label: 'Inventário', icon: Boxes },
  { to: '/codex', label: 'Codex', icon: BookOpen }
] as const;

export function AppShell() {
  const highContrast = useAthanorStore((state) => state.preferences.highContrast);
  const reducedMotion = useAthanorStore((state) => state.preferences.reducedMotion);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.contrast = highContrast ? 'high' : 'standard';
    root.dataset.motion = reducedMotion ? 'reduced' : 'full';
  }, [highContrast, reducedMotion]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Ir para o conteúdo principal</a>
      <RouteAnnouncer/>
      <aside className="side-nav" aria-label="Navegação principal">
        <NavLink className="brand" to="/temple" aria-label="Athanor, voltar ao Templo">
          <span className="brand__mark">A</span>
          <span className="brand__text"><strong>Athanor</strong><small>Alquimia Interior</small></span>
        </NavLink>
        <nav>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}>
              <Icon size={20} aria-hidden="true" /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="side-nav__tools" aria-label="Ferramentas internas e configurações">
          <NavLink className="side-nav__settings" to="/temple/continuous-return">
            <MailOpen size={18} aria-hidden="true" />
            <span>Retornos opcionais</span>
          </NavLink>
          <NavLink className="side-nav__settings" to="/settings/accessibility">
            <Settings2 size={18} aria-hidden="true" />
            <span>Acessibilidade</span>
          </NavLink>
          <NavLink className="side-nav__settings" to="/homologation">
            <ClipboardCheck size={18} aria-hidden="true" />
            <span>Homologação</span>
          </NavLink>
        </div>
        <p className="side-nav__signature">Tehkné Solutions</p>
      </aside>
      <main className="app-main" id="main-content" tabIndex={-1}><Outlet /></main>
      <nav className="bottom-nav" aria-label="Navegação principal mobile">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}>
            <Icon size={19} aria-hidden="true" /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
