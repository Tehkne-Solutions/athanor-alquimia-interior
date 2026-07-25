import { ArrowRight, Check, Hammer, LampDesk } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';

const actions = [
  'Escrever uma resposta e revisar antes de enviar',
  'Pedir mais informações antes de concluir',
  'Aguardar um período definido antes de responder',
  'Organizar o primeiro passo de uma tarefa',
  'Escrever sem enviar e revisar depois'
];

export function CraftingPage() {
  const navigate = useNavigate();
  const mission = useAthanorStore((state) => state.activeMission);
  const setMissionAction = useAthanorStore((state) => state.setMissionAction);
  const craftLamp = useAthanorStore((state) => state.craftLamp);
  const [customAction, setCustomAction] = useState('');
  const selectedAction = mission?.action ?? '';
  const selectAction = (action: string) => setMissionAction(action);
  const craft = () => { craftLamp(); navigate('/items/clear-word-lamp'); };
  return (
    <div className="page page--forge">
      <PageHeader eyebrow="Forja dos Elementos · Receita V1" title="Lâmpada da Palavra Clara" description="Um item do Athanor só é concluído quando seu significado está vinculado a uma ação concreta e revisável." />
      <div className="crafting-layout">
        <Card title="Componentes reunidos" eyebrow="Receita guiada"><div className="crafting-grid">{['Princípio bíblico','Prudência','Hod ou Câmara da Linguagem','Ar','Aleph ou Símbolo do Sopro','Xun ou Movimento da Constância','O Mago ou Artesão','Ação concreta'].map((component, index) => <div className={`crafting-slot ${index === 7 && !selectedAction ? 'crafting-slot--empty' : ''}`} key={component}><span>{index + 1}</span><strong>{index === 7 ? selectedAction || 'Escolha uma ação' : component}</strong>{index < 7 && <Check size={16}/>}</div>)}</div></Card>
        <Card title="Vincule uma ação" eyebrow="Obrigatória para ativar o item"><div className="action-options">{actions.map((action) => <button type="button" key={action} className={`action-option ${selectedAction === action ? 'action-option--selected' : ''}`} onClick={() => selectAction(action)}><span className="action-option__check">{selectedAction === action && <Check size={15}/>}</span><span>{action}</span></button>)}</div><label className="field"><span>Ou escreva uma ação própria</span><textarea value={customAction} onChange={(event) => setCustomAction(event.target.value)} placeholder="Uma ação que depende de você, possui limite e pode ser revisada."/><Button type="button" variant="secondary" disabled={!customAction.trim()} onClick={() => selectAction(customAction.trim())}>Usar esta ação</Button></label></Card>
        <Card title="Prévia do artefato" eyebrow="Instrumento de Jornada" className="item-preview-card"><div className="artifact-preview"><div className="artifact-preview__lamp"><LampDesk size={44}/></div><div><strong>Lâmpada da Palavra Clara</strong><p>Ilumina missões de comunicação, destaca proveniência e registra decisões aguardando revisão.</p></div></div><ul className="restriction-list"><li>Não revela verdades ocultas</li><li>Não prevê acontecimentos</li><li>Não confirma intenções de terceiros</li></ul></Card>
      </div>
      <div className="mission-actions"><Button variant="ghost" onClick={() => navigate('/mission/word-before-response/chain')}>Voltar à cadeia</Button><Button disabled={!selectedAction} onClick={craft}><Hammer size={18}/> Forjar Lâmpada <ArrowRight size={18}/></Button></div>
    </div>
  );
}
