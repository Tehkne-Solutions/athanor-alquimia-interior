import { BookOpenText, Flame, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { fireFoundationBiblicalUnit } from '../content/fireFoundation';
import { useAthanorStore } from '../state/useAthanorStore';

export function ForgePage() {
  const navigate = useNavigate();
  const forge = useAthanorStore((state) => state.temple?.rooms.find((room) => room.roomId === 'forge'));
  const available = Boolean(forge && forge.status !== 'dormant' && forge.status !== 'hidden');

  if (!available) {
    return (
      <div className="page page--fire">
        <PageHeader eyebrow="Capítulo do Fogo" title="A Forja ainda está adormecida." description="Conclua a revisão geral da Água. O próximo capítulo não é aberto apenas pela criação do Cálice." />
        <Card title="Caminho ainda fechado" eyebrow="Dependência da jornada">
          <div className="fire-lock"><LockKeyhole/><p>Integre e posicione o Cálice, escolha o destino das quatro práticas e conclua o primeiro ciclo da Água.</p></div>
          <Button onClick={() => navigate('/review/water-chapter')}>Revisar o capítulo da Água</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="page page--fire">
      <PageHeader eyebrow="Forja dos Elementos" title="A chama ainda não pede ação." description="A fundação técnica do Fogo está disponível. A primeira missão completa será implementada na próxima fase." />
      <div className="fire-foundation-grid">
        <Card className="fire-hero-card">
          <div className="fire-hero-symbol" aria-hidden="true"><Flame/></div>
          <div>
            <p className="eyebrow">Estado da Forja</p>
            <h2>Fundação disponível</h2>
            <p>A sala reconhece o ciclo integrado da Água e prepara a missão O Nome da Chama.</p>
          </div>
        </Card>

        <Card title={fireFoundationBiblicalUnit.title} eyebrow={fireFoundationBiblicalUnit.reference}>
          <blockquote>{fireFoundationBiblicalUnit.principle}</blockquote>
          <p>{fireFoundationBiblicalUnit.context}</p>
          <div className="provenance-inline"><BookOpenText size={17}/><span>Fonte bíblica como núcleo editorial. Gevurah e os demais símbolos serão camadas opcionais e identificadas.</span></div>
        </Card>

        <Card title="O Nome da Chama" eyebrow="Próxima missão">
          <p>A futura experiência deverá distinguir emoção, intensidade, impulso, necessidade e ação possível.</p>
          <ul className="simple-list">
            <li>ira e coragem não receberão pontuação moral;</li>
            <li>intensidade não será tratada como risco clínico;</li>
            <li>nenhuma emoção autorizará confronto ou violência;</li>
            <li>a pausa e a recusa permanecerão disponíveis.</li>
          </ul>
          <Button disabled>Missão em preparação</Button>
        </Card>

        <Card title="Limites da Forja" eyebrow="Segurança">
          <div className="safety-summary"><ShieldCheck/><p>O Athanor não incentiva confronto perigoso, retaliação ou permanência em situação de risco. Estados críticos interrompem o simbolismo.</p></div>
        </Card>
      </div>
    </div>
  );
}
