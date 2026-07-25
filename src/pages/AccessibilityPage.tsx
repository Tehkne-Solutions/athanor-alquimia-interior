import { Eye, Gauge, Keyboard, ShieldCheck } from 'lucide-react';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';

export function AccessibilityPage() {
  const preferences = useAthanorStore((state) => state.preferences);
  const updatePreferences = useAthanorStore((state) => state.updatePreferences);

  return (
    <div className="page page--settings">
      <PageHeader
        eyebrow="Preferências locais"
        title="Acessibilidade e conforto visual"
        description="As escolhas são salvas somente neste dispositivo e podem ser alteradas a qualquer momento."
      />

      <div className="settings-grid">
        <Card title="Contraste" eyebrow="Leitura">
          <label className="settings-toggle">
            <span className="settings-toggle__icon"><Eye aria-hidden="true" /></span>
            <span><strong>Alto contraste</strong><small>Reforça texto, bordas, foco e diferenciação dos painéis.</small></span>
            <input
              type="checkbox"
              checked={preferences.highContrast}
              onChange={(event) => updatePreferences({ highContrast: event.target.checked })}
            />
          </label>
        </Card>

        <Card title="Movimento" eyebrow="Conforto">
          <label className="settings-toggle">
            <span className="settings-toggle__icon"><Gauge aria-hidden="true" /></span>
            <span><strong>Reduzir movimento</strong><small>Desativa animações narrativas, deslocamentos e efeitos contínuos.</small></span>
            <input
              type="checkbox"
              checked={preferences.reducedMotion}
              onChange={(event) => updatePreferences({ reducedMotion: event.target.checked })}
            />
          </label>
        </Card>

        <Card title="Navegação" eyebrow="Disponível em toda a experiência">
          <div className="accessibility-note"><Keyboard aria-hidden="true"/><p>Os desafios principais oferecem alternativa sem arrastar, foco visível e navegação por teclado.</p></div>
        </Card>

        <Card title="Compromisso do produto" eyebrow="Segurança">
          <div className="accessibility-note"><ShieldCheck aria-hidden="true"/><p>Nenhum conteúdo depende apenas de cor, áudio ou animação. O fluxo crítico remove metáforas e efeitos narrativos.</p></div>
        </Card>
      </div>
    </div>
  );
}
