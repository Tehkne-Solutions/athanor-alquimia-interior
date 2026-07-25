import { RotateCcw, TestTube2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';
import { useFireMissionStore } from '../state/useFireMissionStore';
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
  const lamentProgress = useWaterLamentStore((state) => state.progress);
  const memoryProgress = useWaterMemoryStore((state) => state.progress);
  const trustProgress = useWaterTrustStore((state) => state.progress);
  const chaliceProgress = useWaterChaliceStore((state) => state.progress);
  const waterChapterProgress = useWaterChapterStore((state) => state.progress);
  const fireProgress = useFireMissionStore((state) => state.progress);
  const state = useAthanorStore();

  const reset = async () => {
    await resetAll();
    resetLament();
    resetMemory();
    resetTrust();
    resetChalice();
    resetWaterChapter();
    resetFireMission();
    navigate('/welcome');
  };

  return (
    <div className="page">
      <PageHeader eyebrow="Somente desenvolvimento" title="Painel de QA" description="Ferramentas para fixtures, reset e inspeção do vertical slice." action={<TestTube2/>}/>
      <div className="content-grid">
        <Card title="Estado atual">
          <pre className="state-preview">{JSON.stringify({
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
            chalice: chaliceProgress ? {
              status: chaliceProgress.status,
              created: chaliceProgress.chaliceCreated,
              positioned: chaliceProgress.positioned
            } : undefined,
            waterChapter: waterChapterProgress ? {
              status: waterChapterProgress.status,
              cycleId: waterChapterProgress.cycleId,
              destinations: waterChapterProgress.destinations
            } : undefined,
            fireMission: fireProgress ? {
              status: fireProgress.status,
              emotions: fireProgress.emotions,
              intensity: fireProgress.intensity,
              namedFlameCreated: fireProgress.namedFlameCreated,
              action: fireProgress.action
            } : undefined,
            inventory: state.inventory.map((item) => item.name)
          }, null, 2)}</pre>
        </Card>
        <Card title="Ações"><Button variant="danger" onClick={reset}><RotateCcw size={18}/> Resetar todo o estado</Button></Card>
      </div>
    </div>
  );
}
