import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  CheckCircle2,
  Clock3,
  CupSoda,
  Database,
  Droplets,
  Flame,
  Footprints,
  Gem,
  Hammer,
  LampDesk,
  ListChecks,
  Map,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  Sprout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { PageHeader } from '../components/PageHeader';
import { TempleMap } from '../components/TempleMap';
import { biblicalUnits } from '../content/seed';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthBodyStore } from '../state/useEarthBodyStore';
import { useEarthChapterStore } from '../state/useEarthChapterStore';
import { useEarthOrderStore } from '../state/useEarthOrderStore';
import { useEarthResourcesStore } from '../state/useEarthResourcesStore';
import { useEarthRhythmStore } from '../state/useEarthRhythmStore';
import { useEarthStoneStore } from '../state/useEarthStoneStore';
import { useEarthWorkStore } from '../state/useEarthWorkStore';
import { useFireBoundaryStore } from '../state/useFireBoundaryStore';
import { useFireChapterStore } from '../state/useFireChapterStore';
import { useFireCourageStore } from '../state/useFireCourageStore';
import { useFireIntervalStore } from '../state/useFireIntervalStore';
import { useFireMissionStore } from '../state/useFireMissionStore';
import { useFireShieldStore } from '../state/useFireShieldStore';
import { useFireTransformationStore } from '../state/useFireTransformationStore';
import { useWaterChaliceStore } from '../state/useWaterChaliceStore';
import { useWaterChapterStore } from '../state/useWaterChapterStore';

const workLevelLabels = {
  foundation: 'Fundação',
  first_fire: 'Primeiro Fogo',
  form: 'Forma',
  construction: 'Construção',
  integration: 'Integração',
  new_work: 'Nova Obra'
} as const;

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
  const rawEarthBody = useEarthBodyStore((state) => state.progress);
  const rawEarthWork = useEarthWorkStore((state) => state.progress);
  const rawEarthResources = useEarthResourcesStore((state) => state.progress);
  const rawEarthRhythm = useEarthRhythmStore((state) => state.progress);
  const rawEarthOrder = useEarthOrderStore((state) => state.progress);
  const rawEarthStone = useEarthStoneStore((state) => state.progress);
  const rawEarthChapter = useEarthChapterStore((state) => state.progress);
  const passage = biblicalUnits[0];

  if (!character || !temple) return null;

  const lamp = inventory.find((item) => item.id === 'item_clear_word_lamp_v1');
  const awaitingReview = lamp?.lifecycle === 'awaiting_review' || lamp?.lifecycle === 'adjusted' || lamp?.lifecycle === 'resting';
  const integrated = lamp?.lifecycle === 'integrated';
  const psalmsChamber = temple.rooms.find((room) => room.roomId === 'psalms-chamber');
  const forge = temple.rooms.find((room) => room.roomId === 'forge');
  const garden = temple.rooms.find((room) => room.roomId === 'garden');
  const centralTree = temple.rooms.find((room) => room.roomId === 'central-tree');
  const waterAvailable = Boolean(integrated || (psalmsChamber && psalmsChamber.status !== 'dormant' && psalmsChamber.status !== 'hidden'));
  const waterCompleted = Boolean(waterChapter && waterJourney && waterChapter.journeyStartedAt === waterJourney.startedAt && waterChapter.status === 'completed');
  const forgeAvailable = Boolean(waterCompleted || (forge && forge.status !== 'dormant' && forge.status !== 'hidden'));
  const chaliceAvailable = Boolean(chaliceProgress && waterJourney && chaliceProgress.journeyStartedAt === waterJourney.startedAt && chaliceProgress.chaliceCreated);

  const sourceWaterCycleId = waterChapter?.cycleId ?? waterChapter?.completedAt;
  const fireProgress = sourceWaterCycleId && rawFireProgress?.sourceWaterCycleId === sourceWaterCycleId ? rawFireProgress : undefined;
  const namedFlameCreated = fireProgress?.status === 'completed' && fireProgress.namedFlameCreated;
  const sourceNamedFlameId = namedFlameCreated && fireProgress ? fireProgress.completedAt ?? fireProgress.updatedAt : undefined;
  const intervalProgress = sourceNamedFlameId && rawIntervalProgress?.sourceNamedFlameId === sourceNamedFlameId ? rawIntervalProgress : undefined;
  const intervalEmberCreated = intervalProgress?.status === 'completed' && intervalProgress.intervalEmberCreated;
  const sourceIntervalEmberId = intervalEmberCreated && intervalProgress ? intervalProgress.completedAt ?? `${intervalProgress.sourceNamedFlameId}:interval-ember` : undefined;
  const boundaryProgress = sourceIntervalEmberId && rawBoundaryProgress?.sourceIntervalEmberId === sourceIntervalEmberId ? rawBoundaryProgress : undefined;
  const boundaryPlateCreated = boundaryProgress?.status === 'completed' && boundaryProgress.boundaryPlateCreated;
  const sourceBoundaryPlateId = boundaryPlateCreated && boundaryProgress ? boundaryProgress.completedAt ?? `${boundaryProgress.sourceIntervalEmberId}:boundary-plate` : undefined;
  const courageProgress = sourceBoundaryPlateId && rawCourageProgress?.sourceBoundaryPlateId === sourceBoundaryPlateId ? rawCourageProgress : undefined;
  const courageMarkCreated = courageProgress?.status === 'completed' && courageProgress.proportionalCourageMarkCreated;
  const sourceCourageMarkId = courageMarkCreated && courageProgress ? courageProgress.completedAt ?? `${courageProgress.sourceBoundaryPlateId}:courage-mark` : undefined;
  const transformationProgress = sourceCourageMarkId && rawTransformationProgress?.sourceCourageMarkId === sourceCourageMarkId ? rawTransformationProgress : undefined;
  const transformedMetalCreated = transformationProgress?.status === 'completed' && transformationProgress.transformedMetalCreated;
  const sourceTransformedMetalId = transformedMetalCreated && transformationProgress ? transformationProgress.completedAt ?? `${transformationProgress.sourceCourageMarkId}:transformed-metal` : undefined;
  const shieldProgress = sourceTransformedMetalId && rawShieldProgress?.sourceTransformedMetalId === sourceTransformedMetalId ? rawShieldProgress : undefined;
  const shieldCreated = Boolean(shieldProgress?.shieldCreated);
  const sourceShieldId = shieldProgress?.craftedAt ?? (shieldProgress ? `${shieldProgress.sourceTransformedMetalId}:shield` : undefined);
  const fireChapter = sourceShieldId && rawFireChapter?.sourceShieldId === sourceShieldId ? rawFireChapter : undefined;
  const fireCompleted = fireChapter?.status === 'completed';

  const sourceFireCycleId = fireChapter?.cycleId ?? fireChapter?.completedAt;
  const earthBody = sourceFireCycleId && rawEarthBody?.sourceFireCycleId === sourceFireCycleId ? rawEarthBody : undefined;
  const bodyMarkCreated = earthBody?.status === 'completed' && earthBody.bodyPresenceMarkCreated;
  const sourceBodyPresenceMarkId = bodyMarkCreated && earthBody ? earthBody.completedAt ?? `${earthBody.sourceFireCycleId}:body-presence-mark` : undefined;
  const earthWork = sourceBodyPresenceMarkId && rawEarthWork?.sourceBodyPresenceMarkId === sourceBodyPresenceMarkId ? rawEarthWork : undefined;
  const firstStepSeedCreated = earthWork?.status === 'completed' && earthWork.firstStepSeedCreated;
  const sourceFirstStepSeedId = firstStepSeedCreated && earthWork ? earthWork.completedAt ?? `${earthWork.sourceBodyPresenceMarkId}:first-step-seed` : undefined;
  const earthResources = sourceFirstStepSeedId && rawEarthResources?.sourceFirstStepSeedId === sourceFirstStepSeedId ? rawEarthResources : undefined;
  const resourcesBasketCreated = earthResources?.status === 'completed' && earthResources.possibleResourcesBasketCreated;
  const sourceResourceBasketId = resourcesBasketCreated && earthResources ? earthResources.completedAt ?? `${earthResources.sourceFirstStepSeedId}:resource-basket` : undefined;
  const earthRhythm = sourceResourceBasketId && rawEarthRhythm?.sourceResourceBasketId === sourceResourceBasketId ? rawEarthRhythm : undefined;
  const rhythmCompassCreated = earthRhythm?.status === 'completed' && earthRhythm.rhythmCompassCreated;
  const sourceRhythmCompassId = rhythmCompassCreated && earthRhythm ? earthRhythm.completedAt ?? `${earthRhythm.sourceResourceBasketId}:rhythm-compass` : undefined;
  const earthOrder = sourceRhythmCompassId && rawEarthOrder?.sourceRhythmCompassId === sourceRhythmCompassId ? rawEarthOrder : undefined;
  const orderMapCreated = earthOrder?.status === 'completed' && earthOrder.possibleOrderMapCreated;
  const sourceOrderMapId = orderMapCreated && earthOrder ? earthOrder.completedAt ?? `${earthOrder.sourceRhythmCompassId}:order-map` : undefined;
  const stoneProgress = sourceOrderMapId && rawEarthStone?.sourceOrderMapId === sourceOrderMapId ? rawEarthStone : undefined;
  const stoneCreated = Boolean(stoneProgress?.stoneCreated);
  const sourceStoneId = stoneProgress?.craftedAt ?? (stoneProgress ? `${stoneProgress.sourceOrderMapId}:stone` : undefined);
  const earthChapter = sourceStoneId && rawEarthChapter?.sourceStoneId === sourceStoneId ? rawEarthChapter : undefined;
  const earthCompleted = earthChapter?.status === 'completed';
  const gardenAvailable = Boolean(fireCompleted || (garden && garden.status !== 'dormant' && garden.status !== 'hidden'));
  const sanctuaryAvailable = Boolean(earthCompleted || (centralTree && centralTree.status !== 'dormant' && centralTree.status !== 'hidden'));

  const roomSelect = (roomId: string) => {
    if (roomId === 'proverbs-library') navigate('/temple/proverbs-library');
    if (roomId === 'psalms-chamber') navigate('/temple/psalms-chamber');
    if (roomId === 'forge') navigate('/temple/forge');
    if (roomId === 'garden') navigate('/temple/garden');
    if (roomId === 'central-tree') navigate('/temple/spirit-sanctuary');
  };

  const missionAction = awaitingReview
    ? { label: lamp?.lifecycle === 'resting' ? 'Retomar revisão' : 'Revisar a Lâmpada', route: '/review/clear-word-lamp', icon: RefreshCw }
    : integrated
      ? { label: 'Visitar a Biblioteca', route: '/temple/proverbs-library', icon: CheckCircle2 }
      : lamp
        ? { label: 'Ver Lâmpada criada', route: '/items/clear-word-lamp', icon: LampDesk }
        : { label: mission ? 'Continuar jornada' : 'Iniciar jornada', route: '/mission/word-before-response', icon: ArrowRight };
  const MissionActionIcon = missionAction.icon;
  const waterAction = waterCompleted ? 'Visitar a Câmara restaurada' : chaliceProgress?.positioned ? 'Concluir o capítulo da Água' : waterJourney?.status === 'named' ? 'Continuar a jornada da Água' : waterJourney ? 'Continuar missão da Água' : 'Entrar na Câmara dos Salmos';
  const fireAction = fireCompleted ? 'Visitar a Forja restaurada' : shieldProgress?.positioned ? 'Concluir o capítulo do Fogo' : shieldCreated ? 'Continuar o ciclo do Escudo' : shieldProgress ? 'Continuar a Forja do Escudo' : transformedMetalCreated ? 'Forjar o Escudo do Limite Justo' : transformationProgress ? 'Continuar O que Precisa Ser Transformado' : courageMarkCreated ? 'Iniciar O que Precisa Ser Transformado' : courageProgress ? 'Continuar A Coragem Proporcional' : boundaryPlateCreated ? 'Iniciar A Coragem Proporcional' : boundaryProgress ? 'Continuar O Limite que Protege' : intervalEmberCreated ? 'Iniciar O Limite que Protege' : intervalProgress ? 'Continuar O Instante Antes do Gesto' : namedFlameCreated ? 'Iniciar O Instante Antes do Gesto' : fireProgress ? 'Continuar O Nome da Chama' : 'Iniciar O Nome da Chama';
  const fireRoute = fireCompleted ? '/temple/forge' : shieldProgress?.positioned ? '/review/fire-chapter' : transformedMetalCreated || shieldProgress ? '/crafting/just-boundary-shield' : courageMarkCreated ? '/mission/what-needs-transformation' : boundaryPlateCreated ? '/mission/proportional-courage' : intervalEmberCreated ? '/mission/limit-that-protects' : namedFlameCreated ? '/mission/before-the-gesture' : '/mission/name-the-flame';

  const earthAction = earthCompleted
    ? 'Visitar o Jardim restaurado'
    : stoneProgress?.positioned
      ? 'Concluir o capítulo da Terra'
      : stoneProgress?.status === 'integrated'
        ? 'Posicionar a Pedra'
        : stoneCreated
          ? 'Continuar o ciclo da Pedra'
          : stoneProgress
            ? 'Continuar a lapidação da Pedra'
            : orderMapCreated
              ? 'Lapidar a Pedra do Primeiro Passo'
              : earthOrder
                ? 'Continuar A Ordem que Serve'
                : rhythmCompassCreated
                  ? 'Iniciar A Ordem que Serve'
                  : earthRhythm
                    ? 'Continuar O Ritmo que Pode Ser Mantido'
                    : resourcesBasketCreated
                      ? 'Iniciar O Ritmo que Pode Ser Mantido'
                      : earthResources
                        ? 'Continuar A Casa dos Recursos'
                        : firstStepSeedCreated
                          ? 'Iniciar A Casa dos Recursos'
                          : earthWork
                            ? 'Continuar O Trabalho que Cabe Hoje'
                            : bodyMarkCreated
                              ? 'Iniciar O Trabalho que Cabe Hoje'
                              : earthBody
                                ? 'Continuar O Corpo Chega Primeiro'
                                : 'Iniciar O Corpo Chega Primeiro';
  const earthRoute = earthCompleted
    ? '/temple/garden'
    : stoneProgress?.positioned
      ? '/review/earth-chapter'
      : orderMapCreated
        ? '/crafting/first-step-stone'
        : rhythmCompassCreated
          ? '/mission/order-that-serves'
          : resourcesBasketCreated
            ? '/mission/sustainable-rhythm'
            : firstStepSeedCreated
              ? '/mission/house-of-resources'
              : bodyMarkCreated
                ? '/mission/work-that-fits-today'
                : '/mission/body-arrives-first';

  const activeRoomCount = temple.rooms.filter((room) => ['active', 'restored', 'available'].includes(room.status)).length;
  const componentCount = inventory.length
    + Number(waterJourney?.namedDropCreated)
    + Number(chaliceAvailable)
    + Number(namedFlameCreated)
    + Number(intervalEmberCreated)
    + Number(boundaryPlateCreated)
    + Number(courageMarkCreated)
    + Number(transformedMetalCreated)
    + Number(shieldCreated)
    + Number(bodyMarkCreated)
    + Number(firstStepSeedCreated)
    + Number(resourcesBasketCreated)
    + Number(rhythmCompassCreated)
    + Number(orderMapCreated)
    + Number(stoneCreated);
  const cycleCount = reviews.length + Number(waterCompleted) + Number(fireCompleted) + Number(earthCompleted);

  const heroMessage = earthCompleted
    ? 'O ciclo da Terra foi registrado, o Jardim foi restaurado e o Santuário do Espírito foi aberto.'
    : stoneCreated
      ? 'Os cinco componentes da Terra foram reunidos em uma Pedra que ainda depende de revisão explícita.'
      : orderMapCreated
        ? 'A quinta prática da Terra registrou uma ordem limitada sem criar urgência automática.'
        : rhythmCompassCreated
          ? 'A quarta prática da Terra registrou uma cadência pausável sem criar sequência obrigatória.'
          : resourcesBasketCreated
            ? 'A terceira prática da Terra registrou recursos possíveis sem prometer disponibilidade.'
            : firstStepSeedCreated
              ? 'A segunda prática da Terra registrou uma unidade pequena sem obrigação de execução.'
              : bodyMarkCreated
                ? 'A primeira prática da Terra registrou presença sem diagnóstico.'
                : fireCompleted
                  ? 'O ciclo do Fogo foi registrado e o Jardim Interior foi aberto.'
                  : shieldProgress?.positioned
                    ? 'O Escudo está posicionado e aguarda a revisão geral do Fogo.'
                    : waterCompleted
                      ? 'O ciclo da Água foi registrado e a Forja foi aberta.'
                      : integrated
                        ? 'A primeira Obra foi revisada.'
                        : lamp?.lifecycle === 'resting'
                          ? 'A primeira Obra está em repouso e pode ser retomada quando fizer sentido.'
                          : awaitingReview
                            ? 'A Biblioteca foi restaurada e a Lâmpada aguarda retorno.'
                            : 'A Biblioteca aguarda sua primeira restauração.';

  const missionEyebrow = integrated ? 'Ciclo integrado' : lamp?.lifecycle === 'resting' ? 'Ciclo em repouso' : awaitingReview ? 'Retorno pendente' : lamp ? 'Item criado' : 'Missão principal';
  const missionDescription = integrated
    ? 'A Lâmpada integra a Primeira Obra.'
    : lamp?.lifecycle === 'resting'
      ? 'O ciclo permanece preservado, sem prazo ou perda de progresso.'
      : awaitingReview
        ? 'O ciclo aguarda revisão.'
        : lamp
          ? 'A Lâmpada foi criada e precisa ser posicionada na Biblioteca.'
          : 'Organize fato, interpretação, previsão e intenção.';

  return <div className="page page--temple">
    <PageHeader eyebrow="Átrio da Presença" title={`Bem-vindo ao Templo, ${character.name}.`} description="Seu Templo registra ciclos de gameplay, itens e revisões. Ele não mede sua condição espiritual." action={<span className="local-badge"><Database size={16}/> Dados locais</span>}/>
    <div className="temple-dashboard">
      <Card className="hero-card"><div className="hero-card__scene"><div className={`temple-backdrop temple-backdrop--${temple.theme}`} aria-hidden="true"/><CharacterAvatar character={character}/></div><div className="hero-card__content"><p className="eyebrow">Nível da Obra</p><h2>{workLevelLabels[character.workLevel]}</h2><p>{heroMessage}</p><div className="status-row"><span><strong>{activeRoomCount}</strong> salas acessíveis</span><span><strong>{componentCount}</strong> componentes e itens</span><span><strong>{cycleCount}</strong> ciclos e revisões</span><span><strong>{temple.restorationLevel}</strong> nível do Templo</span></div></div></Card>
      <Card eyebrow={missionEyebrow} title="A Palavra Antes da Resposta" className="mission-card"><div className="mission-card__icon">{integrated ? <CheckCircle2/> : awaitingReview ? <Clock3/> : lamp ? <LampDesk/> : <BookOpenText/>}</div><p>{missionDescription}</p><Button onClick={() => navigate(missionAction.route)}>{missionAction.label} <MissionActionIcon size={18}/></Button></Card>
      <Card eyebrow="Princípio do ciclo" title={passage.title} className="principle-card"><blockquote>{passage.principle}</blockquote><p>{passage.application}</p><Button variant="ghost" onClick={() => navigate('/temple/proverbs-library')}>Conhecer o princípio <ArrowRight size={18}/></Button></Card>
      {waterAvailable && <Card eyebrow={waterCompleted ? 'Capítulo concluído' : 'Capítulo disponível'} title="A Câmara dos Salmos" className="mission-card mission-card--water"><div className="mission-card__icon">{waterCompleted ? <CupSoda/> : <Droplets/>}</div><p>{waterCompleted ? 'O ciclo da Água foi registrado.' : 'Reconheça emoção, lamento, memória e apoio sem diagnóstico.'}</p><Button variant="secondary" onClick={() => navigate(waterCompleted ? '/temple/psalms-chamber' : chaliceProgress?.positioned ? '/review/water-chapter' : '/temple/psalms-chamber')}>{waterAction} <ArrowRight size={18}/></Button></Card>}
      {forgeAvailable && <Card eyebrow={fireCompleted ? 'Capítulo concluído' : shieldProgress?.positioned ? 'Revisão geral disponível' : shieldCreated ? 'Escudo criado' : 'Capítulo disponível'} title="A Forja dos Elementos" className="mission-card mission-card--fire"><div className="mission-card__icon">{fireCompleted ? <CheckCircle2/> : shieldCreated ? <Shield/> : transformedMetalCreated ? <Hammer/> : <Flame/>}</div><p>{fireCompleted ? 'O primeiro ciclo do Fogo foi registrado.' : shieldProgress?.positioned ? 'O Escudo está pronto para o encerramento do capítulo.' : 'O Fogo avança por componentes separados e recusáveis.'}</p><Button variant="secondary" onClick={() => navigate(fireRoute)}>{fireAction} <ArrowRight size={18}/></Button></Card>}
      {gardenAvailable && <Card eyebrow={earthCompleted ? 'Capítulo concluído' : stoneProgress?.positioned ? 'Revisão geral disponível' : stoneCreated ? 'Item da Terra criado' : orderMapCreated ? 'Cinco componentes reunidos' : rhythmCompassCreated ? 'Quarto componente criado' : resourcesBasketCreated ? 'Terceiro componente criado' : firstStepSeedCreated ? 'Segundo componente criado' : bodyMarkCreated ? 'Primeiro componente criado' : earthBody ? 'Missão em andamento' : 'Novo capítulo disponível'} title="O Jardim Interior" className="mission-card mission-card--earth"><div className="mission-card__icon">{earthCompleted ? <CheckCircle2/> : stoneCreated ? <Gem/> : orderMapCreated ? <Map/> : rhythmCompassCreated ? <Clock3/> : resourcesBasketCreated ? <ListChecks/> : firstStepSeedCreated ? <Sprout/> : bodyMarkCreated ? <Footprints/> : <Sprout/>}</div><p>{earthCompleted ? 'O primeiro ciclo da Terra foi registrado.' : stoneProgress?.positioned ? 'A Pedra está pronta para o encerramento do capítulo.' : stoneCreated ? 'A Pedra registra uma fórmula local que ainda depende de revisão.' : orderMapCreated ? 'A receita da Pedra do Primeiro Passo está disponível.' : rhythmCompassCreated ? 'O Compasso registra uma cadência interrompível sem streak.' : resourcesBasketCreated ? 'O Cesto registra disponibilidade e limite sem prometer abundância.' : firstStepSeedCreated ? 'A Semente registra uma unidade pequena sem medir produtividade.' : bodyMarkCreated ? 'A Marca registra presença percebida sem avaliar saúde ou produtividade.' : 'A Terra começa por corpo percebido, descanso, estrutura e uma ação pequena.'}</p><Button variant="secondary" onClick={() => navigate(earthRoute)}>{earthAction} <ArrowRight size={18}/></Button></Card>}
      {sanctuaryAvailable && <Card eyebrow="Fundação disponível" title="Santuário do Espírito" className="mission-card mission-card--spirit"><div className="mission-card__icon"><Sparkles/></div><p>Palavra, emoção, impulso, corpo e ação serão observados em conjunto sem leitura oculta ou exigência de completude.</p><Button variant="secondary" onClick={() => navigate('/temple/spirit-sanctuary')}>Entrar no Santuário <ArrowRight size={18}/></Button></Card>}
      <Card title="Mapa do Templo" eyebrow="Ambientes"><TempleMap temple={temple} onRoomSelect={roomSelect} unlockedRoomIds={[...(integrated ? ['psalms-chamber'] : []), ...(waterCompleted ? ['forge'] : []), ...(fireCompleted ? ['garden'] : []), ...(earthCompleted ? ['central-tree'] : [])]}/></Card>
      <Card title="Instrumentos da Obra" eyebrow={earthCompleted ? 'Ar, Água, Fogo, Terra e síntese' : fireCompleted ? 'Ar, Água, Fogo e Terra' : namedFlameCreated ? 'Ar, Água e Fogo' : chaliceAvailable ? 'Água e Ar' : 'Instrumentos'}>
        {lamp ? <div className="item-mini"><div className="lamp-icon"><LampDesk/></div><div><strong>{lamp.name}</strong><p>{lamp.action}</p></div></div> : <div className="empty-state"><LampDesk/><p>Sua primeira receita será desbloqueada na Biblioteca.</p></div>}
        {chaliceAvailable && <div className="item-mini"><div className="lamp-icon"><CupSoda/></div><div><strong>Cálice da Memória Serena</strong><p>{waterCompleted ? 'Ciclo registrado' : 'Ciclo em revisão'}</p></div></div>}
        {namedFlameCreated && <div className="item-mini"><div className="lamp-icon"><Flame/></div><div><strong>Chama Nomeada</strong><p>Primeiro componente do Fogo</p></div></div>}
        {intervalEmberCreated && <div className="item-mini"><div className="lamp-icon"><Clock3/></div><div><strong>Brasa do Intervalo</strong><p>Segundo componente do Fogo</p></div></div>}
        {boundaryPlateCreated && <div className="item-mini"><div className="lamp-icon"><Shield/></div><div><strong>Placa do Limite</strong><p>Terceiro componente do Fogo</p></div></div>}
        {courageMarkCreated && <div className="item-mini"><div className="lamp-icon"><BadgeCheck/></div><div><strong>Marca da Coragem Proporcional</strong><p>Quarto componente do Fogo</p></div></div>}
        {transformedMetalCreated && <div className="item-mini"><div className="lamp-icon"><Hammer/></div><div><strong>Metal Transformado</strong><p>Quinto componente do Fogo</p></div></div>}
        {shieldCreated && <div className="item-mini"><div className="lamp-icon"><Shield/></div><div><strong>Escudo do Limite Justo</strong><p>{fireCompleted ? 'Ciclo do Fogo registrado' : shieldProgress?.positioned ? 'Posicionado na Forja' : shieldProgress?.status === 'integrated' ? 'Integrado' : 'Ciclo em revisão'}</p></div></div>}
        {bodyMarkCreated && <div className="item-mini"><div className="lamp-icon"><Footprints/></div><div><strong>Marca da Presença Corporal</strong><p>Primeiro componente da Terra</p></div></div>}
        {firstStepSeedCreated && <div className="item-mini"><div className="lamp-icon"><Sprout/></div><div><strong>Semente do Primeiro Passo</strong><p>Segundo componente da Terra</p></div></div>}
        {resourcesBasketCreated && <div className="item-mini"><div className="lamp-icon"><ListChecks/></div><div><strong>Cesto dos Recursos Possíveis</strong><p>Terceiro componente da Terra</p></div></div>}
        {rhythmCompassCreated && <div className="item-mini"><div className="lamp-icon"><Clock3/></div><div><strong>Compasso do Ritmo Sustentável</strong><p>Quarto componente da Terra</p></div></div>}
        {orderMapCreated && <div className="item-mini"><div className="lamp-icon"><Map/></div><div><strong>Mapa da Ordem Possível</strong><p>Quinto componente da Terra</p></div></div>}
        {stoneCreated && <div className="item-mini"><div className="lamp-icon"><Gem/></div><div><strong>Pedra do Primeiro Passo</strong><p>{earthCompleted ? 'Ciclo da Terra registrado' : stoneProgress?.positioned ? 'Posicionada no Jardim' : stoneProgress?.status === 'integrated' ? 'Integrada' : stoneProgress?.status === 'resting' ? 'Em repouso' : 'Ciclo em revisão'}</p></div></div>}
      </Card>
      <Card title="Limites do sistema" eyebrow="Segurança"><div className="safety-summary"><ShieldCheck/><p>Nenhum status é diagnóstico. Símbolos não determinam o futuro, e toda ação pode ser recusada.</p></div></Card>
    </div>
  </div>;
}
