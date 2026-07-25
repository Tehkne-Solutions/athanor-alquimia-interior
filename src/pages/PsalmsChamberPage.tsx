import { ArrowRight, BookOpenText, CheckCircle2, CupSoda, Droplets, Eye, Feather, Flame, HeartHandshake, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { waterBiblicalUnit, waterLamentBiblicalUnit, waterMemoryBiblicalUnit } from '../content/water';
import { waterTrustBiblicalUnit } from '../content/waterTrust';
import { useAthanorStore } from '../state/useAthanorStore';
import { useWaterChaliceStore } from '../state/useWaterChaliceStore';
import { useWaterChapterStore } from '../state/useWaterChapterStore';
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
  const rawChaliceProgress = useWaterChaliceStore((state) => state.progress);
  const rawChapterProgress = useWaterChapterStore((state) => state.progress);
  const lamentProgress = waterJourney?.startedAt === lamentJourneyStartedAt ? rawLamentProgress : undefined;
  const memoryProgress = waterJourney?.startedAt === rawMemoryProgress?.journeyStartedAt ? rawMemoryProgress : undefined;
  const trustProgress = waterJourney?.startedAt === rawTrustProgress?.journeyStartedAt ? rawTrustProgress : undefined;
  const chaliceProgress = waterJourney?.startedAt === rawChaliceProgress?.journeyStartedAt ? rawChaliceProgress : undefined;
  const chapterProgress = waterJourney?.startedAt === rawChapterProgress?.journeyStartedAt ? rawChapterProgress : undefined;
  const chamber = temple?.rooms.find((room) => room.roomId === 'psalms-chamber');
  const lampIntegrated = inventory.some((item) => item.id === 'item_clear_word_lamp_v1' && item.lifecycle === 'integrated');
  const available = Boolean(lampIntegrated || (chamber && chamber.status !== 'dormant' && chamber.status !== 'hidden'));

  if (!available) {
    return (
      <div className="page page--water">
        <PageHeader eyebrow="Capítulo da Água" title="A Câmara dos Salmos ainda repousa." description="Integre primeiro o ciclo da Lâmpada da Palavra Clara. O Templo não abre uma nova jornada apenas pela criação de um item." />
        <Card title="Caminho ainda fechado" eyebrow="Dependência de jornada">
          <div className="water-lock"><LockKeyhole aria-hidden="true"/><p>Retorne à Biblioteca, revise a ação e escolha integrar, ajustar ou colocar o ciclo em repouso.</p></div>
          <Button onClick={() => navigate('/temple')}>Voltar ao Átrio</Button>
        </Card>
      </div>
    );
  }

  const namingCompleted = Boolean(waterJourney?.namedDropCreated);
  const namingActionLabel = namingCompleted ? 'Revisar a Gota Nomeada' : waterJourney ? 'Continuar O Nome das Águas' : 'Iniciar O Nome das Águas';
  const lamentCompleted = lamentProgress?.status === 'completed';
  const lamentInterrupted = lamentProgress?.status === 'safety_interrupted';
  const lamentActionLabel = lamentCompleted ? 'Revisar o Fragmento do Lamento' : lamentInterrupted ? 'Abrir apoio direto' : lamentProgress ? 'Continuar A Voz do Lamento' : 'Abrir A Voz do Lamento';
  const memoryCompleted = memoryProgress?.status === 'completed';
  const memoryActionLabel = memoryCompleted ? 'Revisar o Espelho das Águas' : memoryProgress ? 'Continuar O Espelho das Memórias' : 'Abrir O Espelho das Memórias';
  const trustCompleted = trustProgress?.status === 'completed';
  const trustActionLabel = trustCompleted ? 'Revisar a Ponte da Confiança' : trustProgress ? 'Continuar O Espaço da Confiança' : 'Abrir O Espaço da Confiança';
  const chaliceActionLabel = !chaliceProgress
    ? 'Abrir a receita do Cálice'
    : chaliceProgress.positioned
      ? 'Revisar o Cálice posicionado'
      : chaliceProgress.status === 'integrated'
        ? 'Posicionar o Cálice'
        : chaliceProgress.status === 'resting'
          ? 'Retomar o Cálice'
          : chaliceProgress.status === 'awaiting_review'
            ? 'Revisar o Cálice'
            : chaliceProgress.chaliceCreated
              ? 'Continuar o ciclo do Cálice'
              : 'Continuar a receita do Cálice';
  const chapterCompleted = chapterProgress?.status === 'completed';

  const openNamingJourney = () => {
    startWaterJourney();
    navigate('/mission/name-the-waters');
  };

  const openLamentJourney = () => navigate(lamentInterrupted ? '/safety?source=lament' : '/mission/voice-of-lament');
  const componentCount = Number(namingCompleted) + Number(lamentCompleted) + Number(memoryCompleted) + Number(trustCompleted);
  const chamberTitle = chapterCompleted
    ? 'Câmara restaurada e ciclo da Água registrado'
    : chaliceProgress?.positioned
      ? 'Cálice posicionado · revisão geral pendente'
      : chaliceProgress?.status === 'integrated'
        ? 'Cálice integrado e pronto para posicionamento'
        : componentCount === 0
          ? 'Fundação disponível'
          : `${componentCount} de 4 componentes iniciais`;

  return (
    <div className="page page--water">
      <PageHeader
        eyebrow="Câmara dos Salmos"
        title={chapterCompleted ? 'As águas circulam por caminhos revisados.' : chaliceProgress?.positioned ? 'As águas receberam forma sem perder movimento.' : 'As águas começam a encontrar nome e recipiente.'}
        description="Este capítulo trabalha emoção, memória, lamento e confiança sem transformar estados percebidos em diagnóstico ou identidade fixa."
      />

      <div className="water-chamber-grid">
        <Card className={chapterCompleted || chaliceProgress?.positioned ? 'water-hero-card water-hero-card--restored' : 'water-hero-card'}>
          <div className="water-hero-card__visual" aria-hidden="true">{chapterCompleted ? <CheckCircle2/> : chaliceProgress?.positioned ? <CupSoda/> : <Droplets/>}<span/></div>
          <div>
            <p className="eyebrow">Estado da Câmara</p>
            <h2>{chamberTitle}</h2>
            <p>{chapterCompleted
              ? 'As quatro práticas receberam destinos explícitos, o primeiro ciclo foi registrado e a Forja dos Elementos está disponível.'
              : chaliceProgress?.positioned
                ? 'O Cálice foi criado, revisado, integrado e posicionado. Falta apenas revisar o destino das quatro práticas para concluir o capítulo.'
                : componentCount < 4
                  ? 'A sala permanece em construção. O Cálice completo só será criado depois de nomeação, lamento, memória, confiança, ação de cuidado e revisão.'
                  : 'Os quatro componentes estão disponíveis. A receita agora pode organizar intenção, ação, limite e revisão.'}</p>
          </div>
        </Card>

        <Card title={waterBiblicalUnit.title} eyebrow={waterBiblicalUnit.reference}>
          <blockquote>{waterBiblicalUnit.principle}</blockquote>
          <p>{waterBiblicalUnit.context}</p>
          <div className="provenance-inline"><BookOpenText size={17}/><span>Fonte bíblica como núcleo editorial. Aplicação e gameplay permanecem identificados separadamente.</span></div>
        </Card>

        <Card title="O Nome das Águas" eyebrow="Primeira missão da Água">
          <p>Escolha um ou mais movimentos percebidos, informe apenas o que desejar e conclua mesmo sem registrar o check-in.</p>
          <ul className="simple-list"><li>múltiplas emoções podem coexistir;</li><li>intensidade e necessidade são opcionais;</li><li>não existe emoção correta, elevada ou negativa;</li><li>o resultado não gera diagnóstico ou recomendação clínica.</li></ul>
          <Button onClick={openNamingJourney}>{namingActionLabel} <ArrowRight size={18}/></Button>
        </Card>

        <Card title="A Voz do Lamento" eyebrow={waterLamentBiblicalUnit.reference}>
          <div className="lament-card-intro"><Feather aria-hidden="true"/><p>Organize, se desejar, o que aconteceu, o que sente, o que deseja e de que apoio precisa.</p></div>
          <ul className="simple-list"><li>todos os campos são opcionais;</li><li>a missão pode ser concluída em silêncio;</li><li>o texto não altera a recompensa;</li><li>sinais críticos interrompem o simbolismo.</li></ul>
          <Button disabled={!namingCompleted} onClick={openLamentJourney}>{lamentActionLabel} <ArrowRight size={18}/></Button>
          {!namingCompleted && <p className="field-help">Conclua primeiro O Nome das Águas para abrir esta etapa.</p>}
        </Card>

        <Card title="O Espelho das Memórias" eyebrow={waterMemoryBiblicalUnit.reference}>
          <div className="lament-card-intro"><Eye aria-hidden="true"/><p>Diferencie memória, sensação atual, previsão, necessidade e ação usando somente frases fictícias.</p></div>
          <ul className="simple-list"><li>nenhuma memória pessoal é solicitada;</li><li>o resultado oferece feedback didático, não pontuação;</li><li>a prática de presença registra somente tipos de observação;</li><li>Yesod, Mem, Kan e Tarot permanecem camadas opcionais.</li></ul>
          <Button disabled={!lamentCompleted} onClick={() => navigate('/mission/mirror-of-memories')}>{memoryActionLabel} <ArrowRight size={18}/></Button>
          {!lamentCompleted && <p className="field-help">Conclua primeiro A Voz do Lamento para abrir esta etapa.</p>}
        </Card>

        <Card title="O Espaço da Confiança" eyebrow={waterTrustBiblicalUnit.reference}>
          <div className="lament-card-intro"><HeartHandshake aria-hidden="true"/><p>Diferencie apoio, garantia e previsão e mapeie somente recursos realmente disponíveis.</p></div>
          <ul className="simple-list"><li>nenhum recurso é presumido;</li><li>o mapa pode permanecer vazio;</li><li>a ação de cuidado é opcional;</li><li>Chesed, Kun e A Estrela são camadas comparativas.</li></ul>
          <Button disabled={!memoryCompleted} onClick={() => navigate('/mission/space-of-trust')}>{trustActionLabel} <ArrowRight size={18}/></Button>
          {!memoryCompleted && <p className="field-help">Conclua primeiro O Espelho das Memórias para abrir esta etapa.</p>}
        </Card>

        <Card title="Cálice da Memória Serena" eyebrow="Crafting e revisão">
          <div className="lament-card-intro"><CupSoda aria-hidden="true"/><p>Reúna os quatro componentes em uma intenção, uma ação, um limite e uma revisão explícita.</p></div>
          <ul className="simple-list"><li>criar o item não conclui o ciclo;</li><li>“Nenhuma ação agora” é uma escolha válida;</li><li>ajuste e repouso não apagam progresso;</li><li>somente um Cálice integrado pode ser posicionado.</li></ul>
          <Button disabled={!trustCompleted} onClick={() => navigate('/crafting/memory-serene-chalice')}>{chaliceActionLabel} <ArrowRight size={18}/></Button>
          {!trustCompleted && <p className="field-help">Conclua primeiro O Espaço da Confiança para abrir o crafting.</p>}
        </Card>

        <Card title="Encerramento da Água" eyebrow={chapterCompleted ? 'Ciclo concluído' : 'Revisão geral'}>
          <div className="lament-card-intro">{chapterCompleted ? <Flame aria-hidden="true"/> : <CheckCircle2 aria-hidden="true"/>}<p>{chapterCompleted ? 'A Câmara foi restaurada e a Forja está aberta.' : 'Escolha preservar, repousar ou arquivar cada prática antes de abrir o próximo capítulo.'}</p></div>
          <ul className="simple-list"><li>nenhum destino representa sucesso ou fracasso;</li><li>uma nota de encerramento é opcional;</li><li>o ciclo é registrado somente neste dispositivo;</li><li>a Forja abre apenas após conclusão explícita.</li></ul>
          <Button disabled={!chaliceProgress?.positioned} onClick={() => navigate(chapterCompleted ? '/temple/forge' : '/review/water-chapter')}>{chapterCompleted ? 'Entrar na Forja' : 'Revisar o capítulo'} <ArrowRight size={18}/></Button>
          {!chaliceProgress?.positioned && <p className="field-help">Integre e posicione o Cálice antes da revisão geral.</p>}
        </Card>

        <Card title="Limites da experiência" eyebrow="Segurança">
          <div className="safety-summary"><ShieldCheck/><p>O Athanor não interpreta sintomas, memórias ou causas e não promete serenidade, proteção ou resultado. Em situação crítica, o fluxo simbólico é interrompido pela tela direta de segurança.</p></div>
        </Card>
      </div>
    </div>
  );
}
