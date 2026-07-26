import { Award, Circle, Clock3, Compass, Droplets, Flame, Footprints, Gem, GitBranch, ListChecks, Map, RotateCcw, Settings2, Shield, Sparkles, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthBodyStore } from '../state/useEarthBodyStore';
import { useEarthChapterStore } from '../state/useEarthChapterStore';
import { useEarthOrderStore } from '../state/useEarthOrderStore';
import { useEarthResourcesStore } from '../state/useEarthResourcesStore';
import { useEarthRhythmStore } from '../state/useEarthRhythmStore';
import { useEarthStoneStore } from '../state/useEarthStoneStore';
import { useEarthWorkStore } from '../state/useEarthWorkStore';
import { useFireChapterStore } from '../state/useFireChapterStore';
import { useSpiritCenterStore } from '../state/useSpiritCenterStore';
import { useSpiritCouncilStore } from '../state/useSpiritCouncilStore';
import { useSpiritDecisionStore } from '../state/useSpiritDecisionStore';
import { useSpiritReturnStore } from '../state/useSpiritReturnStore';
import { useSpiritThreadStore } from '../state/useSpiritThreadStore';
import { useWaterChapterStore } from '../state/useWaterChapterStore';

const levelLabels = {
  foundation: 'Fundação',
  first_fire: 'Primeiro Fogo',
  form: 'Forma',
  construction: 'Construção',
  integration: 'Integração',
  new_work: 'Nova Obra'
} as const;

const levelPositions = {
  foundation: { index: 1, width: '12%' },
  first_fire: { index: 2, width: '32%' },
  form: { index: 3, width: '48%' },
  construction: { index: 4, width: '66%' },
  integration: { index: 5, width: '84%' },
  new_work: { index: 6, width: '100%' }
} as const;

export function CharacterPage() {
  const navigate = useNavigate();
  const character = useAthanorStore((state) => state.character);
  const inventory = useAthanorStore((state) => state.inventory);
  const reviews = useAthanorStore((state) => state.reviews ?? []);
  const waterChapter = useWaterChapterStore((state) => state.progress);
  const fireChapter = useFireChapterStore((state) => state.progress);
  const rawEarthBody = useEarthBodyStore((state) => state.progress);
  const rawEarthWork = useEarthWorkStore((state) => state.progress);
  const rawEarthResources = useEarthResourcesStore((state) => state.progress);
  const rawEarthRhythm = useEarthRhythmStore((state) => state.progress);
  const rawEarthOrder = useEarthOrderStore((state) => state.progress);
  const rawEarthStone = useEarthStoneStore((state) => state.progress);
  const rawEarthChapter = useEarthChapterStore((state) => state.progress);
  const rawSpiritThread = useSpiritThreadStore((state) => state.progress);
  const rawSpiritCenter = useSpiritCenterStore((state) => state.progress);
  const rawSpiritCouncil = useSpiritCouncilStore((state) => state.progress);
  const rawSpiritDecision = useSpiritDecisionStore((state) => state.progress);
  const rawSpiritReturn = useSpiritReturnStore((state) => state.progress);

  if (!character) return null;

  const integrated = inventory.some((item) => item.lifecycle === 'integrated');
  const waterCompleted = waterChapter?.status === 'completed';
  const fireCompleted = fireChapter?.status === 'completed';
  const sourceFireCycleId = fireChapter?.cycleId ?? fireChapter?.completedAt;
  const earthBodyCompleted = Boolean(sourceFireCycleId && rawEarthBody?.sourceFireCycleId === sourceFireCycleId && rawEarthBody.status === 'completed' && rawEarthBody.bodyPresenceMarkCreated);
  const sourceBodyPresenceMarkId = earthBodyCompleted && rawEarthBody ? rawEarthBody.completedAt ?? `${rawEarthBody.sourceFireCycleId}:body-presence-mark` : undefined;
  const earthWorkCompleted = Boolean(sourceBodyPresenceMarkId && rawEarthWork?.sourceBodyPresenceMarkId === sourceBodyPresenceMarkId && rawEarthWork.status === 'completed' && rawEarthWork.firstStepSeedCreated);
  const sourceFirstStepSeedId = earthWorkCompleted && rawEarthWork ? rawEarthWork.completedAt ?? `${rawEarthWork.sourceBodyPresenceMarkId}:first-step-seed` : undefined;
  const earthResourcesCompleted = Boolean(sourceFirstStepSeedId && rawEarthResources?.sourceFirstStepSeedId === sourceFirstStepSeedId && rawEarthResources.status === 'completed' && rawEarthResources.possibleResourcesBasketCreated);
  const sourceResourceBasketId = earthResourcesCompleted && rawEarthResources ? rawEarthResources.completedAt ?? `${rawEarthResources.sourceFirstStepSeedId}:resource-basket` : undefined;
  const earthRhythmCompleted = Boolean(sourceResourceBasketId && rawEarthRhythm?.sourceResourceBasketId === sourceResourceBasketId && rawEarthRhythm.status === 'completed' && rawEarthRhythm.rhythmCompassCreated);
  const sourceRhythmCompassId = earthRhythmCompleted && rawEarthRhythm ? rawEarthRhythm.completedAt ?? `${rawEarthRhythm.sourceResourceBasketId}:rhythm-compass` : undefined;
  const earthOrderCompleted = Boolean(sourceRhythmCompassId && rawEarthOrder?.sourceRhythmCompassId === sourceRhythmCompassId && rawEarthOrder.status === 'completed' && rawEarthOrder.possibleOrderMapCreated);
  const sourceOrderMapId = earthOrderCompleted && rawEarthOrder ? rawEarthOrder.completedAt ?? `${rawEarthOrder.sourceRhythmCompassId}:order-map` : undefined;
  const earthStoneCreated = Boolean(sourceOrderMapId && rawEarthStone?.sourceOrderMapId === sourceOrderMapId && rawEarthStone.stoneCreated);
  const sourceStoneId = earthStoneCreated && rawEarthStone ? rawEarthStone.craftedAt ?? `${rawEarthStone.sourceOrderMapId}:stone` : undefined;
  const earthCompleted = Boolean(sourceStoneId && rawEarthChapter?.sourceStoneId === sourceStoneId && rawEarthChapter.status === 'completed');
  const sourceEarthCycleId = rawEarthChapter?.cycleId ?? rawEarthChapter?.completedAt;
  const spiritThreadCompleted = Boolean(sourceEarthCycleId && rawSpiritThread?.sourceEarthCycleId === sourceEarthCycleId && rawSpiritThread.status === 'completed' && rawSpiritThread.possibleSynthesisThreadCreated);
  const sourceThreadId = spiritThreadCompleted && rawSpiritThread ? rawSpiritThread.completedAt ?? `${rawSpiritThread.sourceEarthCycleId}:possible-synthesis-thread` : undefined;
  const spiritCenterCompleted = Boolean(sourceThreadId && rawSpiritCenter?.sourceThreadId === sourceThreadId && rawSpiritCenter.status === 'completed' && rawSpiritCenter.provisionalCenterKnotCreated);
  const sourceCenterId = spiritCenterCompleted && rawSpiritCenter ? rawSpiritCenter.completedAt ?? `${rawSpiritCenter.sourceThreadId}:provisional-center-knot` : undefined;
  const spiritCouncilCompleted = Boolean(sourceCenterId && rawSpiritCouncil?.sourceCenterId === sourceCenterId && rawSpiritCouncil.status === 'completed' && rawSpiritCouncil.openCouncilSealCreated);
  const sourceCouncilId = spiritCouncilCompleted && rawSpiritCouncil ? rawSpiritCouncil.completedAt ?? `${rawSpiritCouncil.sourceCenterId}:open-council-seal` : undefined;
  const spiritDecisionCompleted = Boolean(sourceCouncilId && rawSpiritDecision?.sourceCouncilId === sourceCouncilId && rawSpiritDecision.status === 'completed' && rawSpiritDecision.revisableDecisionMarkCreated);
  const sourceDecisionId = spiritDecisionCompleted && rawSpiritDecision ? rawSpiritDecision.completedAt ?? `${rawSpiritDecision.sourceCouncilId}:revisable-decision-mark` : undefined;
  const spiritReturnCompleted = Boolean(sourceDecisionId && rawSpiritReturn?.sourceDecisionId === sourceDecisionId && rawSpiritReturn.status === 'completed' && rawSpiritReturn.possibleReturnKeyCreated);
  const level = levelPositions[character.workLevel];
  const cycleCount = reviews.length + Number(waterCompleted) + Number(fireCompleted) + Number(earthCompleted);

  return <div className="page"><PageHeader eyebrow="Ficha RPG" title={character.name} description="Status de progressão do jogo, separados de qualquer avaliação clínica ou moral." action={<Button variant="ghost" onClick={() => navigate('/settings/accessibility')}><Settings2 size={18}/> Acessibilidade</Button>}/><div className="character-sheet"><Card className="character-sheet__avatar"><CharacterAvatar character={character}/></Card><Card title="Nível da Obra" eyebrow="Progressão"><div className="stat-block"><strong>{levelLabels[character.workLevel]}</strong><span>{level.index} de 6 faixas narrativas</span></div><div className="progress-track"><span style={{width:level.width}}/></div></Card><Card title="Caminhos" eyebrow="Classes"><div className="mini-stat"><Compass/><span><strong>Classe principal</strong>{character.primaryClass}</span></div><div className="mini-stat"><Award/><span><strong>Origem</strong>{character.origin}</span></div></Card><Card title="Virtudes em prática" eyebrow="Experiências concluídas"><div className="virtue-list"><span><Sparkles/> Prudência <b>{inventory.length ? 2 : 0}</b></span><span><Shield/> Clareza <b>{integrated ? 2 : inventory.length ? 1 : 0}</b></span><span><Droplets/> Presença <b>{waterCompleted ? 4 : 0}</b></span><span><Flame/> Medida <b>{fireCompleted ? 5 : 0}</b></span><span><Footprints/> Presença corporal <b>{earthBodyCompleted ? 1 : 0}</b></span><span><Sprout/> Primeiro passo <b>{earthWorkCompleted ? 1 : 0}</b></span><span><ListChecks/> Recursos possíveis <b>{earthResourcesCompleted ? 1 : 0}</b></span><span><Clock3/> Ritmo sustentável <b>{earthRhythmCompleted ? 1 : 0}</b></span><span><Map/> Ordem possível <b>{earthOrderCompleted ? 1 : 0}</b></span><span><Gem/> Pedra do primeiro passo <b>{earthStoneCreated ? 1 : 0}</b></span><span><Sparkles/> Integração da Terra <b>{earthCompleted ? 5 : 0}</b></span><span><Sparkles/> Síntese possível <b>{spiritThreadCompleted ? 1 : 0}</b></span><span><GitBranch/> Centro provisório <b>{spiritCenterCompleted ? 1 : 0}</b></span><span><Circle/> Conselho aberto <b>{spiritCouncilCompleted ? 1 : 0}</b></span><span><GitBranch/> Decisão revisável <b>{spiritDecisionCompleted ? 1 : 0}</b></span><span><RotateCcw/> Retorno possível <b>{spiritReturnCompleted ? 1 : 0}</b></span></div><p className="muted">Esses números representam práticas de gameplay, não traços permanentes.</p></Card><Card title="Ciclos revisados" eyebrow="Retorno à Obra"><div className="stat-block"><strong>{cycleCount}</strong><span>{cycleCount === 1 ? 'ciclo ou revisão registrada' : 'ciclos e revisões registrados'}</span></div><p className="muted">Revisar, ajustar, repousar e arquivar contam como formas válidas de acompanhar uma jornada.</p></Card></div></div>;
}
