import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAthanorStore } from '../state/useAthanorStore';

const limits = [
  'O Athanor não realiza diagnósticos e não substitui apoio profissional.',
  'Status fisiológicos e emocionais são percepções registradas pelo próprio usuário.',
  'Símbolos, cartas e mutações não determinam o futuro.',
  'As conexões entre tradições são classificadas e podem ser desativadas.',
  'Toda ação, prática ou registro pode ser recusado, pausado ou substituído.'
];

export function LimitsPage() {
  const navigate = useNavigate();
  const acceptLimits = useAthanorStore((state) => state.acceptLimits);
  const accept = () => { acceptLimits(); navigate('/character/create'); };
  return (
    <main className="standalone-page">
      <Card className="legal-card">
        <div className="legal-card__icon"><ShieldCheck size={32} /></div>
        <p className="eyebrow">Antes de entrar</p>
        <h1>Limites claros protegem a experiência.</h1>
        <p>O Athanor é um jogo contemplativo de desenvolvimento pessoal. Seu conteúdo simbólico serve à reflexão e ao gameplay, não a diagnósticos, previsões ou ordens.</p>
        <ul className="check-list">
          {limits.map((limit) => <li key={limit}><CheckCircle2 size={19} /><span>{limit}</span></li>)}
        </ul>
        <Button fullWidth onClick={accept}>Compreendi e desejo continuar</Button>
        <p className="privacy-note">Seus dados permanecem neste dispositivo por padrão.</p>
      </Card>
    </main>
  );
}
