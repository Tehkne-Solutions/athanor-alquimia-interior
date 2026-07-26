import { RotateCcw, TestTube2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthBodyStore } from '../state/useEarthBodyStore';
import { useEarthResourcesStore } from '../state/useEarthResourcesStore';
import { useEarthRhythmStore } from '../state/useEarthRhythmStore';
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
    navigate('/welcome');
  };

  return <div className="page"><PageHeader eyebrow="Somente desenvolvimento" title="Painel de QA" description="Ferramentas para fixtures, reset e inspeção do vertical slice." action={<TestTube2/>}/><div className="content-grid"><Card title="Estado atual"><pre className="state-preview">{JSON.stringify({
    onboardingCompleted: state.onboardingCompleted,
    character: state.character?.name,
    workLevel: state.character?.workLevel,
    temple: state.temple?.theme,
    rooms: state.temple?.rooms.map((room) => ({ id: room.roomId, status: room.status, progress: room.restorationProgress })),
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
    inventory: state.inventory.map((item) => item.name)
  }, null, 2)}</pre></Card><Card title="Ações"><Button variant="danger" onClick={reset}><RotateCcw size={18}/> Resetar todo o estado</Button></Card></div></div>;
}
