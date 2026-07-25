import { ArrowRight, BookHeart, BookOpenCheck, Gamepad2, Landmark, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { OnboardingProgress } from '../components/OnboardingProgress';
import type { BiblicalMode, SymbolicLayer } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';

const modes: { id: BiblicalMode; label: string; description: string; icon: typeof BookHeart }[] = [
  { id: 'balanced', label: 'Equilibrado', description: 'Leitura, gameplay e contexto em proporções semelhantes.', icon: BookHeart },
  { id: 'devotional', label: 'Devocional', description: 'Maior presença de oração e contemplação.', icon: BookOpenCheck },
  { id: 'study', label: 'Estudo', description: 'Mais fontes, contexto e comparações.', icon: Landmark },
  { id: 'rpg', label: 'RPG', description: 'Mais missões, itens e progressão visual.', icon: Gamepad2 },
  { id: 'cultural', label: 'Cultural', description: 'Abordagem histórica e literária.', icon: BookOpenCheck },
  { id: 'authorial', label: 'Autoral', description: 'Fluxo sem textos tradicionais no núcleo da sessão.', icon: PenTool }
];
const layers: { id: SymbolicLayer; label: string; description: string }[] = [
  { id: 'sefer', label: 'Sefer Yetzirah', description: 'Letras e componentes de criação.' },
  { id: 'kabbalah', label: 'Cabala', description: 'Arquitetura e regiões do Templo.' },
  { id: 'iching', label: 'I Ching', description: 'Movimentos e mutações.' },
  { id: 'tarot', label: 'Tarot', description: 'Arquétipos e personagens secundários.' }
];

export function BibleSetupPage() {
  const navigate = useNavigate();
  const preferences = useAthanorStore((state) => state.preferences);
  const updatePreferences = useAthanorStore((state) => state.updatePreferences);
  const toggleLayer = useAthanorStore((state) => state.toggleLayer);
  const completeOnboarding = useAthanorStore((state) => state.completeOnboarding);
  const submit = () => { completeOnboarding(); navigate('/temple'); };
  return (
    <main className="onboarding-page" id="main-content">
      <OnboardingProgress current={3}/>
      <header className="onboarding-header"><p className="eyebrow">Fundação · fontes</p><h1>Configure como deseja atravessar as fontes.</h1><p>A Bíblia é o núcleo editorial da campanha principal. As camadas secundárias são opcionais, reversíveis e sempre mostram sua proveniência.</p></header>
      <div className="onboarding-grid">
        <Card title="Modo de experiência" eyebrow="Ajustável a qualquer momento" className="onboarding-grid__wide"><div className="option-grid option-grid--3">{modes.map(({ id, label, description, icon: Icon }) => <button key={id} type="button" aria-pressed={preferences.biblicalMode === id} onClick={() => updatePreferences({ biblicalMode: id })} className={`choice-card ${preferences.biblicalMode === id ? 'choice-card--selected' : ''}`}><Icon size={19}/><strong>{label}</strong><span>{description}</span></button>)}</div></Card>
        <Card title="Camadas simbólicas" eyebrow="Todas são opcionais"><div className="toggle-list">{layers.map((layer) => <label key={layer.id} className="toggle-row"><span><strong>{layer.label}</strong><small>{layer.description}</small></span><input type="checkbox" checked={preferences.enabledLayers.includes(layer.id)} onChange={() => toggleLayer(layer.id)} /></label>)}</div></Card>
        <Card title="Privacidade por padrão" eyebrow="Local-first"><ul className="simple-list"><li>Sem conta obrigatória</li><li>Sem IA no vertical slice</li><li>Sem envio do Diário</li><li>Analytics desativados</li><li>Exclusão disponível no perfil</li></ul></Card>
      </div>
      <div className="onboarding-actions"><Button onClick={submit}>Entrar no Átrio <ArrowRight size={18}/></Button></div>
    </main>
  );
}
