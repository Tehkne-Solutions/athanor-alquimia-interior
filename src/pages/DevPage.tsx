import { RotateCcw, TestTube2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';
import { useWaterChaliceStore } from '../state/useWaterChaliceStore';
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
  const lamentProgress = useWaterLamentStore((state) => state.progress);
  const memoryProgress = useWaterMemoryStore((state) => state.progress);
  const trustProgress = useWaterTrustStore((state) => state.progress);
  const chaliceProgress = useWaterChaliceStore((state) => state.progress);
  const state = useAthanorStore();
  const reset = async () => {
    await resetAll();
    resetLament();
    resetMemory();
    resetTrust();
    resetChalice();
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
            temple: state.temple?.theme,
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
            inventory: state.inventory.map((item) => item.name)
          }, null, 2)}</pre>
        </Card>
        <Card title="Ações"><Button variant="danger" onClick={reset}><RotateCcw size={18}/> Resetar todo o estado</Button></Card>
      </div>
    </div>
  );
}
