import { BookOpenText, CheckCircle2, Circle, GitBranch, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { spiritCenterNodes } from '../content/spiritCenter';
import { spiritCouncilNodes } from '../content/spiritCouncil';
import { spiritDecisionNodes } from '../content/spiritDecision';
import { spiritFoundationBiblicalUnit, spiritFoundationNodes, spiritSynthesisDimensions } from '../content/spiritFoundation';
import { spiritThreadNodes } from '../content/spiritThread';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthChapterStore } from '../state/useEarthChapterStore';
import { useSpiritCenterStore } from '../state/useSpiritCenterStore';
import { useSpiritCouncilStore } from '../state/useSpiritCouncilStore';
import { useSpiritDecisionStore } from '../state/useSpiritDecisionStore';
import { useSpiritThreadStore } from '../state/useSpiritThreadStore';

const allSpiritNodes = [...spiritFoundationNodes, ...spiritThreadNodes, ...spiritCenterNodes, ...spiritCouncilNodes, ...spiritDecisionNodes];
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
  const rawCenterProgress = useSpiritCenterStore((state) => state.progress);
  const rawCouncilProgress = useSpiritCouncilStore((state) => state.progress);
  const rawDecisionProgress = useSpiritDecisionStore((state) => state.progress);
  const sourceEarthCycleId = earthChapter?.cycleId ?? earthChapter?.completedAt;
  const threadProgress = sourceEarthCycleId && rawThreadProgress?.sourceEarthCycleId === sourceEarthCycleId ? rawThreadProgress : undefined;
  const threadCompleted = threadProgress?.status === 'completed' && threadProgress.possibleSynthesisThreadCreated;
  const sourceThreadId = threadCompleted && threadProgress ? threadProgress.completedAt ?? `${threadProgress.sourceEarthCycleId}:possible-synthesis-thread` : undefined;
  const centerProgress = sourceThreadId && rawCenterProgress?.sourceThreadId === sourceThreadId ? rawCenterProgress : undefined;
  const centerCompleted = centerProgress?.status === 'completed' && centerProgress.provisionalCenterKnotCreated;
  const sourceCenterId = centerCompleted && centerProgress ? centerProgress.completedAt ?? `${centerProgress.sourceThreadId}:provisional-center-knot` : undefined;
  const councilProgress = sourceCenterId && rawCouncilProgress?.sourceCenterId === sourceCenterId ? rawCouncilProgress : undefined;
  const councilCompleted = councilProgress?.status === 'completed' && councilProgress.openCouncilSealCreated;
  const sourceCouncilId = councilCompleted && councilProgress ? councilProgress.completedAt ?? `${councilProgress.sourceCenterId}:open-council-seal` : undefined;
  const decisionProgress = sourceCouncilId && rawDecisionProgress?.sourceCouncilId === sourceCouncilId ? rawDecisionProgress : undefined;
  const decisionCompleted = decisionProgress?.status === 'completed' && decisionProgress.revisableDecisionMarkCreated;
  const available = Boolean(earthChapter?.status === 'completed' || (sanctuary && sanctuary.status !== 'dormant' && sanctuary.status !== 'hidden'));

  if (!available) {
    return <div className="page page--spirit"><PageHeader eyebrow="Capítulo do Espírito" title="O Santuário ainda está adormecido." description="Conclua a revisão geral da Terra. O Santuário não é aberto apenas pela criação ou pelo posicionamento da Pedra."/><Card title="Caminho ainda fechado" eyebrow="Dependência da jornada"><div className="spirit-lock"><LockKeyhole/><p>Integre e posicione a Pedra e escolha o destino das cinco práticas da Terra.</p></div><Button onClick={() => navigate('/review/earth-chapter')}>Revisar o capítulo da Terra</Button></Card></div>;
  }

  const nodes = chainNodeIds.map((id) => allSpiritNodes.find((node) => node.id === id)).filter((node): node is SymbolicNode => Boolean(node)).map((node) => resolveNode(node, enabledLayers));
  const heroState = decisionCompleted
    ? { title: 'Quarto componente criado', description: 'A Marca preserva decisões limitadas, discordâncias e o direito de retirar ou não assumir compromisso.' }
    : decisionProgress
      ? { title: 'Quarta missão em andamento', description: 'A decisão fictícia pode ser confirmada, reduzida, alterada, retirada ou recusada.' }
      : councilCompleted
        ? { title: 'Terceiro componente criado', description: 'O Selo preserva fala, passagem, desconhecimento e discordância e permite revisar uma decisão.' }
        : councilProgress
          ? { title: 'Terceira missão em andamento', description: 'O conselho pode ser retomado sem votação, prazo ou perda de progresso.' }
          : centerCompleted
            ? { title: 'Segundo componente criado', description: 'O Nó preserva uma centralidade temporária, vazia ou recusada e permite abrir o conselho.' }
            : centerProgress
              ? { title: 'Segunda missão em andamento', description: 'O centro provisório pode ser alternado, removido ou recusado sem perder o Fio.' }
              : threadCompleted
                ? { title: 'Primeiro componente criado', description: 'O Fio está disponível e a segunda missão pode começar sem exigir coerência entre as partes.' }
                : threadProgress
                  ? { title: 'Primeira missão em andamento', description: 'A missão pode ser retomada sem streak, prazo ou perda de progresso.' }
                  : { title: 'Fundação disponível', description: 'O primeiro ciclo da Terra foi registrado e a primeira missão do Espírito está disponível.' };

  return <div className="page page--spirit"><PageHeader eyebrow="Santuário do Espírito" title={decisionCompleted ? 'A decisão permaneceu aberta à revisão.' : councilCompleted ? 'O conselho pode revisar uma decisão provisória.' : centerCompleted ? 'O centro provisório pode abrir um conselho.' : threadCompleted ? 'O Fio pode receber um centro provisório.' : 'As partes podem ser vistas juntas sem perder suas diferenças.'} description="O quinto elemento trabalha síntese entre palavra, emoção, impulso, corpo e ação. Não produz diagnóstico, leitura oculta ou previsão."/><div className="spirit-foundation-grid">
    <Card className="spirit-hero-card"><div className="spirit-hero-symbol" aria-hidden="true"><Sparkles/></div><div><p className="eyebrow">Estado do Santuário</p><h2>{heroState.title}</h2><p>{heroState.description}</p></div></Card>
    <Card title={spiritFoundationBiblicalUnit.title} eyebrow={spiritFoundationBiblicalUnit.reference}><blockquote>{spiritFoundationBiblicalUnit.principle}</blockquote><p>{spiritFoundationBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia permanece como núcleo. Sefer, Cabala, I Ching e Tarot aparecem apenas como camadas opcionais e identificadas.</span></div></Card>
    <Card title="O Fio que Reúne" eyebrow="Primeira missão do Espírito"><div className="spirit-mission-preview">{threadCompleted ? <CheckCircle2/> : <Circle/>}<div><strong>{threadCompleted ? 'Fio da Síntese Possível criado' : 'Síntese sem apagamento'}</strong><p>{threadCompleted ? 'O componente não representa coerência, iluminação ou ausência de conflito.' : 'Distinguir e reunir cinco dimensões, mantendo desconhecimento, pausa, recusa e não agir.'}</p></div></div><Button onClick={() => navigate('/mission/thread-that-gathers')}>{threadCompleted ? 'Revisar o Fio criado' : threadProgress ? 'Continuar O Fio que Reúne' : 'Iniciar O Fio que Reúne'}</Button></Card>
    {threadCompleted && <Card title="O Centro que Não Apaga as Partes" eyebrow="Segunda missão do Espírito"><div className="spirit-mission-preview">{centerCompleted ? <CheckCircle2/> : <GitBranch/>}<div><strong>{centerCompleted ? 'Nó do Centro Provisório criado' : 'Centralidade temporária e revisável'}</strong><p>{centerCompleted ? 'O componente preserva o histórico sem tornar uma dimensão superior.' : 'Escolher, alternar ou recusar um centro sem apagar o conjunto.'}</p></div></div><Button onClick={() => navigate('/mission/center-without-erasing-parts')}>{centerCompleted ? 'Revisar o Nó criado' : centerProgress ? 'Continuar a missão' : 'Iniciar a segunda missão'}</Button></Card>}
    {centerCompleted && <Card title="O Conselho das Partes" eyebrow="Terceira missão do Espírito"><div className="spirit-mission-preview">{councilCompleted ? <CheckCircle2/> : <Circle/>}<div><strong>{councilCompleted ? 'Selo do Conselho Aberto criado' : 'Escuta sem maioria obrigatória'}</strong><p>{councilCompleted ? 'O componente preserva discordâncias e não converte quantidade de vozes em verdade.' : 'Permitir que cada parte fale, passe ou permaneça desconhecida.'}</p></div></div><Button onClick={() => navigate('/mission/council-of-parts')}>{councilCompleted ? 'Revisar o Selo criado' : councilProgress ? 'Continuar o conselho' : 'Iniciar a terceira missão'}</Button></Card>}
    {councilCompleted && <Card title="A Decisão que Permanece Aberta" eyebrow="Quarta missão do Espírito"><div className="spirit-mission-preview">{decisionCompleted ? <CheckCircle2/> : <GitBranch/>}<div><strong>{decisionCompleted ? 'Marca da Decisão Revisável criada' : 'Decisão sem promessa ou obediência'}</strong><p>{decisionCompleted ? 'O componente preserva revisão, discordância, retirada e ausência de compromisso.' : 'Confirmar, reduzir, alterar, retirar ou não assumir uma decisão fictícia.'}</p></div></div><Button onClick={() => navigate('/mission/decision-that-remains-open')}>{decisionCompleted ? 'Revisar a Marca criada' : decisionProgress ? 'Continuar a decisão' : 'Iniciar a quarta missão'}</Button></Card>}
    <Card title="Cinco dimensões" eyebrow="Sem pontuação de coerência"><div className="spirit-dimension-grid">{spiritSynthesisDimensions.map((dimension) => <article key={dimension.id}><strong>{dimension.label}</strong><p>{dimension.description}</p></article>)}</div></Card>
    {threadCompleted && <Card title="Instrumentos do Espírito" eyebrow={decisionCompleted ? 'Quatro componentes' : councilCompleted ? 'Três componentes' : centerCompleted ? 'Dois componentes' : 'Primeiro componente'}><div className="spirit-mission-preview"><Sparkles/><div><strong>Fio da Síntese Possível</strong><p>Registra a conclusão da primeira prática sem interpretar identidade ou condição espiritual.</p></div></div>{centerCompleted && <div className="spirit-mission-preview"><GitBranch/><div><strong>Nó do Centro Provisório</strong><p>Registra foco temporário, alternância, ausência de centro ou recusa.</p></div></div>}{councilCompleted && <div className="spirit-mission-preview"><Circle/><div><strong>Selo do Conselho Aberto</strong><p>Registra participação, discordância e decisão provisória, adiada ou ausente.</p></div></div>}{decisionCompleted && <div className="spirit-mission-preview"><GitBranch/><div><strong>Marca da Decisão Revisável</strong><p>Registra confirmação limitada, redução, alteração, retirada ou ausência de compromisso.</p></div></div>}</Card>}
    <Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="spirit-chain-grid">{nodes.map((node) => <article key={node.id} className="spirit-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card>
    <Card title="Limites do Santuário" eyebrow="Segurança"><div className="safety-summary"><ShieldCheck/><p>Integração não significa pureza, completude, iluminação ou ausência de conflito. Nenhuma decisão é promessa, previsão, obediência ou direção espiritual.</p></div><div className="spirit-actions"><Button variant="secondary" onClick={() => navigate('/temple/garden')}>Visitar o Jardim restaurado</Button><Button variant="ghost" onClick={() => navigate('/safety?source=spirit')}>Abrir apoio direto</Button></div></Card>
  </div></div>;
}
