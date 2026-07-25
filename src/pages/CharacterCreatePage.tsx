import { ArrowRight, Palette, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAthanorStore } from '../state/useAthanorStore';
import type { CharacterClass, CharacterOrigin } from '../domain/types';

const origins: { id: CharacterOrigin; label: string; description: string }[] = [
  { id: 'reader', label: 'Leitor', description: 'Chegou ao Templo por textos e perguntas.' },
  { id: 'traveler', label: 'Viajante', description: 'Chegou durante uma transição.' },
  { id: 'builder', label: 'Construtor', description: 'Busca transformar planos em ações.' },
  { id: 'keeper', label: 'Guardião', description: 'Explora limites, cuidado e responsabilidade.' },
  { id: 'artificer', label: 'Artífice', description: 'Deseja criar símbolos e itens.' },
  { id: 'contemplative', label: 'Contemplativo', description: 'Busca leitura, silêncio e presença.' }
];

const classes: { id: CharacterClass; label: string; description: string }[] = [
  { id: 'scribe', label: 'Escriba', description: 'Textos, linguagem, Codex e inscrições.' },
  { id: 'artisan', label: 'Artesão', description: 'Crafting, elementos e criação de itens.' },
  { id: 'guardian', label: 'Guardião', description: 'Limites, disciplina e proteção simbólica.' },
  { id: 'navigator', label: 'Navegante', description: 'Ciclos, mudanças e caminhos alternativos.' },
  { id: 'mediator', label: 'Mediador', description: 'Escuta, comunicação e equilíbrio.' },
  { id: 'pilgrim', label: 'Peregrino', description: 'Exploração, campanhas e flexibilidade.' }
];

export function CharacterCreatePage() {
  const navigate = useNavigate();
  const draft = useAthanorStore((state) => state.draftCharacter);
  const updateDraft = useAthanorStore((state) => state.updateDraftCharacter);
  const createCharacter = useAthanorStore((state) => state.createCharacter);
  const submit = () => { createCharacter(); navigate('/temple/foundation'); };
  return (
    <main className="onboarding-page">
      <header className="onboarding-header"><p className="eyebrow">Fundação · 1 de 3</p><h1>Crie quem atravessará o Templo.</h1><p>As escolhas definem sua introdução e aparência. Nenhuma classe bloqueia outros caminhos.</p></header>
      <div className="onboarding-grid">
        <Card title="Identidade" eyebrow="Nome e título">
          <label className="field"><span>Nome do personagem</span><input value={draft.name} onChange={(event) => updateDraft({ name: event.target.value })} placeholder="Como deseja ser chamado?" /></label>
          <label className="field"><span>Título narrativo</span><input value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} /></label>
          <div className="avatar-builder" aria-label="Prévia visual do personagem"><div className="avatar-builder__head" /><div className="avatar-builder__body"><Palette /></div><small>Personalização visual expandida nas próximas sprints</small></div>
        </Card>
        <Card title="Origem" eyebrow="Introdução narrativa">
          <div className="option-grid option-grid--2">
            {origins.map((origin) => <button key={origin.id} type="button" className={`choice-card ${draft.origin === origin.id ? 'choice-card--selected' : ''}`} onClick={() => updateDraft({ origin: origin.id })}><UserRound size={18}/><strong>{origin.label}</strong><span>{origin.description}</span></button>)}
          </div>
        </Card>
        <Card title="Classe inicial" eyebrow="Caminho de gameplay" className="onboarding-grid__wide">
          <div className="option-grid option-grid--3">
            {classes.map((item) => <button key={item.id} type="button" className={`choice-card ${draft.primaryClass === item.id ? 'choice-card--selected' : ''}`} onClick={() => updateDraft({ primaryClass: item.id })}><strong>{item.label}</strong><span>{item.description}</span></button>)}
          </div>
        </Card>
      </div>
      <div className="onboarding-actions"><Button onClick={submit}>Continuar para o Templo <ArrowRight size={18}/></Button></div>
    </main>
  );
}
