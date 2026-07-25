import { RotateCcw, TestTube2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';

export function DevPage() {
  const navigate = useNavigate();
  const resetAll = useAthanorStore((state) => state.resetAll);
  const state = useAthanorStore();
  const reset = async () => { await resetAll(); navigate('/welcome'); };
  return <div className="page"><PageHeader eyebrow="Somente desenvolvimento" title="Painel de QA" description="Ferramentas para fixtures, reset e inspeção do vertical slice." action={<TestTube2/>}/><div className="content-grid"><Card title="Estado atual"><pre className="state-preview">{JSON.stringify({onboardingCompleted:state.onboardingCompleted,character:state.character?.name,temple:state.temple?.theme,mission:state.activeMission?.status,inventory:state.inventory.map((item)=>item.name)},null,2)}</pre></Card><Card title="Ações"><Button variant="danger" onClick={reset}><RotateCcw size={18}/> Resetar todo o estado</Button></Card></div></div>;
}
