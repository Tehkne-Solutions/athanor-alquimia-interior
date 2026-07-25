import { ArrowRight, Layers3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { SymbolicChain } from '../components/SymbolicChain';
import { useAthanorStore } from '../state/useAthanorStore';

export function ChainPage() {
  const navigate = useNavigate();
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  return (
    <div className="page page--codex">
      <PageHeader eyebrow="Proveniência da missão" title="Da fonte ao item" description="A Bíblia inicia a cadeia. As demais camadas são tradições identificadas, comparações temáticas ou criações do Athanor." action={<span className="local-badge"><Layers3 size={16}/> cadeia v1</span>} />
      <Card><SymbolicChain enabledLayers={enabledLayers}/></Card>
      <div className="content-grid">
        <Card eyebrow="Regra editorial" title="Cada seta tem sua própria origem"><p>Hod, Aleph, Xun e O Mago não são apresentados como partes de Provérbios. Eles cumprem funções específicas e podem ser substituídos por equivalentes autorais.</p></Card>
        <Card eyebrow="Camadas ativas" title={`${enabledLayers.length} de 4`}><ul className="simple-list"><li>Sefer Yetzirah: {enabledLayers.includes('sefer') ? 'ativo' : 'fallback autoral'}</li><li>Cabala: {enabledLayers.includes('kabbalah') ? 'ativa' : 'fallback autoral'}</li><li>I Ching: {enabledLayers.includes('iching') ? 'ativo' : 'fallback autoral'}</li><li>Tarot: {enabledLayers.includes('tarot') ? 'ativo' : 'fallback autoral'}</li></ul></Card>
      </div>
      <div className="mission-actions"><Button variant="ghost" onClick={() => navigate('/mission/word-before-response/classification')}>Rever classificação</Button><Button onClick={() => navigate('/crafting/clear-word-lamp')}>Entrar na Forja <ArrowRight size={18}/></Button></div>
    </div>
  );
}
