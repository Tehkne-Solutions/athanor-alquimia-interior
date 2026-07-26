import { BookOpenText, CheckCircle2, Circle, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { spiritFoundationBiblicalUnit, spiritFoundationNodes, spiritSynthesisDimensions } from '../content/spiritFoundation';
import { spiritThreadNodes } from '../content/spiritThread';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthChapterStore } from '../state/useEarthChapterStore';
import { useSpiritThreadStore } from '../state/useSpiritThreadStore';

const allSpiritNodes = [...spiritFoundationNodes, ...spiritThreadNodes];
const chainNodeIds = ['spirit_keter_v1', 'spirit_ruach_v1', 'spirit_qian_v1', 'spirit_world_v1'];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return allSpiritNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function SpiritSanctuaryPage() {
  const navigate = useNavigate();
  const sanctuary = useAthanorStore((state) => state.temple?.rooms.find((room) => room.roomId === 'central-tree'));
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const earthChapter = useEarthChapterStore((state) => state.progress);
  const rawThreadProgress = useSpiritThreadStore((state) => state.progress);
  const sourceEarthCycleId = earthChapter?.cycleId ?? earthChapter?.completedAt;
  const threadProgress = sourceEarthCycleId && rawThreadProgress?.sourceEarthCycleId === sourceEarthCycleId ? rawThreadProgress : undefined;
  const available = Boolean(earthChapter?.status === 'completed' || (sanctuary && sanctuary.status !== 'dormant' && sanctuary.status !== 'hidden'));

  if (!available) {
    return <div className="page page--spirit"><PageHeader eyebrow="Capítulo do Espírito" title="O Santuário ainda está adormecido." description="Conclua a revisão geral da Terra. O Santuário não é aberto apenas pela criação ou pelo posicionamento da Pedra."/><Card title="Caminho ainda fechado" eyebrow="Dependência da jornada"><div className="spirit-lock"><LockKeyhole/><p>Integre e posicione a Pedra e escolha o destino das cinco práticas da Terra.</p></div><Button onClick={() => navigate('/review/earth-chapter')}>Revisar o capítulo da Terra</Button></Card></div>;
  }

  const nodes = chainNodeIds
    .map((id) => allSpiritNodes.find((node) => node.id === id))
    .filter((node): node is SymbolicNode => Boolean(node))
    .map((node) => resolveNode(node, enabledLayers));
  const missionLabel = threadProgress?.status === 'completed'
    ? 'Revisar o Fio criado'
    : threadProgress
      ? 'Continuar O Fio que Reúne'
      : 'Iniciar O Fio que Reúne';

  return <div className="page page--spirit"><PageHeader eyebrow="Santuário do Espírito" title={threadProgress?.status === 'completed' ? 'O primeiro Fio ocupa o Santuário sem medir coerência.' : 'As partes podem ser vistas juntas sem perder suas diferenças.'} description="O quinto elemento trabalha síntese entre palavra, emoção, impulso, corpo e ação. Não produz diagnóstico, leitura oculta ou previsão."/><div className="spirit-foundation-grid">
    <Card className="spirit-hero-card"><div className="spirit-hero-symbol" aria-hidden="true"><Sparkles/></div><div><p className="eyebrow">Estado do Santuário</p><h2>{threadProgress?.status === 'completed' ? 'Primeiro componente criado' : threadProgress ? 'Missão em andamento' : 'Fundação disponível'}</h2><p>{threadProgress?.status === 'completed' ? 'O Fio registra uma prática concluída, inclusive por pausa ou recusa, sem afirmar completude espiritual.' : threadProgress ? 'A primeira missão pode ser retomada sem streak, prazo ou perda de progresso.' : 'O primeiro ciclo da Terra foi registrado e a missão funcional do Espírito está disponível.'}</p></div></Card>
    <Card title={spiritFoundationBiblicalUnit.title} eyebrow={spiritFoundationBiblicalUnit.reference}><blockquote>{spiritFoundationBiblicalUnit.principle}</blockquote><p>{spiritFoundationBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia permanece como núcleo. Sefer, Cabala, I Ching e Tarot aparecem apenas como camadas opcionais e identificadas.</span></div></Card>
    <Card title="O Fio que Reúne" eyebrow="Primeira missão do Espírito"><div className="spirit-mission-preview">{threadProgress?.status === 'completed' ? <CheckCircle2/> : <Circle/>}<div><strong>{threadProgress?.status === 'completed' ? 'Fio da Síntese Possível criado' : 'Síntese sem apagamento'}</strong><p>{threadProgress?.status === 'completed' ? 'O componente não representa coerência, iluminação ou ausência de conflito.' : 'Distinguir e reunir cinco dimensões, mantendo desconhecimento, pausa, recusa e não agir.'}</p></div></div><Button onClick={() => navigate('/mission/thread-that-gathers')}>{missionLabel}</Button></Card>
    <Card title="Cinco dimensões" eyebrow="Sem pontuação de coerência"><div className="spirit-dimension-grid">{spiritSynthesisDimensions.map((dimension) => <article key={dimension.id}><strong>{dimension.label}</strong><p>{dimension.description}</p></article>)}</div></Card>
    {threadProgress?.status === 'completed' && <Card title="Fio da Síntese Possível" eyebrow="Primeiro componente"><div className="spirit-mission-preview"><Sparkles/><div><strong>Componente local criado</strong><p>Registra somente a conclusão desta prática e não interpreta identidade, saúde ou condição espiritual.</p></div></div></Card>}
    <Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="spirit-chain-grid">{nodes.map((node) => <article key={node.id} className="spirit-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card>
    <Card title="Limites do Santuário" eyebrow="Segurança"><div className="safety-summary"><ShieldCheck/><p>Integração não significa pureza, completude, iluminação ou ausência de conflito. Toda dimensão pode ser recusada, pausada ou marcada como desconhecida.</p></div><div className="spirit-actions"><Button variant="secondary" onClick={() => navigate('/temple/garden')}>Visitar o Jardim restaurado</Button><Button variant="ghost" onClick={() => navigate('/safety?source=spirit')}>Abrir apoio direto</Button></div></Card>
  </div></div>;
}
