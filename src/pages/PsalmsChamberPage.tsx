import { ArrowRight, BookOpenText, Droplets, Feather, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { waterBiblicalUnit, waterLamentBiblicalUnit } from '../content/water';
import { useAthanorStore } from '../state/useAthanorStore';
import { useWaterLamentStore } from '../state/useWaterLamentStore';

export function PsalmsChamberPage() {
  const navigate = useNavigate();
  const temple = useAthanorStore((state) => state.temple);
  const inventory = useAthanorStore((state) => state.inventory);
  const waterJourney = useAthanorStore((state) => state.waterJourney);
  const startWaterJourney = useAthanorStore((state) => state.startWaterJourney);
  const lamentProgress = useWaterLamentStore((state) => state.progress);
  const chamber = temple?.rooms.find((room) => room.roomId === 'psalms-chamber');
  const lampIntegrated = inventory.some((item) => item.id === 'item_clear_word_lamp_v1' && item.lifecycle === 'integrated');
  const available = Boolean(lampIntegrated || (chamber && chamber.status !== 'dormant' && chamber.status !== 'hidden'));

  if (!available) {
    return (
      <div className="page page--water">
        <PageHeader
          eyebrow="Capítulo da Água"
          title="A Câmara dos Salmos ainda repousa."
          description="Integre primeiro o ciclo da Lâmpada da Palavra Clara. O Templo não abre uma nova jornada apenas pela criação de um item."
        />
        <Card title="Caminho ainda fechado" eyebrow="Dependência de jornada">
          <div className="water-lock"><LockKeyhole aria-hidden="true"/><p>Retorne à Biblioteca, revise a ação e escolha integrar, ajustar ou colocar o ciclo em repouso.</p></div>
          <Button onClick={() => navigate('/temple')}>Voltar ao Átrio</Button>
        </Card>
      </div>
    );
  }

  const namingCompleted = Boolean(waterJourney?.namedDropCreated);
  const namingActionLabel = namingCompleted
    ? 'Revisar a Gota Nomeada'
    : waterJourney
      ? 'Continuar O Nome das Águas'
      : 'Iniciar O Nome das Águas';

  const lamentCompleted = lamentProgress?.status === 'completed';
  const lamentInterrupted = lamentProgress?.status === 'safety_interrupted';
  const lamentActionLabel = lamentCompleted
    ? 'Revisar o Fragmento do Lamento'
    : lamentInterrupted
      ? 'Abrir apoio direto'
      : lamentProgress
        ? 'Continuar A Voz do Lamento'
        : 'Abrir A Voz do Lamento';

  const openNamingJourney = () => {
    startWaterJourney();
    navigate('/mission/name-the-waters');
  };

  const openLamentJourney = () => {
    navigate(lamentInterrupted ? '/safety?source=lament' : '/mission/voice-of-lament');
  };

  const componentCount = Number(namingCompleted) + Number(lamentCompleted);

  return (
    <div className="page page--water">
      <PageHeader
        eyebrow="Câmara dos Salmos"
        title="As águas começam a encontrar nome e recipiente."
        description="Este capítulo trabalha emoção, memória, lamento e confiança sem transformar estados percebidos em diagnóstico ou identidade fixa."
      />

      <div className="water-chamber-grid">
        <Card className="water-hero-card">
          <div className="water-hero-card__visual" aria-hidden="true"><Droplets/><span/></div>
          <div>
            <p className="eyebrow">Estado da Câmara</p>
            <h2>{componentCount === 0 ? 'Fundação disponível' : `${componentCount} de 4 componentes iniciais`}</h2>
            <p>A sala permanece em construção. O Cálice completo só será criado depois de nomeação, lamento, memória, confiança, ação de cuidado e revisão.</p>
          </div>
        </Card>

        <Card title={waterBiblicalUnit.title} eyebrow={waterBiblicalUnit.reference}>
          <blockquote>{waterBiblicalUnit.principle}</blockquote>
          <p>{waterBiblicalUnit.context}</p>
          <div className="provenance-inline"><BookOpenText size={17}/><span>Fonte bíblica como núcleo editorial. Aplicação e gameplay permanecem identificados separadamente.</span></div>
        </Card>

        <Card title="O Nome das Águas" eyebrow="Primeira missão da Água">
          <p>Escolha um ou mais movimentos percebidos, informe apenas o que desejar e conclua mesmo sem registrar o check-in.</p>
          <ul className="simple-list">
            <li>múltiplas emoções podem coexistir;</li>
            <li>intensidade e necessidade são opcionais;</li>
            <li>não existe emoção correta, elevada ou negativa;</li>
            <li>o resultado não gera diagnóstico ou recomendação clínica.</li>
          </ul>
          <Button onClick={openNamingJourney}>{namingActionLabel} <ArrowRight size={18}/></Button>
        </Card>

        <Card title="A Voz do Lamento" eyebrow={waterLamentBiblicalUnit.reference}>
          <div className="lament-card-intro"><Feather aria-hidden="true"/><p>Organize, se desejar, o que aconteceu, o que sente, o que deseja e de que apoio precisa.</p></div>
          <ul className="simple-list">
            <li>todos os campos são opcionais;</li>
            <li>a missão pode ser concluída em silêncio;</li>
            <li>o texto não altera a recompensa;</li>
            <li>sinais críticos interrompem o simbolismo.</li>
          </ul>
          <Button disabled={!namingCompleted} onClick={openLamentJourney}>{lamentActionLabel} <ArrowRight size={18}/></Button>
          {!namingCompleted && <p className="field-help">Conclua primeiro O Nome das Águas para abrir esta etapa.</p>}
        </Card>

        <Card title="Limites da experiência" eyebrow="Segurança">
          <div className="safety-summary"><ShieldCheck/><p>O Athanor não interpreta sintomas, memórias ou causas. Em situação crítica, o fluxo simbólico é interrompido pela tela direta de segurança.</p></div>
        </Card>
      </div>
    </div>
  );
}
