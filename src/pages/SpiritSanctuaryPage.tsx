import { BookOpenText, CheckCircle2, Circle, GitBranch, LockKeyhole, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { spiritCenterNodes } from '../content/spiritCenter';
import { spiritCouncilNodes } from '../content/spiritCouncil';
import { spiritDecisionNodes } from '../content/spiritDecision';
import { spiritFoundationBiblicalUnit, spiritFoundationNodes, spiritSynthesisDimensions } from '../content/spiritFoundation';
import { spiritOrbNodes } from '../content/spiritOrb';
import { spiritReturnNodes } from '../content/spiritReturn';
import { spiritThreadNodes } from '../content/spiritThread';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthChapterStore } from '../state/useEarthChapterStore';
import { useSpiritCenterStore } from '../state/useSpiritCenterStore';
import { useSpiritChapterStore } from '../state/useSpiritChapterStore';
import { useSpiritCouncilStore } from '../state/useSpiritCouncilStore';
import { useSpiritDecisionStore } from '../state/useSpiritDecisionStore';
import { useSpiritOrbStore } from '../state/useSpiritOrbStore';
import { useSpiritReturnStore } from '../state/useSpiritReturnStore';
import { useSpiritThreadStore } from '../state/useSpiritThreadStore';

const allSpiritNodes = [...spiritFoundationNodes, ...spiritThreadNodes, ...spiritCenterNodes, ...spiritCouncilNodes, ...spiritDecisionNodes, ...spiritReturnNodes, ...spiritOrbNodes];
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
  const rawThread = useSpiritThreadStore((state) => state.progress);
  const rawCenter = useSpiritCenterStore((state) => state.progress);
  const rawCouncil = useSpiritCouncilStore((state) => state.progress);
  const rawDecision = useSpiritDecisionStore((state) => state.progress);
  const rawReturn = useSpiritReturnStore((state) => state.progress);
  const rawOrb = useSpiritOrbStore((state) => state.progress);
  const rawChapter = useSpiritChapterStore((state) => state.progress);

  const sourceEarthCycleId = earthChapter?.cycleId ?? earthChapter?.completedAt;
  const thread = sourceEarthCycleId && rawThread?.sourceEarthCycleId === sourceEarthCycleId ? rawThread : undefined;
  const threadCompleted = thread?.status === 'completed' && thread.possibleSynthesisThreadCreated;
  const sourceThreadId = threadCompleted && thread ? thread.completedAt ?? `${thread.sourceEarthCycleId}:possible-synthesis-thread` : undefined;
  const center = sourceThreadId && rawCenter?.sourceThreadId === sourceThreadId ? rawCenter : undefined;
  const centerCompleted = center?.status === 'completed' && center.provisionalCenterKnotCreated;
  const sourceCenterId = centerCompleted && center ? center.completedAt ?? `${center.sourceThreadId}:provisional-center-knot` : undefined;
  const council = sourceCenterId && rawCouncil?.sourceCenterId === sourceCenterId ? rawCouncil : undefined;
  const councilCompleted = council?.status === 'completed' && council.openCouncilSealCreated;
  const sourceCouncilId = councilCompleted && council ? council.completedAt ?? `${council.sourceCenterId}:open-council-seal` : undefined;
  const decision = sourceCouncilId && rawDecision?.sourceCouncilId === sourceCouncilId ? rawDecision : undefined;
  const decisionCompleted = decision?.status === 'completed' && decision.revisableDecisionMarkCreated;
  const sourceDecisionId = decisionCompleted && decision ? decision.completedAt ?? `${decision.sourceCouncilId}:revisable-decision-mark` : undefined;
  const spiritReturn = sourceDecisionId && rawReturn?.sourceDecisionId === sourceDecisionId ? rawReturn : undefined;
  const returnCompleted = spiritReturn?.status === 'completed' && spiritReturn.possibleReturnKeyCreated;
  const sourceReturnKeyId = returnCompleted && spiritReturn ? spiritReturn.completedAt ?? `${spiritReturn.sourceDecisionId}:possible-return-key` : undefined;
  const orb = sourceReturnKeyId && rawOrb?.sourceReturnKeyId === sourceReturnKeyId ? rawOrb : undefined;
  const orbCreated = Boolean(orb?.orbCreated);
  const orbIntegrated = orb?.status === 'integrated';
  const sourceOrbId = orb?.craftedAt ?? (orb ? `${orb.sourceReturnKeyId}:orb` : undefined);
  const chapter = sourceOrbId && rawChapter?.sourceOrbId === sourceOrbId ? rawChapter : undefined;
  const chapterCompleted = chapter?.status === 'completed';
  const available = Boolean(earthChapter?.status === 'completed' || (sanctuary && sanctuary.status !== 'dormant' && sanctuary.status !== 'hidden'));

  if (!available) {
    return <div className="page page--spirit"><PageHeader eyebrow="Capítulo do Espírito" title="O Santuário ainda está adormecido." description="Conclua a revisão geral da Terra. O Santuário não é aberto apenas pela criação ou pelo posicionamento da Pedra."/><Card title="Caminho ainda fechado" eyebrow="Dependência da jornada"><div className="spirit-lock"><LockKeyhole/><p>Integre e posicione a Pedra e escolha o destino das cinco práticas da Terra.</p></div><Button onClick={() => navigate('/review/earth-chapter')}>Revisar o capítulo da Terra</Button></Card></div>;
  }

  const nodes = chainNodeIds
    .map((id) => allSpiritNodes.find((node) => node.id === id))
    .filter((node): node is SymbolicNode => Boolean(node))
    .map((node) => resolveNode(node, enabledLayers));

  const heroTitle = chapterCompleted
    ? 'Santuário restaurado e Nova Obra aberta'
    : orb?.positioned
      ? 'Orbe posicionado e revisão geral disponível'
      : orbIntegrated
        ? 'Orbe integrado'
        : orbCreated
          ? 'Orbe criado'
          : returnCompleted
            ? 'Cinco componentes reunidos'
            : threadCompleted
              ? 'O percurso do Espírito está em andamento'
              : 'Fundação disponível';
  const heroDescription = chapterCompleted
    ? 'O primeiro percurso elemental foi registrado sem apagar partes, itens ou ciclos anteriores.'
    : orb?.positioned
      ? 'O item está pronto para a revisão das cinco práticas e para o fechamento do primeiro percurso.'
      : orbIntegrated
        ? 'O item ainda precisa ser posicionado antes do encerramento do capítulo.'
        : orbCreated
          ? 'A fórmula existe, mas ainda exige revisão explícita.'
          : 'As práticas avançam sem pontuação de coerência, promessa de completude ou ação obrigatória.';

  return <div className="page page--spirit"><PageHeader eyebrow={chapterCompleted ? 'Santuário restaurado' : 'Santuário do Espírito'} title={chapterCompleted ? 'O primeiro percurso foi concluído sem fechar o Templo.' : 'As partes podem ser vistas juntas sem perder suas diferenças.'} description="O quinto elemento trabalha síntese entre palavra, emoção, impulso, corpo e ação. Não produz diagnóstico, leitura oculta ou previsão."/><div className="spirit-foundation-grid">
    <Card className="spirit-hero-card"><div className="spirit-hero-symbol" aria-hidden="true"><Sparkles/></div><div><p className="eyebrow">Estado do Santuário</p><h2>{heroTitle}</h2><p>{heroDescription}</p></div></Card>
    <Card title={spiritFoundationBiblicalUnit.title} eyebrow={spiritFoundationBiblicalUnit.reference}><blockquote>{spiritFoundationBiblicalUnit.principle}</blockquote><p>{spiritFoundationBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia permanece como núcleo. Sefer, Cabala, I Ching e Tarot aparecem apenas como camadas opcionais e identificadas.</span></div></Card>
    <SpiritMissionCard title="O Fio que Reúne" eyebrow="Primeira missão" completed={Boolean(threadCompleted)} active={Boolean(thread)} route="/mission/thread-that-gathers" component="Fio da Síntese Possível"/>
    {threadCompleted && <SpiritMissionCard title="O Centro que Não Apaga as Partes" eyebrow="Segunda missão" completed={Boolean(centerCompleted)} active={Boolean(center)} route="/mission/center-without-erasing-parts" component="Nó do Centro Provisório" icon="branch"/>}
    {centerCompleted && <SpiritMissionCard title="O Conselho das Partes" eyebrow="Terceira missão" completed={Boolean(councilCompleted)} active={Boolean(council)} route="/mission/council-of-parts" component="Selo do Conselho Aberto"/>}
    {councilCompleted && <SpiritMissionCard title="A Decisão que Permanece Aberta" eyebrow="Quarta missão" completed={Boolean(decisionCompleted)} active={Boolean(decision)} route="/mission/decision-that-remains-open" component="Marca da Decisão Revisável" icon="branch"/>}
    {decisionCompleted && <SpiritMissionCard title="O Retorno que Não Condena" eyebrow="Quinta missão" completed={Boolean(returnCompleted)} active={Boolean(spiritReturn)} route="/mission/return-without-condemnation" component="Chave do Retorno Possível" icon="return"/>}
    {returnCompleted && <Card title="Orbe da Integração Possível" eyebrow="Crafting do Espírito"><div className="spirit-mission-preview">{orbIntegrated ? <CheckCircle2/> : <Circle/>}<div><strong>{orb?.positioned ? 'Orbe integrado e posicionado' : orbIntegrated ? 'Orbe integrado' : orbCreated ? 'Orbe criado e aguardando revisão' : 'Cinco componentes disponíveis'}</strong><p>O item reúne as práticas sem representar completude, pureza ou iluminação.</p></div></div><Button onClick={() => navigate('/crafting/possible-integration-orb')}>{orbIntegrated ? 'Abrir o Orbe' : orb ? 'Continuar a tecelagem' : 'Iniciar a tecelagem'}</Button></Card>}
    {orb?.positioned && !chapterCompleted && <Card title="Encerramento do Espírito" eyebrow="Revisão geral disponível"><div className="safety-summary"><ShieldCheck/><p>Escolha o destino das cinco práticas. Preservar, repousar e arquivar têm o mesmo valor.</p></div><Button onClick={() => navigate('/review/spirit-chapter')}>Revisar o capítulo do Espírito</Button></Card>}
    {chapterCompleted && <Card title="Nova Obra" eyebrow="Modo contínuo"><div className="spirit-mission-preview"><Sparkles/><div><strong>Novos pontos sem apagar ciclos</strong><p>Revisite Palavra, Água, Fogo, Terra ou Espírito; somente observe ou registre repouso.</p></div></div><Button onClick={() => navigate('/temple/new-work')}>Abrir a Nova Obra</Button></Card>}
    <Card title="Cinco dimensões" eyebrow="Sem pontuação de coerência"><div className="spirit-dimension-grid">{spiritSynthesisDimensions.map((dimension) => <article key={dimension.id}><strong>{dimension.label}</strong><p>{dimension.description}</p></article>)}</div></Card>
    <Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="spirit-chain-grid">{nodes.map((node) => <article key={node.id} className="spirit-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card>
    <Card title="Limites do Santuário" eyebrow="Segurança"><div className="safety-summary"><ShieldCheck/><p>Integração não significa pureza, completude ou ausência de conflito. Concluir o percurso não encerra o Templo nem cria obrigação de começar outro.</p></div><div className="spirit-actions"><Button variant="secondary" onClick={() => navigate('/temple/garden')}>Visitar o Jardim restaurado</Button><Button variant="ghost" onClick={() => navigate('/safety?source=spirit')}>Abrir apoio direto</Button></div></Card>
  </div></div>;
}

interface SpiritMissionCardProps {
  title: string;
  eyebrow: string;
  completed: boolean;
  active: boolean;
  route: string;
  component: string;
  icon?: 'branch' | 'return';
}

function SpiritMissionCard({ title, eyebrow, completed, active, route, component, icon }: SpiritMissionCardProps) {
  const navigate = useNavigate();
  const Icon = icon === 'branch' ? GitBranch : icon === 'return' ? RotateCcw : Circle;
  return <Card title={title} eyebrow={eyebrow}><div className="spirit-mission-preview">{completed ? <CheckCircle2/> : <Icon/>}<div><strong>{completed ? `${component} criado` : 'Prática disponível'}</strong><p>{completed ? 'O componente permanece disponível sem definir identidade ou condição espiritual.' : 'A prática pode ser iniciada, retomada, pausada ou recusada.'}</p></div></div><Button onClick={() => navigate(route)}>{completed ? 'Revisar componente' : active ? 'Continuar missão' : 'Iniciar missão'}</Button></Card>;
}
