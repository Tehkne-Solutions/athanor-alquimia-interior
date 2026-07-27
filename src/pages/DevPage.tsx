import { RotateCcw, TestTube2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';
import { useContinuousCollectionStore } from '../state/useContinuousCollectionStore';
import { useContinuousCycleStore } from '../state/useContinuousCycleStore';
import { useContinuousJourneyStore } from '../state/useContinuousJourneyStore';
import { useContinuousThemeCycleStore } from '../state/useContinuousThemeCycleStore';
import { useContinuousTrailStore } from '../state/useContinuousTrailStore';
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
import { useSpiritCenterStore } from '../state/useSpiritCenterStore';
import { useSpiritChapterStore } from '../state/useSpiritChapterStore';
import { useSpiritCouncilStore } from '../state/useSpiritCouncilStore';
import { useSpiritDecisionStore } from '../state/useSpiritDecisionStore';
import { useSpiritOrbStore } from '../state/useSpiritOrbStore';
import { useSpiritReturnStore } from '../state/useSpiritReturnStore';
import { useSpiritThreadStore } from '../state/useSpiritThreadStore';
import { useWaterChaliceStore } from '../state/useWaterChaliceStore';
import { useWaterChapterStore } from '../state/useWaterChapterStore';
import { useWaterLamentStore } from '../state/useWaterLamentStore';
import { useWaterMemoryStore } from '../state/useWaterMemoryStore';
import { useWaterTrustStore } from '../state/useWaterTrustStore';

export function DevPage() {
  const navigate = useNavigate();
  const resetAll = useAthanorStore((state) => state.resetAll);
  const resetLament = useWaterLamentStore((state) => state.reset);
  const resetMemory = useWaterMemoryStore((state) => state.reset);
  const resetTrust = useWaterTrustStore((state) => state.reset);
  const resetChalice = useWaterChaliceStore((state) => state.reset);
  const resetWaterChapter = useWaterChapterStore((state) => state.reset);
  const resetFireMission = useFireMissionStore((state) => state.reset);
  const resetFireInterval = useFireIntervalStore((state) => state.reset);
  const resetFireBoundary = useFireBoundaryStore((state) => state.reset);
  const resetFireCourage = useFireCourageStore((state) => state.reset);
  const resetFireTransformation = useFireTransformationStore((state) => state.reset);
  const resetFireShield = useFireShieldStore((state) => state.reset);
  const resetFireChapter = useFireChapterStore((state) => state.reset);
  const resetEarthBody = useEarthBodyStore((state) => state.reset);
  const resetEarthWork = useEarthWorkStore((state) => state.reset);
  const resetEarthResources = useEarthResourcesStore((state) => state.reset);
  const resetEarthRhythm = useEarthRhythmStore((state) => state.reset);
  const resetEarthOrder = useEarthOrderStore((state) => state.reset);
  const resetEarthStone = useEarthStoneStore((state) => state.reset);
  const resetEarthChapter = useEarthChapterStore((state) => state.reset);
  const resetSpiritThread = useSpiritThreadStore((state) => state.reset);
  const resetSpiritCenter = useSpiritCenterStore((state) => state.reset);
  const resetSpiritCouncil = useSpiritCouncilStore((state) => state.reset);
  const resetSpiritDecision = useSpiritDecisionStore((state) => state.reset);
  const resetSpiritReturn = useSpiritReturnStore((state) => state.reset);
  const resetSpiritOrb = useSpiritOrbStore((state) => state.reset);
  const resetSpiritChapter = useSpiritChapterStore((state) => state.reset);
  const resetContinuousJourney = useContinuousJourneyStore((state) => state.reset);
  const resetContinuousCycles = useContinuousCycleStore((state) => state.reset);
  const resetContinuousTrails = useContinuousTrailStore((state) => state.reset);
  const resetContinuousThemeCycles = useContinuousThemeCycleStore((state) => state.reset);
  const resetContinuousCollections = useContinuousCollectionStore((state) => state.reset);
  const lamentProgress = useWaterLamentStore((state) => state.progress);
  const memoryProgress = useWaterMemoryStore((state) => state.progress);
  const trustProgress = useWaterTrustStore((state) => state.progress);
  const chaliceProgress = useWaterChaliceStore((state) => state.progress);
  const waterChapterProgress = useWaterChapterStore((state) => state.progress);
  const fireProgress = useFireMissionStore((state) => state.progress);
  const fireIntervalProgress = useFireIntervalStore((state) => state.progress);
  const fireBoundaryProgress = useFireBoundaryStore((state) => state.progress);
  const fireCourageProgress = useFireCourageStore((state) => state.progress);
  const fireTransformationProgress = useFireTransformationStore((state) => state.progress);
  const fireShieldProgress = useFireShieldStore((state) => state.progress);
  const fireChapterProgress = useFireChapterStore((state) => state.progress);
  const earthBodyProgress = useEarthBodyStore((state) => state.progress);
  const earthWorkProgress = useEarthWorkStore((state) => state.progress);
  const earthResourcesProgress = useEarthResourcesStore((state) => state.progress);
  const earthRhythmProgress = useEarthRhythmStore((state) => state.progress);
  const earthOrderProgress = useEarthOrderStore((state) => state.progress);
  const earthStoneProgress = useEarthStoneStore((state) => state.progress);
  const earthChapterProgress = useEarthChapterStore((state) => state.progress);
  const spiritThreadProgress = useSpiritThreadStore((state) => state.progress);
  const spiritCenterProgress = useSpiritCenterStore((state) => state.progress);
  const spiritCouncilProgress = useSpiritCouncilStore((state) => state.progress);
  const spiritDecisionProgress = useSpiritDecisionStore((state) => state.progress);
  const spiritReturnProgress = useSpiritReturnStore((state) => state.progress);
  const spiritOrbProgress = useSpiritOrbStore((state) => state.progress);
  const spiritChapterProgress = useSpiritChapterStore((state) => state.progress);
  const continuousProgress = useContinuousJourneyStore((state) => state.progress);
  const continuousCycleProgress = useContinuousCycleStore((state) => state.progress);
  const continuousTrailProgress = useContinuousTrailStore((state) => state.progress);
  const continuousThemeCycleProgress = useContinuousThemeCycleStore((state) => state.progress);
  const continuousCollectionRegistry = useContinuousCollectionStore((state) => state.registry);
  const state = useAthanorStore();

  const reset = async () => {
    await resetAll();
    resetLament();
    resetMemory();
    resetTrust();
    resetChalice();
    resetWaterChapter();
    resetFireMission();
    resetFireInterval();
    resetFireBoundary();
    resetFireCourage();
    resetFireTransformation();
    resetFireShield();
    resetFireChapter();
    resetEarthBody();
    resetEarthWork();
    resetEarthResources();
    resetEarthRhythm();
    resetEarthOrder();
    resetEarthStone();
    resetEarthChapter();
    resetSpiritThread();
    resetSpiritCenter();
    resetSpiritCouncil();
    resetSpiritDecision();
    resetSpiritReturn();
    resetSpiritOrb();
    resetSpiritChapter();
    resetContinuousJourney();
    resetContinuousCycles();
    resetContinuousTrails();
    resetContinuousThemeCycles();
    resetContinuousCollections();
    navigate('/welcome');
  };

  return <div className="page"><PageHeader eyebrow="Somente desenvolvimento" title="Painel de QA" description="Ferramentas para fixtures, reset e inspeção do vertical slice." action={<TestTube2/>}/><div className="content-grid"><Card title="Estado atual"><pre className="state-preview">{JSON.stringify({
    onboardingCompleted: state.onboardingCompleted,
    character: state.character?.name,
    workLevel: state.character?.workLevel,
    temple: state.temple?.theme,
    rooms: state.temple?.rooms.map((room) => ({ id: room.roomId, name: room.name, status: room.status, progress: room.restorationProgress })),
    mission: state.activeMission?.status,
    water: state.waterJourney?.status,
    lament: lamentProgress?.status,
    memory: memoryProgress?.status,
    trust: trustProgress?.status,
    chalice: chaliceProgress ? { status: chaliceProgress.status, created: chaliceProgress.chaliceCreated, positioned: chaliceProgress.positioned } : undefined,
    waterChapter: waterChapterProgress ? { status: waterChapterProgress.status, cycleId: waterChapterProgress.cycleId, destinations: waterChapterProgress.destinations } : undefined,
    fireMission: fireProgress ? { status: fireProgress.status, namedFlameCreated: fireProgress.namedFlameCreated } : undefined,
    fireInterval: fireIntervalProgress ? { status: fireIntervalProgress.status, intervalEmberCreated: fireIntervalProgress.intervalEmberCreated } : undefined,
    fireBoundary: fireBoundaryProgress ? { status: fireBoundaryProgress.status, boundaryPlateCreated: fireBoundaryProgress.boundaryPlateCreated } : undefined,
    fireCourage: fireCourageProgress ? { status: fireCourageProgress.status, proportionalCourageMarkCreated: fireCourageProgress.proportionalCourageMarkCreated } : undefined,
    fireTransformation: fireTransformationProgress ? { status: fireTransformationProgress.status, transformedMetalCreated: fireTransformationProgress.transformedMetalCreated } : undefined,
    fireShield: fireShieldProgress ? { status: fireShieldProgress.status, shieldCreated: fireShieldProgress.shieldCreated, positioned: fireShieldProgress.positioned } : undefined,
    fireChapter: fireChapterProgress ? { status: fireChapterProgress.status, cycleId: fireChapterProgress.cycleId, destinations: fireChapterProgress.destinations } : undefined,
    earthBody: earthBodyProgress ? { status: earthBodyProgress.status, skipped: earthBodyProgress.checkInSkipped, resources: earthBodyProgress.resources, action: earthBodyProgress.action, bodyPresenceMarkCreated: earthBodyProgress.bodyPresenceMarkCreated } : undefined,
    earthWork: earthWorkProgress ? { status: earthWorkProgress.status, context: earthWorkProgress.context, capacity: earthWorkProgress.capacity, timeWindow: earthWorkProgress.timeWindow, smallStep: earthWorkProgress.smallStep, decision: earthWorkProgress.decision, firstStepSeedCreated: earthWorkProgress.firstStepSeedCreated } : undefined,
    earthResources: earthResourcesProgress ? { status: earthResourcesProgress.status, availability: earthResourcesProgress.availability, substitution: earthResourcesProgress.substitution, scope: earthResourcesProgress.scope, decision: earthResourcesProgress.decision, possibleResourcesBasketCreated: earthResourcesProgress.possibleResourcesBasketCreated } : undefined,
    earthRhythm: earthRhythmProgress ? { status: earthRhythmProgress.status, frequency: earthRhythmProgress.frequency, actionUnit: earthRhythmProgress.actionUnit, rest: earthRhythmProgress.rest, resourceMode: earthRhythmProgress.resourceMode, resume: earthRhythmProgress.resume, decision: earthRhythmProgress.decision, rhythmCompassCreated: earthRhythmProgress.rhythmCompassCreated } : undefined,
    earthOrder: earthOrderProgress ? { status: earthOrderProgress.status, activeLimit: earthOrderProgress.activeLimit, itemStates: earthOrderProgress.itemStates, visibleOrder: earthOrderProgress.visibleOrder, priority: earthOrderProgress.priority, reviewRule: earthOrderProgress.reviewRule, decision: earthOrderProgress.decision, possibleOrderMapCreated: earthOrderProgress.possibleOrderMapCreated } : undefined,
    earthStone: earthStoneProgress ? { status: earthStoneProgress.status, function: earthStoneProgress.function, smallStep: earthStoneProgress.smallStep, resource: earthStoneProgress.resource, rhythm: earthStoneProgress.rhythm, activeLimit: earthStoneProgress.activeLimit, reviewWindow: earthStoneProgress.reviewWindow, stoneCreated: earthStoneProgress.stoneCreated, positioned: earthStoneProgress.positioned } : undefined,
    earthChapter: earthChapterProgress ? { status: earthChapterProgress.status, cycleId: earthChapterProgress.cycleId, destinations: earthChapterProgress.destinations } : undefined,
    spiritThread: spiritThreadProgress ? { status: spiritThreadProgress.status, possibleSynthesisThreadCreated: spiritThreadProgress.possibleSynthesisThreadCreated } : undefined,
    spiritCenter: spiritCenterProgress ? { status: spiritCenterProgress.status, provisionalCenterKnotCreated: spiritCenterProgress.provisionalCenterKnotCreated } : undefined,
    spiritCouncil: spiritCouncilProgress ? { status: spiritCouncilProgress.status, openCouncilSealCreated: spiritCouncilProgress.openCouncilSealCreated } : undefined,
    spiritDecision: spiritDecisionProgress ? { status: spiritDecisionProgress.status, revisableDecisionMarkCreated: spiritDecisionProgress.revisableDecisionMarkCreated } : undefined,
    spiritReturn: spiritReturnProgress ? { status: spiritReturnProgress.status, possibleReturnKeyCreated: spiritReturnProgress.possibleReturnKeyCreated } : undefined,
    spiritOrb: spiritOrbProgress ? { status: spiritOrbProgress.status, orbCreated: spiritOrbProgress.orbCreated, positioned: spiritOrbProgress.positioned } : undefined,
    spiritChapter: spiritChapterProgress ? { status: spiritChapterProgress.status, cycleId: spiritChapterProgress.cycleId, destinations: spiritChapterProgress.destinations } : undefined,
    continuousJourney: continuousProgress ? { sourceSpiritCycleId: continuousProgress.sourceSpiritCycleId, records: continuousProgress.records } : undefined,
    continuousCycles: continuousCycleProgress.instances.map((instance) => ({ id: instance.id, sourceRecordId: instance.sourceRecordId, startPoint: instance.startPoint, status: instance.status, comparison: instance.comparison })),
    continuousTrails: continuousTrailProgress.trails.map((trail) => ({
      id: trail.id,
      sourceCycleInstanceId: trail.sourceCycleInstanceId,
      startPoint: trail.startPoint,
      status: trail.status,
      currentStage: trail.currentStage,
      practiceId: trail.practiceId,
      noPractice: trail.noPractice,
      variantId: trail.contentVariantId,
      variantCatalogVersion: trail.catalogVersion,
      variantRotationCount: trail.variantRotationCount,
      variantHistory: trail.variantHistory,
      themeId: trail.themeId,
      noTheme: trail.noTheme,
      themeCatalogVersion: trail.themeCatalogVersion,
      themeRotationCount: trail.themeRotationCount,
      themeHistory: trail.themeHistory,
      traceCreated: trail.continuousTrailTraceCreated
    })),
    continuousThemeCycles: continuousThemeCycleProgress.instances.map((instance) => ({
      id: instance.id,
      sourceTrailId: instance.sourceTrailId,
      packageId: instance.packageId,
      catalogVersion: instance.catalogVersion,
      depth: instance.depth,
      status: instance.status,
      currentPassageIndex: instance.currentPassageIndex,
      passages: instance.passages.map((passage) => ({ id: passage.id, stage: passage.stage, result: passage.result })),
      endedEarly: instance.endedEarly
    })),
    continuousCollections: continuousCollectionRegistry.collections.map((collection) => ({
      id: collection.id,
      templateId: collection.templateId,
      label: collection.label,
      status: collection.status,
      items: collection.items.map((reference) => ({
        key: reference.key,
        source: reference.source,
        linked: reference.item.linked,
        kind: reference.item.kind,
        itemId: reference.item.id
      }))
    })),
    inventory: state.inventory.map((item) => item.name)
  }, null, 2)}</pre></Card><Card title="Ações"><Button variant="danger" onClick={reset}><RotateCcw size={18}/> Resetar todo o estado</Button></Card></div></div>;
}
