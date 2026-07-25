import { BookOpenText, GitBranch, Library, ScrollText } from 'lucide-react';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import { SymbolicChain } from '../components/SymbolicChain';
import { biblicalUnits } from '../content/seed';
import { useAthanorStore } from '../state/useAthanorStore';

export function CodexPage() {
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  return (
    <div className="page page--codex">
      <PageHeader eyebrow="Fontes e proveniência" title="Codex" description="O Codex separa fonte, contexto, tradição, comparação e criação de gameplay." />
      <div className="codex-stats"><div><BookOpenText/><strong>{biblicalUnits.length}</strong><span>unidades bíblicas seed</span></div><div><GitBranch/><strong>8</strong><span>etapas da cadeia</span></div><div><ScrollText/><strong>{enabledLayers.length}</strong><span>camadas ativas</span></div><div><Library/><strong>1</strong><span>missão publicável</span></div></div>
      <Card title="Unidades de Provérbios" eyebrow="Bíblia Core Seed"><div className="codex-list">{biblicalUnits.map((unit) => <article key={unit.id}><div className="provenance-line"><ProvenanceBadge type="BIB"/><span>{unit.reference}</span></div><h3>{unit.title}</h3><p>{unit.principle}</p><small>{unit.context}</small></article>)}</div></Card>
      <Card title="Cadeia da Palavra Clara" eyebrow="chain_clear_word_v1"><SymbolicChain enabledLayers={enabledLayers}/></Card>
    </div>
  );
}
