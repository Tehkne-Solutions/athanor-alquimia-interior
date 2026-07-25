import { HeartHandshake, LogOut, Phone, ShieldAlert } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';

export function SafetyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromLament = searchParams.get('source') === 'lament';

  return (
    <div className="page page--safety">
      <PageHeader
        eyebrow="Apoio direto"
        title="Sua segurança vem antes da narrativa."
        description={fromLament
          ? 'O fluxo de lamento foi interrompido. Nenhum símbolo, recompensa ou interpretação será usado nesta tela.'
          : 'O fluxo simbólico foi interrompido. Em uma situação de risco imediato, procure serviços de emergência locais ou alguém de confiança.'}
      />
      <div className="content-grid">
        <Card title="Ação imediata">
          <div className="safety-action"><Phone/><p>Em risco imediato, contate o serviço de emergência da sua região ou vá para um local seguro e acompanhado.</p></div>
        </Card>
        <Card title="Apoio humano">
          <div className="safety-action"><HeartHandshake/><p>Considere falar agora com uma pessoa de confiança ou profissional qualificado. Você não precisa explicar tudo para pedir presença.</p></div>
        </Card>
        <Card title="Limite do produto">
          <div className="safety-action"><ShieldAlert/><p>O Athanor não interpreta crises por símbolos, cartas, passagens ou crafting. A verificação local de texto é limitada e pode falhar.</p></div>
        </Card>
        <Card title="Sair deste fluxo" eyebrow="Sem perda de progresso">
          <p>Você pode encerrar esta etapa sem criar item, missão ou registro adicional.</p>
          <Button variant="secondary" onClick={() => navigate('/')}><LogOut size={18}/> Sair para o início</Button>
        </Card>
      </div>
    </div>
  );
}
