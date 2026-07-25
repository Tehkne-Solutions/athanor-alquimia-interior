import { ArrowRight, BookOpenText, Droplets, Eye, Feather, HeartHandshake, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { waterBiblicalUnit, waterLamentBiblicalUnit, waterMemoryBiblicalUnit } from '../content/water';
import { waterTrustBiblicalUnit } from '../content/waterTrust';
import { useAthanorStore } from '../state/useAthanorStore';
import { useWaterLamentStore } from '../state/useWaterLamentStore';
import { useWaterMemoryStore } from '../state/useWaterMemoryStore';
import { useWaterTrustStore } from '../state/useWaterTrustStore';

export function PsalmsChamberPage() {
  const navigate = useNavigate();
  const temple = useAthanorStore((state) => state.temple);
  const inventory = useAthanorStore((state) => state.inventory);
  const waterJourney = useAthanorStore((state) => state.waterJourney);
  const startWaterJourney = useAthanorStore((state) => state.startWaterJourney);
  const rawLamentProgress = useWaterLamentStore((state) => state.progress);
  const lamentJourneyStartedAt = useWaterLamentStore((state) => state.journeyStartedAt);
  const rawMemoryProgress = useWaterMemoryStore((state) => state.progress);
  const rawTrustProgress = useWaterTrustStore((state) => state.progress);
  const lamentProgress = waterJourney?.startedAt === lamentJourneyStartedAt ? rawLamentProgress : undefined;
  const memoryProgress = waterJourney?.startedAt === rawMemoryProgress?.journeyStartedAt ? rawMemoryProgress : undefined;
  const trustProgress = waterJourney?.startedAt === rawTrustProgress?.journeyStartedAt ? rawTrustProgress : undefined;
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

  const memoryCompleted = memoryProgress?.status === 'completed';
  const memoryActionLabel = memoryCompleted
    ? 'Revisar o Espelho das Águas'
    : memoryProgress
      ? 'Continuar O Espelho das Memórias'
      : 'Abrir O Espelho das Memórias';

  const trustCompleted = trustProgress?.status === 'completed';
  const trustActionLabel = trustCompleted
    ? 'Revisar a Ponte da Confiança'
    : trustProgress
      ? 'Continuar O Espaço da Confiança'
      : 'Abrir O Espaço da Confiança';

  const openNamingJourney = () => {
    startWaterJourney();
    navigate('/mission/name-the-waters');
  };

  const openLamentJourney = () => {
    navigate(lamentInterrupted ? '/safety?source=lament' : '/mission/voice-of-lament');
  };

  const componentCount = Number(namingCompleted) + Number(lamentCompleted) + Number(memoryCompleted) + Number(trustCompleted);

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
            <p>{componentCount < 4
              ? 'A sala permanece em construção. O Cálice completo só será criado depois de nomeação, lamento, memória, confiança, ação de cuidado e revisão.'
              : 'Os quatro componentes iniciais estão disponíveis. A próxima fase reunirá ação de cuidado, revisão e crafting do Cálice.'}</p>
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

        <Card title="O Espelho das Memórias" eyebrow={waterMemoryBiblicalUnit.reference}>
          <div className="lament-card-intro"><Eye aria-hidden="true"/><p>Diferencie memória, sensação atual, previsão, necessidade e ação usando somente frases fictícias.</p></div>
          <ul className="simple-list">
            <li>nenhuma memória pessoal é solicitada;</li>
            <li>o resultado oferece feedback didático, não pontuação;</li>
            <li>a prática de presença registra somente tipos de observação;</li>
            <li>Yesod, Mem, Kan e Tarot permanecem camadas opcionais.</li>
          </ul>
          <Button disabled={!lamentCompleted} onClick={() => navigate('/mission/mirror-of-memories')}>{memoryActionLabel} <ArrowRight size={18}/></Button>
          {!lamentCompleted && <p className="field-help">Conclua primeiro A Voz do Lamento para abrir esta etapa.</p>}
        </Card>

        <Card title="O Espaço da Confiança" eyebrow={waterTrustBiblicalUnit.reference}>
          <div className="lament-card-intro"><HeartHandshake aria-hidden="true"/><p>Diferencie apoio, garantia e previsão e mapeie somente recursos realmente disponíveis.</p></div>
          <ul className="simple-list">
            <li>nenhum recurso é presumido;</li>
            <li>o mapa pode permanecer vazio;</li>
            <li>a ação de cuidado é opcional;</li>
            <li>Chesed, Kun e A Estrela são camadas comparativas.</li>
          </ul>
          <Button disabled={!memoryCompleted} onClick={() => navigate('/mission/space-of-trust')}>{trustActionLabel} <ArrowRight size={18}/></Button>
          {!memoryCompleted && <p className="field-help">Conclua primeiro O Espelho das Memórias para abrir esta etapa.</p>}
        </Card>

        <Card title="Limites da experiência" eyebrow="Segurança">
          <div className="safety-summary"><ShieldCheck/><p>O Athanor não interpreta sintomas, memórias ou causas e não promete proteção ou resultado. Em situação crítica, o fluxo simbólico é interrompido pela tela direta de segurança.</p></div>
        </Card>
      </div>
    </div>
  );
}
