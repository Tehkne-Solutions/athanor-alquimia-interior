import { BookOpenText, CheckCircle2, Clock3, Footprints, ListChecks, LockKeyhole, Map, ShieldCheck, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { earthActionOptions, earthResourceOptions } from '../content/earthBody';
import { earthFoundationBiblicalUnit } from '../content/earthFoundation';
import { earthOrderDecisionOptions, earthOrderItems } from '../content/earthOrder';
import { earthResourceDecisionOptions, earthResourceScopeOptions } from '../content/earthResources';
import { earthRhythmDecisionOptions, earthRhythmFrequencyOptions } from '../content/earthRhythm';
import { earthSmallStepOptions, earthWorkDecisionOptions } from '../content/earthWork';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthBodyStore } from '../state/useEarthBodyStore';
import { useEarthOrderStore } from '../state/useEarthOrderStore';
import { useEarthResourcesStore } from '../state/useEarthResourcesStore';
import { useEarthRhythmStore } from '../state/useEarthRhythmStore';
import { useEarthWorkStore } from '../state/useEarthWorkStore';
import { useFireChapterStore } from '../state/useFireChapterStore';

export function GardenPage() {
  const navigate = useNavigate();
  const garden = useAthanorStore((state) => state.temple?.rooms.find((room) => room.roomId === 'garden'));
  const fireChapter = useFireChapterStore((state) => state.progress);
  const rawBodyProgress = useEarthBodyStore((state) => state.progress);
  const rawWorkProgress = useEarthWorkStore((state) => state.progress);
  const rawResourcesProgress = useEarthResourcesStore((state) => state.progress);
  const rawRhythmProgress = useEarthRhythmStore((state) => state.progress);
  const rawOrderProgress = useEarthOrderStore((state) => state.progress);
  const sourceFireCycleId = fireChapter?.cycleId ?? fireChapter?.completedAt;
  const bodyProgress = sourceFireCycleId && rawBodyProgress?.sourceFireCycleId === sourceFireCycleId ? rawBodyProgress : undefined;
  const sourceBodyPresenceMarkId = bodyProgress?.status === 'completed' && bodyProgress.bodyPresenceMarkCreated ? bodyProgress.completedAt ?? `${bodyProgress.sourceFireCycleId}:body-presence-mark` : undefined;
  const workProgress = sourceBodyPresenceMarkId && rawWorkProgress?.sourceBodyPresenceMarkId === sourceBodyPresenceMarkId ? rawWorkProgress : undefined;
  const sourceFirstStepSeedId = workProgress?.status === 'completed' && workProgress.firstStepSeedCreated ? workProgress.completedAt ?? `${workProgress.sourceBodyPresenceMarkId}:first-step-seed` : undefined;
  const resourcesProgress = sourceFirstStepSeedId && rawResourcesProgress?.sourceFirstStepSeedId === sourceFirstStepSeedId ? rawResourcesProgress : undefined;
  const sourceResourceBasketId = resourcesProgress?.status === 'completed' && resourcesProgress.possibleResourcesBasketCreated ? resourcesProgress.completedAt ?? `${resourcesProgress.sourceFirstStepSeedId}:resource-basket` : undefined;
  const rhythmProgress = sourceResourceBasketId && rawRhythmProgress?.sourceResourceBasketId === sourceResourceBasketId ? rawRhythmProgress : undefined;
  const sourceRhythmCompassId = rhythmProgress?.status === 'completed' && rhythmProgress.rhythmCompassCreated ? rhythmProgress.completedAt ?? `${rhythmProgress.sourceResourceBasketId}:rhythm-compass` : undefined;
  const orderProgress = sourceRhythmCompassId && rawOrderProgress?.sourceRhythmCompassId === sourceRhythmCompassId ? rawOrderProgress : undefined;
  const available = Boolean(fireChapter?.status === 'completed' || (garden && garden.status !== 'dormant' && garden.status !== 'hidden'));

  if (!available) {
    return <div className="page page--earth"><PageHeader eyebrow="Capítulo da Terra" title="O Jardim ainda está adormecido." description="Conclua a revisão geral do Fogo. O Jardim não é aberto apenas pela criação ou pelo posicionamento do Escudo."/><Card title="Caminho ainda fechado" eyebrow="Dependência da jornada"><div className="earth-lock"><LockKeyhole/><p>Integre e posicione o Escudo e escolha o destino das cinco práticas do Fogo.</p></div><Button onClick={() => navigate('/review/fire-chapter')}>Revisar o capítulo do Fogo</Button></Card></div>;
  }

  const selectedAction = earthActionOptions.find((option) => option.id === bodyProgress?.action);
  const selectedResources = earthResourceOptions.filter((option) => bodyProgress?.resources.includes(option.id));
  const selectedStep = earthSmallStepOptions.find((option) => option.id === workProgress?.smallStep);
  const selectedWorkDecision = earthWorkDecisionOptions.find((option) => option.id === workProgress?.decision);
  const selectedResourceScope = earthResourceScopeOptions.find((option) => option.id === resourcesProgress?.scope);
  const selectedResourceDecision = earthResourceDecisionOptions.find((option) => option.id === resourcesProgress?.decision);
  const selectedRhythmFrequency = earthRhythmFrequencyOptions.find((option) => option.id === rhythmProgress?.frequency);
  const selectedRhythmDecision = earthRhythmDecisionOptions.find((option) => option.id === rhythmProgress?.decision);
  const selectedOrderPriority = orderProgress?.priority === 'no_priority' ? undefined : earthOrderItems.find((item) => item.id === orderProgress?.priority);
  const selectedOrderDecision = earthOrderDecisionOptions.find((option) => option.id === orderProgress?.decision);
  const missionLabel = bodyProgress?.status === 'completed' ? 'Revisar a Marca da Presença' : bodyProgress ? 'Continuar O Corpo Chega Primeiro' : 'Iniciar O Corpo Chega Primeiro';
  const workLabel = workProgress?.status === 'completed' ? 'Revisar a Semente criada' : workProgress ? 'Continuar O Trabalho que Cabe Hoje' : 'Iniciar O Trabalho que Cabe Hoje';
  const resourcesLabel = resourcesProgress?.status === 'completed' ? 'Revisar o Cesto criado' : resourcesProgress ? 'Continuar A Casa dos Recursos' : 'Iniciar A Casa dos Recursos';
  const rhythmLabel = rhythmProgress?.status === 'completed' ? 'Revisar o Compasso criado' : rhythmProgress ? 'Continuar O Ritmo que Pode Ser Mantido' : 'Iniciar O Ritmo que Pode Ser Mantido';
  const orderLabel = orderProgress?.status === 'completed' ? 'Revisar o Mapa criado' : orderProgress ? 'Continuar A Ordem que Serve' : 'Iniciar A Ordem que Serve';

  const gardenTitle = orderProgress?.status === 'completed'
    ? 'Uma ordem limitada e revisável recebeu seu Mapa.'
    : rhythmProgress?.status === 'completed'
      ? 'Uma cadência pausável recebeu seu Compasso.'
      : resourcesProgress?.status === 'completed'
        ? 'Os recursos possíveis receberam um recipiente.'
        : workProgress?.status === 'completed'
          ? 'Uma unidade pequena recebeu forma.'
          : bodyProgress?.status === 'completed'
            ? 'A presença corporal recebeu sua primeira marca.'
            : 'A Terra começa pelo que já está presente.';

  return <div className="page page--earth"><PageHeader eyebrow="Jardim Interior" title={gardenTitle} description="O capítulo organiza corpo percebido, trabalho possível, recursos, ritmo e ordem sem diagnóstico ou cobrança de produtividade."/><div className="earth-foundation-grid">
    <Card className="earth-hero-card"><div className="earth-hero-symbol" aria-hidden="true">{orderProgress?.status === 'completed' ? <Map/> : rhythmProgress?.status === 'completed' ? <Clock3/> : resourcesProgress?.status === 'completed' ? <ListChecks/> : workProgress?.status === 'completed' ? <Sprout/> : bodyProgress?.status === 'completed' ? <Footprints/> : <Sprout/>}</div><div><p className="eyebrow">Estado do Jardim</p><h2>{orderProgress?.status === 'completed' ? 'Quinto componente criado' : rhythmProgress?.status === 'completed' ? 'Quarto componente criado' : resourcesProgress?.status === 'completed' ? 'Terceiro componente criado' : workProgress?.status === 'completed' ? 'Segundo componente criado' : bodyProgress?.status === 'completed' ? 'Primeiro componente criado' : bodyProgress ? 'Missão em andamento' : 'Fundação disponível'}</h2><p>{orderProgress?.status === 'completed' ? 'O Mapa registra limite visível, estados reversíveis, prioridade e revisão.' : rhythmProgress?.status === 'completed' ? 'O Compasso registra uma cadência mínima, interrompível e sem sequência obrigatória.' : resourcesProgress?.status === 'completed' ? 'O Cesto registra disponibilidade, substituição, escopo e uma decisão recusável.' : workProgress?.status === 'completed' ? 'A Semente registra uma unidade fictícia e uma decisão recusável.' : bodyProgress?.status === 'completed' ? 'A Marca registra escolhas curadas sem avaliar saúde, disciplina ou produtividade.' : 'A primeira missão trabalha somente com escolhas curadas, recusáveis e armazenadas localmente.'}</p></div></Card>
    <Card title={earthFoundationBiblicalUnit.title} eyebrow={earthFoundationBiblicalUnit.reference}><blockquote>{earthFoundationBiblicalUnit.principle}</blockquote><p>{earthFoundationBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia permanece como núcleo. Malkhut, Kun e A Imperatriz são camadas opcionais e identificadas.</span></div></Card>
    <Card title="O Corpo Chega Primeiro" eyebrow="Primeira missão da Terra"><div className="earth-mission-preview">{bodyProgress?.status === 'completed' ? <CheckCircle2/> : <Footprints/>}<div><strong>{bodyProgress?.status === 'completed' ? 'Marca da Presença Corporal criada' : 'Check-in perceptivo e recusável'}</strong><p>{bodyProgress?.status === 'completed' ? `${selectedAction?.label ?? 'Nenhuma ação'} · ${selectedResources.length} estado(s) de recurso` : 'Energia, descanso, tensão, conforto, recursos e uma ação pequena.'}</p></div></div><Button onClick={() => navigate('/mission/body-arrives-first')}>{missionLabel}</Button></Card>
    {bodyProgress?.status === 'completed' && <Card title="O Trabalho que Cabe Hoje" eyebrow="Segunda missão da Terra"><div className="earth-mission-preview">{workProgress?.status === 'completed' ? <CheckCircle2/> : <Sprout/>}<div><strong>{workProgress?.status === 'completed' ? 'Semente do Primeiro Passo criada' : 'Decomposição sem cobrança'}</strong><p>{workProgress?.status === 'completed' ? `${selectedStep?.label} · ${selectedWorkDecision?.label}` : 'Intenção, projeto, tarefa, primeiro passo, capacidade e tempo percebidos.'}</p></div></div><Button onClick={() => navigate('/mission/work-that-fits-today')}>{workLabel}</Button></Card>}
    {workProgress?.status === 'completed' && <Card title="A Casa dos Recursos" eyebrow="Terceira missão da Terra"><div className="earth-mission-preview">{resourcesProgress?.status === 'completed' ? <CheckCircle2/> : <ListChecks/>}<div><strong>{resourcesProgress?.status === 'completed' ? 'Cesto dos Recursos Possíveis criado' : 'Inventário sem promessa'}</strong><p>{resourcesProgress?.status === 'completed' ? `${selectedResourceScope?.label} · ${selectedResourceDecision?.label}` : 'Tempo, espaço, informação, materiais, apoio, substituição e redução de escopo.'}</p></div></div><Button onClick={() => navigate('/mission/house-of-resources')}>{resourcesLabel}</Button></Card>}
    {resourcesProgress?.status === 'completed' && <Card title="O Ritmo que Pode Ser Mantido" eyebrow="Quarta missão da Terra"><div className="earth-mission-preview">{rhythmProgress?.status === 'completed' ? <CheckCircle2/> : <Clock3/>}<div><strong>{rhythmProgress?.status === 'completed' ? 'Compasso do Ritmo Sustentável criado' : 'Cadência sem streak'}</strong><p>{rhythmProgress?.status === 'completed' ? `${selectedRhythmFrequency?.label} · ${selectedRhythmDecision?.label}` : 'Ritmo, pressa, repetição, cobrança, pausa, recursos e retomada.'}</p></div></div><Button onClick={() => navigate('/mission/sustainable-rhythm')}>{rhythmLabel}</Button></Card>}
    {rhythmProgress?.status === 'completed' && <Card title="A Ordem que Serve" eyebrow="Quinta missão da Terra"><div className="earth-mission-preview">{orderProgress?.status === 'completed' ? <CheckCircle2/> : <Map/>}<div><strong>{orderProgress?.status === 'completed' ? 'Mapa da Ordem Possível criado' : 'Prioridade sem urgência'}</strong><p>{orderProgress?.status === 'completed' ? `${selectedOrderPriority?.label ?? 'Nenhuma prioridade'} · ${selectedOrderDecision?.label}` : 'Ordem, prioridade, rigidez, acúmulo, limite visível e revisão.'}</p></div></div><Button onClick={() => navigate('/mission/order-that-serves')}>{orderLabel}</Button></Card>}
    {bodyProgress?.status === 'completed' && <Card title="Marca da Presença Corporal" eyebrow="Primeiro componente"><div className="earth-mission-preview"><Footprints/><div><strong>Componente local criado</strong><p>Não conclui o capítulo e não representa diagnóstico ou melhora.</p></div></div></Card>}
    {workProgress?.status === 'completed' && <Card title="Semente do Primeiro Passo" eyebrow="Segundo componente"><div className="earth-mission-preview"><Sprout/><div><strong>Componente local criado</strong><p>Não representa produtividade, compromisso ou obrigação de executar.</p></div></div></Card>}
    {resourcesProgress?.status === 'completed' && <Card title="Cesto dos Recursos Possíveis" eyebrow="Terceiro componente"><div className="earth-mission-preview"><ListChecks/><div><strong>Componente local criado</strong><p>Não representa abundância, segurança material ou garantia de acesso.</p></div></div></Card>}
    {rhythmProgress?.status === 'completed' && <Card title="Compasso do Ritmo Sustentável" eyebrow="Quarto componente"><div className="earth-mission-preview"><Clock3/><div><strong>Componente local criado</strong><p>Não representa disciplina, constância, produtividade ou obrigação de continuidade.</p></div></div></Card>}
    {orderProgress?.status === 'completed' && <Card title="Mapa da Ordem Possível" eyebrow="Quinto componente"><div className="earth-mission-preview"><Map/><div><strong>Componente local criado</strong><p>Não representa controle, organização pessoal, urgência ou produtividade.</p></div></div></Card>}
    <Card title="Limites do Jardim" eyebrow="Segurança"><div className="safety-summary"><ShieldCheck/><p>O Athanor não diagnostica condições físicas, não recomenda tratamento e não transforma produtividade, recursos, frequência ou organização em valor pessoal.</p></div><Button variant="ghost" onClick={() => navigate('/safety?source=earth')}>Abrir apoio direto</Button></Card>
  </div></div>;
}
