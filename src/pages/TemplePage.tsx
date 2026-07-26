import { ArrowRight, BadgeCheck, BookOpenText, CheckCircle2, Clock3, CupSoda, Database, Droplets, Flame, Hammer, LampDesk, RefreshCw, Shield, ShieldCheck, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { PageHeader } from '../components/PageHeader';
import { TempleMap } from '../components/TempleMap';
import { biblicalUnits } from '../content/seed';
import { useAthanorStore } from '../state/useAthanorStore';
import { useFireBoundaryStore } from '../state/useFireBoundaryStore';
import { useFireChapterStore } from '../state/useFireChapterStore';
import { useFireCourageStore } from '../state/useFireCourageStore';
import { useFireIntervalStore } from '../state/useFireIntervalStore';
import { useFireMissionStore } from '../state/useFireMissionStore';
import { useFireShieldStore } from '../state/useFireShieldStore';
import { useFireTransformationStore } from '../state/useFireTransformationStore';
import { useWaterChaliceStore } from '../state/useWaterChaliceStore';
import { useWaterChapterStore } from '../state/useWaterChapterStore';

const workLevelLabels = { foundation: 'Fundação', first_fire: 'Primeiro Fogo', form: 'Forma', construction: 'Construção', integration: 'Integração', new_work: 'Nova Obra' } as const;

export function TemplePage() {
  const navigate = useNavigate();
  const character = useAthanorStore((state) => state.character);
  const temple = useAthanorStore((state) => state.temple);
  const inventory = useAthanorStore((state) => state.inventory);
  const mission = useAthanorStore((state) => state.activeMission);
  const waterJourney = useAthanorStore((state) => state.waterJourney);
  const reviews = useAthanorStore((state) => state.reviews ?? []);
  const chaliceProgress = useWaterChaliceStore((state) => state.progress);
  const waterChapter = useWaterChapterStore((state) => state.progress);
  const rawFireProgress = useFireMissionStore((state) => state.progress);
  const rawIntervalProgress = useFireIntervalStore((state) => state.progress);
  const rawBoundaryProgress = useFireBoundaryStore((state) => state.progress);
  const rawCourageProgress = useFireCourageStore((state) => state.progress);
  const rawTransformationProgress = useFireTransformationStore((state) => state.progress);
  const rawShieldProgress = useFireShieldStore((state) => state.progress);
  const rawFireChapter = useFireChapterStore((state) => state.progress);
  const passage = biblicalUnits[0];

  if (!character || !temple) return null;

  const lamp = inventory.find((item) => item.id === 'item_clear_word_lamp_v1');
  const awaitingReview = lamp?.lifecycle === 'awaiting_review' || lamp?.lifecycle === 'adjusted';
  const integrated = lamp?.lifecycle === 'integrated';
  const psalmsChamber = temple.rooms.find((room) => room.roomId === 'psalms-chamber');
  const forge = temple.rooms.find((room) => room.roomId === 'forge');
  const garden = temple.rooms.find((room) => room.roomId === 'garden');
  const waterAvailable = Boolean(integrated || (psalmsChamber && psalmsChamber.status !== 'dormant' && psalmsChamber.status !== 'hidden'));
  const waterCompleted = Boolean(waterChapter && waterJourney && waterChapter.journeyStartedAt === waterJourney.startedAt && waterChapter.status === 'completed');
  const forgeAvailable = Boolean(waterCompleted || (forge && forge.status !== 'dormant' && forge.status !== 'hidden'));
  const chaliceAvailable = Boolean(chaliceProgress && waterJourney && chaliceProgress.journeyStartedAt === waterJourney.startedAt && chaliceProgress.chaliceCreated);
  const sourceWaterCycleId = waterChapter?.cycleId ?? waterChapter?.completedAt;
  const fireProgress = sourceWaterCycleId && rawFireProgress?.sourceWaterCycleId === sourceWaterCycleId ? rawFireProgress : undefined;
  const namedFlameCreated = fireProgress?.status === 'completed' && fireProgress.namedFlameCreated;
  const sourceNamedFlameId = namedFlameCreated ? fireProgress.completedAt ?? fireProgress.updatedAt : undefined;
  const intervalProgress = sourceNamedFlameId && rawIntervalProgress?.sourceNamedFlameId === sourceNamedFlameId ? rawIntervalProgress : undefined;
  const intervalEmberCreated = intervalProgress?.status === 'completed' && intervalProgress.intervalEmberCreated;
  const sourceIntervalEmberId = intervalEmberCreated ? intervalProgress.completedAt ?? `${intervalProgress.sourceNamedFlameId}:interval-ember` : undefined;
  const boundaryProgress = sourceIntervalEmberId && rawBoundaryProgress?.sourceIntervalEmberId === sourceIntervalEmberId ? rawBoundaryProgress : undefined;
  const boundaryPlateCreated = boundaryProgress?.status === 'completed' && boundaryProgress.boundaryPlateCreated;
  const sourceBoundaryPlateId = boundaryPlateCreated ? boundaryProgress.completedAt ?? `${boundaryProgress.sourceIntervalEmberId}:boundary-plate` : undefined;
  const courageProgress = sourceBoundaryPlateId && rawCourageProgress?.sourceBoundaryPlateId === sourceBoundaryPlateId ? rawCourageProgress : undefined;
  const courageMarkCreated = courageProgress?.status === 'completed' && courageProgress.proportionalCourageMarkCreated;
  const sourceCourageMarkId = courageMarkCreated ? courageProgress.completedAt ?? `${courageProgress.sourceBoundaryPlateId}:courage-mark` : undefined;
  const transformationProgress = sourceCourageMarkId && rawTransformationProgress?.sourceCourageMarkId === sourceCourageMarkId ? rawTransformationProgress : undefined;
  const transformedMetalCreated = transformationProgress?.status === 'completed' && transformationProgress.transformedMetalCreated;
  const sourceTransformedMetalId = transformedMetalCreated ? transformationProgress.completedAt ?? `${transformationProgress.sourceCourageMarkId}:transformed-metal` : undefined;
  const shieldProgress = sourceTransformedMetalId && rawShieldProgress?.sourceTransformedMetalId === sourceTransformedMetalId ? rawShieldProgress : undefined;
  const shieldCreated = Boolean(shieldProgress?.shieldCreated);
  const sourceShieldId = shieldProgress?.craftedAt ?? (shieldProgress ? `${shieldProgress.sourceTransformedMetalId}:shield` : undefined);
  const fireChapter = sourceShieldId && rawFireChapter?.sourceShieldId === sourceShieldId ? rawFireChapter : undefined;
  const fireCompleted = fireChapter?.status === 'completed';
  const gardenAvailable = Boolean(fireCompleted || (garden && garden.status !== 'dormant' && garden.status !== 'hidden'));

  const roomSelect = (roomId: string) => {
    if (roomId === 'proverbs-library') navigate('/temple/proverbs-library');
    if (roomId === 'psalms-chamber') navigate('/temple/psalms-chamber');
    if (roomId === 'forge') navigate('/temple/forge');
    if (roomId === 'garden') navigate('/temple/garden');
  };
  const missionAction = awaitingReview ? { label: 'Revisar a Lâmpada', route: '/review/clear-word-lamp', icon: RefreshCw } : integrated ? { label: 'Visitar a Biblioteca', route: '/temple/proverbs-library', icon: CheckCircle2 } : { label: mission ? 'Continuar jornada' : 'Iniciar jornada', route: '/mission/word-before-response', icon: ArrowRight };
  const MissionActionIcon = missionAction.icon;
  const waterAction = waterCompleted ? 'Visitar a Câmara restaurada' : chaliceProgress?.positioned ? 'Concluir o capítulo da Água' : waterJourney?.status === 'named' ? 'Continuar a jornada da Água' : waterJourney ? 'Continuar missão da Água' : 'Entrar na Câmara dos Salmos';
  const fireAction = fireCompleted ? 'Visitar a Forja restaurada' : shieldProgress?.positioned ? 'Concluir o capítulo do Fogo' : shieldCreated ? 'Continuar o ciclo do Escudo' : shieldProgress ? 'Continuar a Forja do Escudo' : transformedMetalCreated ? 'Forjar o Escudo do Limite Justo' : transformationProgress ? 'Continuar O que Precisa Ser Transformado' : courageMarkCreated ? 'Iniciar O que Precisa Ser Transformado' : courageProgress ? 'Continuar A Coragem Proporcional' : boundaryPlateCreated ? 'Iniciar A Coragem Proporcional' : boundaryProgress ? 'Continuar O Limite que Protege' : intervalEmberCreated ? 'Iniciar O Limite que Protege' : intervalProgress ? 'Continuar O Instante Antes do Gesto' : namedFlameCreated ? 'Iniciar O Instante Antes do Gesto' : fireProgress ? 'Continuar O Nome da Chama' : 'Iniciar O Nome da Chama';
  const fireRoute = fireCompleted ? '/temple/forge' : shieldProgress?.positioned ? '/review/fire-chapter' : transformedMetalCreated || shieldProgress ? '/crafting/just-boundary-shield' : courageMarkCreated ? '/mission/what-needs-transformation' : boundaryPlateCreated ? '/mission/proportional-courage' : intervalEmberCreated ? '/mission/limit-that-protects' : namedFlameCreated ? '/mission/before-the-gesture' : '/mission/name-the-flame';
  const activeRoomCount = temple.rooms.filter((room) => ['active', 'restored', 'available'].includes(room.status)).length;
  const componentCount = inventory.length + Number(waterJourney?.namedDropCreated) + Number(chaliceAvailable) + Number(namedFlameCreated) + Number(intervalEmberCreated) + Number(boundaryPlateCreated) + Number(courageMarkCreated) + Number(transformedMetalCreated) + Number(shieldCreated);
  const cycleCount = reviews.length + Number(waterCompleted) + Number(fireCompleted);

  return <div className="page page--temple"><PageHeader eyebrow="Átrio da Presença" title={`Bem-vindo ao Templo, ${character.name}.`} description="Seu Templo registra ciclos de gameplay, itens e revisões. Ele não mede sua condição espiritual." action={<span className="local-badge"><Database size={16}/> Dados locais</span>}/><div className="temple-dashboard">
    <Card className="hero-card"><div className="hero-card__scene"><div className={`temple-backdrop temple-backdrop--${temple.theme}`} aria-hidden="true"/><CharacterAvatar character={character}/></div><div className="hero-card__content"><p className="eyebrow">Nível da Obra</p><h2>{workLevelLabels[character.workLevel]}</h2><p>{fireCompleted ? 'O ciclo do Fogo foi registrado e o Jardim Interior foi aberto.' : shieldProgress?.positioned ? 'O Escudo está posicionado e aguarda a revisão geral do Fogo.' : shieldCreated ? 'O Escudo foi criado e aguarda revisão ou integração.' : transformedMetalCreated ? 'Os cinco componentes do Fogo estão disponíveis para crafting.' : waterCompleted ? 'O ciclo da Água foi registrado e a Forja foi aberta.' : integrated ? 'A primeira Obra foi revisada.' : 'A Biblioteca aguarda sua primeira restauração.'}</p><div className="status-row"><span><strong>{activeRoomCount}</strong> salas acessíveis</span><span><strong>{componentCount}</strong> componentes e itens</span><span><strong>{cycleCount}</strong> ciclos e revisões</span><span><strong>{temple.restorationLevel}</strong> nível do Templo</span></div></div></Card>
    <Card eyebrow="Princípio do ciclo" title={passage.title} className="principle-card"><blockquote>{passage.principle}</blockquote><p>{passage.application}</p><Button onClick={() => navigate('/temple/proverbs-library')}>Entrar na Biblioteca <ArrowRight size={18}/></Button></Card>
    <Card eyebrow={integrated ? 'Ciclo integrado' : awaitingReview ? 'Retorno pendente' : 'Missão principal'} title="A Palavra Antes da Resposta" className="mission-card"><div className="mission-card__icon">{integrated ? <CheckCircle2/> : awaitingReview ? <Clock3/> : <BookOpenText/>}</div><p>{integrated ? 'A Lâmpada integra a Primeira Obra.' : awaitingReview ? 'O ciclo aguarda revisão.' : 'Organize fato, interpretação, previsão e intenção.'}</p><Button variant="secondary" onClick={() => navigate(missionAction.route)}>{missionAction.label} <MissionActionIcon size={18}/></Button></Card>
    {waterAvailable && <Card eyebrow={waterCompleted ? 'Capítulo concluído' : 'Capítulo disponível'} title="A Câmara dos Salmos" className="mission-card mission-card--water"><div className="mission-card__icon">{waterCompleted ? <CupSoda/> : <Droplets/>}</div><p>{waterCompleted ? 'O ciclo da Água foi registrado.' : 'Reconheça emoção, lamento, memória e apoio sem diagnóstico.'}</p><Button variant="secondary" onClick={() => navigate(waterCompleted ? '/temple/psalms-chamber' : chaliceProgress?.positioned ? '/review/water-chapter' : '/temple/psalms-chamber')}>{waterAction} <ArrowRight size={18}/></Button></Card>}
    {forgeAvailable && <Card eyebrow={fireCompleted ? 'Capítulo concluído' : shieldProgress?.positioned ? 'Revisão geral disponível' : shieldCreated ? 'Escudo criado' : 'Capítulo disponível'} title="A Forja dos Elementos" className="mission-card mission-card--fire"><div className="mission-card__icon">{fireCompleted ? <CheckCircle2/> : shieldCreated ? <Shield/> : transformedMetalCreated ? <Hammer/> : <Flame/>}</div><p>{fireCompleted ? 'O primeiro ciclo do Fogo foi registrado.' : shieldProgress?.positioned ? 'O Escudo está pronto para o encerramento do capítulo.' : 'O Fogo avança por componentes separados e recusáveis.'}</p><Button variant="secondary" onClick={() => navigate(fireRoute)}>{fireAction} <ArrowRight size={18}/></Button></Card>}
    {gardenAvailable && <Card eyebrow="Novo capítulo disponível" title="O Jardim Interior" className="mission-card mission-card--earth"><div className="mission-card__icon"><Sprout/></div><p>A Terra começa por corpo percebido, descanso, estrutura e uma ação pequena.</p><Button variant="secondary" onClick={() => navigate('/temple/garden')}>Entrar no Jardim <ArrowRight size={18}/></Button></Card>}
    <Card title="Mapa do Templo" eyebrow="Ambientes"><TempleMap temple={temple} onRoomSelect={roomSelect} unlockedRoomIds={[...(integrated ? ['psalms-chamber'] : []), ...(waterCompleted ? ['forge'] : []), ...(fireCompleted ? ['garden'] : [])]}/></Card>
    <Card title="Instrumentos da Obra" eyebrow={fireCompleted ? 'Ar, Água, Fogo e Terra' : namedFlameCreated ? 'Ar, Água e Fogo' : chaliceAvailable ? 'Água e Ar' : 'Instrumentos'}>{lamp ? <div className="item-mini"><div className="lamp-icon"><LampDesk/></div><div><strong>{lamp.name}</strong><p>{lamp.action}</p></div></div> : <div className="empty-state"><LampDesk/><p>Sua primeira receita será desbloqueada na Biblioteca.</p></div>}{chaliceAvailable && <div className="item-mini"><div className="lamp-icon"><CupSoda/></div><div><strong>Cálice da Memória Serena</strong><p>{waterCompleted ? 'Ciclo registrado' : 'Ciclo em revisão'}</p></div></div>}{namedFlameCreated && <div className="item-mini"><div className="lamp-icon"><Flame/></div><div><strong>Chama Nomeada</strong><p>Primeiro componente do Fogo</p></div></div>}{intervalEmberCreated && <div className="item-mini"><div className="lamp-icon"><Clock3/></div><div><strong>Brasa do Intervalo</strong><p>Segundo componente do Fogo</p></div></div>}{boundaryPlateCreated && <div className="item-mini"><div className="lamp-icon"><Shield/></div><div><strong>Placa do Limite</strong><p>Terceiro componente do Fogo</p></div></div>}{courageMarkCreated && <div className="item-mini"><div className="lamp-icon"><BadgeCheck/></div><div><strong>Marca da Coragem Proporcional</strong><p>Quarto componente do Fogo</p></div></div>}{transformedMetalCreated && <div className="item-mini"><div className="lamp-icon"><Hammer/></div><div><strong>Metal Transformado</strong><p>Quinto componente do Fogo</p></div></div>}{shieldCreated && <div className="item-mini"><div className="lamp-icon"><Shield/></div><div><strong>Escudo do Limite Justo</strong><p>{fireCompleted ? 'Ciclo do Fogo registrado' : shieldProgress?.positioned ? 'Posicionado na Forja' : shieldProgress?.status === 'integrated' ? 'Integrado' : 'Ciclo em revisão'}</p></div></div>}</Card>
    <Card title="Limites do sistema" eyebrow="Segurança"><div className="safety-summary"><ShieldCheck/><p>Nenhum status é diagnóstico. Símbolos não determinam o futuro, e toda ação pode ser recusada.</p></div></Card>
  </div></div>;
}
