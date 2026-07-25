import { ArrowRight, BadgeCheck, BookOpenText, CheckCircle2, Clock3, Flame, Hammer, LockKeyhole, Shield, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { fireBoundaryActionOptions, fireBoundaryDurationOptions } from '../content/fireBoundary';
import { fireCourageActionOptions, fireCourageReadinessOptions } from '../content/fireCourage';
import { fireFoundationBiblicalUnit } from '../content/fireFoundation';
import { fireExitOptions, fireIntervalOptions } from '../content/fireInterval';
import { fireActionOptions, fireEmotionOptions } from '../content/fireMission';
import { fireTransformationActionOptions, fireTransformationDecisionOptions } from '../content/fireTransformation';
import { useAthanorStore } from '../state/useAthanorStore';
import { useFireBoundaryStore } from '../state/useFireBoundaryStore';
import { useFireCourageStore } from '../state/useFireCourageStore';
import { useFireIntervalStore } from '../state/useFireIntervalStore';
import { useFireMissionStore } from '../state/useFireMissionStore';
import { useFireTransformationStore } from '../state/useFireTransformationStore';
import { useWaterChapterStore } from '../state/useWaterChapterStore';

export function ForgePage() {
  const navigate = useNavigate();
  const forge = useAthanorStore((state) => state.temple?.rooms.find((room) => room.roomId === 'forge'));
  const waterChapter = useWaterChapterStore((state) => state.progress);
  const rawFireProgress = useFireMissionStore((state) => state.progress);
  const rawIntervalProgress = useFireIntervalStore((state) => state.progress);
  const rawBoundaryProgress = useFireBoundaryStore((state) => state.progress);
  const rawCourageProgress = useFireCourageStore((state) => state.progress);
  const rawTransformationProgress = useFireTransformationStore((state) => state.progress);
  const sourceWaterCycleId = waterChapter?.cycleId ?? waterChapter?.completedAt;
  const fireProgress = sourceWaterCycleId && rawFireProgress?.sourceWaterCycleId === sourceWaterCycleId ? rawFireProgress : undefined;
  const sourceNamedFlameId = fireProgress?.status === 'completed' ? fireProgress.completedAt ?? fireProgress.updatedAt : undefined;
  const intervalProgress = sourceNamedFlameId && rawIntervalProgress?.sourceNamedFlameId === sourceNamedFlameId ? rawIntervalProgress : undefined;
  const sourceIntervalEmberId = intervalProgress?.status === 'completed' && intervalProgress.intervalEmberCreated ? intervalProgress.completedAt ?? `${intervalProgress.sourceNamedFlameId}:interval-ember` : undefined;
  const boundaryProgress = sourceIntervalEmberId && rawBoundaryProgress?.sourceIntervalEmberId === sourceIntervalEmberId ? rawBoundaryProgress : undefined;
  const sourceBoundaryPlateId = boundaryProgress?.status === 'completed' && boundaryProgress.boundaryPlateCreated ? boundaryProgress.completedAt ?? `${boundaryProgress.sourceIntervalEmberId}:boundary-plate` : undefined;
  const courageProgress = sourceBoundaryPlateId && rawCourageProgress?.sourceBoundaryPlateId === sourceBoundaryPlateId ? rawCourageProgress : undefined;
  const sourceCourageMarkId = courageProgress?.status === 'completed' && courageProgress.proportionalCourageMarkCreated ? courageProgress.completedAt ?? `${courageProgress.sourceBoundaryPlateId}:courage-mark` : undefined;
  const transformationProgress = sourceCourageMarkId && rawTransformationProgress?.sourceCourageMarkId === sourceCourageMarkId ? rawTransformationProgress : undefined;
  const available = Boolean(forge && forge.status !== 'dormant' && forge.status !== 'hidden' && waterChapter?.status === 'completed');

  if (!available) return <div className="page page--fire"><PageHeader eyebrow="Capítulo do Fogo" title="A Forja ainda está adormecida." description="Conclua a revisão geral da Água."/><Card title="Caminho ainda fechado" eyebrow="Dependência da jornada"><div className="fire-lock"><LockKeyhole/><p>Integre e posicione o Cálice e conclua o ciclo da Água.</p></div><Button onClick={() => navigate('/review/water-chapter')}>Revisar o capítulo da Água</Button></Card></div>;

  const selectedAction = fireActionOptions.find((option) => option.id === fireProgress?.action);
  const selectedEmotionLabels = fireEmotionOptions.filter((option) => fireProgress?.emotions.includes(option.id)).map((option) => option.label);
  const selectedInterval = fireIntervalOptions.find((option) => option.id === intervalProgress?.interval);
  const selectedExit = fireExitOptions.find((option) => option.id === intervalProgress?.exit);
  const selectedBoundaryAction = fireBoundaryActionOptions.find((option) => option.id === boundaryProgress?.action);
  const selectedBoundaryDuration = fireBoundaryDurationOptions.find((option) => option.id === boundaryProgress?.duration);
  const selectedCourageAction = fireCourageActionOptions.find((option) => option.id === courageProgress?.action);
  const selectedReadiness = fireCourageReadinessOptions.find((option) => option.id === courageProgress?.readiness);
  const selectedTransformationAction = fireTransformationActionOptions.find((option) => option.id === transformationProgress?.action);
  const selectedTransformationDecision = fireTransformationDecisionOptions.find((option) => option.id === transformationProgress?.decision);

  const missionLabel = fireProgress?.status === 'completed' ? 'Revisar a Chama Nomeada' : fireProgress ? 'Continuar O Nome da Chama' : 'Iniciar O Nome da Chama';
  const intervalLabel = intervalProgress?.status === 'completed' ? 'Revisar a Brasa do Intervalo' : intervalProgress ? 'Continuar O Instante Antes do Gesto' : 'Iniciar O Instante Antes do Gesto';
  const boundaryLabel = boundaryProgress?.status === 'completed' ? 'Revisar a Placa do Limite' : boundaryProgress ? 'Continuar O Limite que Protege' : 'Iniciar O Limite que Protege';
  const courageLabel = courageProgress?.status === 'completed' ? 'Revisar a Marca da Coragem' : courageProgress ? 'Continuar A Coragem Proporcional' : 'Iniciar A Coragem Proporcional';
  const transformationLabel = transformationProgress?.status === 'completed' ? 'Revisar o Metal Transformado' : transformationProgress ? 'Continuar O que Precisa Ser Transformado' : 'Iniciar O que Precisa Ser Transformado';

  return <div className="page page--fire"><PageHeader eyebrow="Forja dos Elementos" title={transformationProgress?.status === 'completed' ? 'A forma recebeu destino, salvaguarda e revisão.' : courageProgress?.status === 'completed' ? 'A ação recebeu medida e possibilidade de recusa.' : boundaryProgress?.status === 'completed' ? 'O Fogo recebeu forma, duração e revisão.' : intervalProgress?.status === 'completed' ? 'A chama recebeu um intervalo antes do gesto.' : fireProgress?.status === 'completed' ? 'A primeira chama recebeu nome e medida.' : 'A chama pode ser reconhecida antes de pedir ação.'} description="O Fogo trabalha intensidade, limite, ação proporcional e transformação sem autorizar confronto ou decisões irreversíveis."/><div className="fire-foundation-grid">
    <Card className={fireProgress?.status === 'completed' ? 'fire-hero-card fire-hero-card--named' : 'fire-hero-card'}><div className="fire-hero-symbol" aria-hidden="true">{transformationProgress?.status === 'completed' ? <Hammer/> : courageProgress?.status === 'completed' ? <BadgeCheck/> : boundaryProgress?.status === 'completed' ? <Shield/> : <Flame/>}</div><div><p className="eyebrow">Estado da Forja</p><h2>{transformationProgress?.status === 'completed' ? 'Metal Transformado criado' : courageProgress?.status === 'completed' ? 'Marca da Coragem criada' : boundaryProgress?.status === 'completed' ? 'Placa do Limite criada' : intervalProgress?.status === 'completed' ? 'Brasa do Intervalo criada' : fireProgress?.status === 'completed' ? 'Chama Nomeada criada' : 'Primeira missão disponível'}</h2><p>{transformationProgress?.status === 'completed' ? 'Cinco componentes registram reconhecimento, intervalo, limite, coragem proporcional e transformação fictícia. O capítulo ainda não está concluído.' : 'Cada componente permanece separado e revisável.'}</p></div></Card>
    <Card title={fireFoundationBiblicalUnit.title} eyebrow={fireFoundationBiblicalUnit.reference}><blockquote>{fireFoundationBiblicalUnit.principle}</blockquote><p>{fireFoundationBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>Fonte bíblica como núcleo editorial. As demais camadas são opcionais.</span></div></Card>
    <Card title="O Nome da Chama" eyebrow="Primeira missão"><Button onClick={() => navigate('/mission/name-the-flame')}>{missionLabel} <ArrowRight size={18}/></Button></Card>
    {fireProgress?.status === 'completed' && <Card title="O Instante Antes do Gesto" eyebrow="Segunda missão"><Button onClick={() => navigate('/mission/before-the-gesture')}>{intervalLabel} <Clock3 size={18}/></Button></Card>}
    {intervalProgress?.status === 'completed' && <Card title="O Limite que Protege" eyebrow="Terceira missão"><Button onClick={() => navigate('/mission/limit-that-protects')}>{boundaryLabel} <Shield size={18}/></Button></Card>}
    {boundaryProgress?.status === 'completed' && <Card title="A Coragem Proporcional" eyebrow="Quarta missão"><Button onClick={() => navigate('/mission/proportional-courage')}>{courageLabel} <BadgeCheck size={18}/></Button></Card>}
    {courageProgress?.status === 'completed' && <Card title="O que Precisa Ser Transformado" eyebrow="Quinta missão"><p>Compare destinos fictícios e escolha uma intervenção pequena, reversível e revisável.</p><Button onClick={() => navigate('/mission/what-needs-transformation')}>{transformationLabel} <Hammer size={18}/></Button></Card>}
    {fireProgress?.status === 'completed' && <Card title="Chama Nomeada" eyebrow="Primeiro componente"><div className="fire-component-summary"><CheckCircle2/><div><strong>{selectedEmotionLabels.length ? selectedEmotionLabels.join(', ') : 'Check-in recusado'}</strong><p>{selectedAction?.label}</p></div></div></Card>}
    {intervalProgress?.status === 'completed' && <Card title="Brasa do Intervalo" eyebrow="Segundo componente"><div className="fire-component-summary"><Clock3/><div><strong>{selectedInterval?.label}</strong><p>{selectedExit?.label}</p></div></div></Card>}
    {boundaryProgress?.status === 'completed' && <Card title="Placa do Limite" eyebrow="Terceiro componente"><div className="fire-component-summary"><Shield/><div><strong>{selectedBoundaryAction?.label}</strong><p>{selectedBoundaryDuration?.label}</p></div></div></Card>}
    {courageProgress?.status === 'completed' && <Card title="Marca da Coragem Proporcional" eyebrow="Quarto componente"><div className="fire-component-summary"><BadgeCheck/><div><strong>{selectedCourageAction?.label}</strong><p>{selectedReadiness?.label}</p></div></div></Card>}
    {transformationProgress?.status === 'completed' && <Card title="Metal Transformado" eyebrow="Quinto componente"><div className="fire-component-summary"><Hammer/><div><strong>{selectedTransformationDecision?.label}</strong><p>{selectedTransformationAction?.label}</p></div></div><p className="field-help">O Metal não representa decisão pessoal ou transformação garantida.</p></Card>}
    <Card title="Limites da Forja" eyebrow="Segurança"><div className="safety-summary"><ShieldCheck/><p>O Athanor não orienta confronto, ruptura, abandono de tratamento, gasto financeiro ou decisão irreversível.</p></div><Button variant="ghost" onClick={() => navigate('/safety?source=fire')}>Abrir apoio direto</Button></Card>
  </div></div>;
}
