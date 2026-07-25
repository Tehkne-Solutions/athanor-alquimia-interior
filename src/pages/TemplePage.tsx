import { ArrowRight, BookOpenText, CheckCircle2, Clock3, CupSoda, Database, Droplets, Flame, LampDesk, RefreshCw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { PageHeader } from '../components/PageHeader';
import { TempleMap } from '../components/TempleMap';
import { biblicalUnits } from '../content/seed';
import { useAthanorStore } from '../state/useAthanorStore';
import { useWaterChaliceStore } from '../state/useWaterChaliceStore';
import { useWaterChapterStore } from '../state/useWaterChapterStore';

const workLevelLabels = {
  foundation: 'Fundação',
  first_fire: 'Primeiro Fogo',
  form: 'Forma',
  construction: 'Construção',
  integration: 'Integração',
  new_work: 'Nova Obra'
} as const;

export function TemplePage() {
  const navigate = useNavigate();
  const character = useAthanorStore((state) => state.character);
  const temple = useAthanorStore((state) => state.temple);
  const inventory = useAthanorStore((state) => state.inventory);
  const mission = useAthanorStore((state) => state.activeMission);
  const waterJourney = useAthanorStore((state) => state.waterJourney);
  const reviews = useAthanorStore((state) => state.reviews ?? []);
  const chaliceProgress = useWaterChaliceStore((state) => state.progress);
  const chapterProgress = useWaterChapterStore((state) => state.progress);
  const passage = biblicalUnits[0];

  if (!character || !temple) return null;

  const lamp = inventory.find((item) => item.id === 'item_clear_word_lamp_v1');
  const awaitingReview = lamp?.lifecycle === 'awaiting_review' || lamp?.lifecycle === 'adjusted';
  const integrated = lamp?.lifecycle === 'integrated';
  const psalmsChamber = temple.rooms.find((room) => room.roomId === 'psalms-chamber');
  const forge = temple.rooms.find((room) => room.roomId === 'forge');
  const waterAvailable = Boolean(integrated || (psalmsChamber && psalmsChamber.status !== 'dormant' && psalmsChamber.status !== 'hidden'));
  const waterCompleted = chapterProgress?.journeyStartedAt === waterJourney?.startedAt && chapterProgress.status === 'completed';
  const forgeAvailable = Boolean(waterCompleted || (forge && forge.status !== 'dormant' && forge.status !== 'hidden'));
  const chaliceAvailable = chaliceProgress?.journeyStartedAt === waterJourney?.startedAt && chaliceProgress.chaliceCreated;

  const roomSelect = (roomId: string) => {
    if (roomId === 'proverbs-library') navigate('/temple/proverbs-library');
    if (roomId === 'psalms-chamber') navigate('/temple/psalms-chamber');
    if (roomId === 'forge') navigate('/temple/forge');
  };

  const missionAction = awaitingReview
    ? { label: 'Revisar a Lâmpada', route: '/review/clear-word-lamp', icon: RefreshCw }
    : integrated
      ? { label: 'Visitar a Biblioteca', route: '/temple/proverbs-library', icon: CheckCircle2 }
      : { label: mission ? 'Continuar jornada' : 'Iniciar jornada', route: '/mission/word-before-response', icon: ArrowRight };
  const MissionActionIcon = missionAction.icon;

  const waterAction = waterCompleted
    ? 'Visitar a Câmara restaurada'
    : chaliceProgress?.positioned
      ? 'Concluir o capítulo da Água'
      : waterJourney?.status === 'named'
        ? 'Continuar a jornada da Água'
        : waterJourney
          ? 'Continuar missão da Água'
          : 'Entrar na Câmara dos Salmos';

  const activeRoomCount = temple.rooms.filter((room) => room.status === 'active' || room.status === 'restored' || room.status === 'available').length;
  const componentCount = inventory.length + Number(waterJourney?.namedDropCreated) + Number(chaliceAvailable);

  return (
    <div className="page page--temple">
      <PageHeader eyebrow="Átrio da Presença" title={`Bem-vindo ao Templo, ${character.name}.`} description="Seu Templo registra ciclos de gameplay, itens e revisões. Ele não mede sua condição espiritual." action={<span className="local-badge"><Database size={16}/> Dados locais</span>} />
      <div className="temple-dashboard">
        <Card className="hero-card">
          <div className="hero-card__scene"><div className={`temple-backdrop temple-backdrop--${temple.theme}`} aria-hidden="true"/><CharacterAvatar character={character}/></div>
          <div className="hero-card__content">
            <p className="eyebrow">Nível da Obra</p>
            <h2>{workLevelLabels[character.workLevel]}</h2>
            <p>{waterCompleted
              ? 'O primeiro ciclo da Água foi registrado, a Câmara está restaurada e a Forja foi aberta.'
              : integrated
                ? 'A primeira Obra foi revisada e a Câmara dos Salmos está disponível.'
                : awaitingReview
                  ? 'A Biblioteca foi restaurada e aguarda o retorno da sua ação.'
                  : 'A Biblioteca dos Provérbios aguarda sua primeira restauração.'}</p>
            <div className="status-row">
              <span><strong>{activeRoomCount}</strong> salas acessíveis</span>
              <span><strong>{componentCount}</strong> componentes e itens</span>
              <span><strong>{reviews.length + Number(waterCompleted)}</strong> ciclos e revisões</span>
              <span><strong>{temple.restorationLevel}</strong> nível do Templo</span>
            </div>
          </div>
        </Card>

        <Card eyebrow="Princípio do ciclo" title={passage.title} className="principle-card">
          <blockquote>{passage.principle}</blockquote><p>{passage.application}</p>
          <Button onClick={() => navigate('/temple/proverbs-library')}>Entrar na Biblioteca <ArrowRight size={18}/></Button>
        </Card>

        <Card eyebrow={integrated ? 'Ciclo integrado' : awaitingReview ? 'Retorno pendente' : 'Missão principal'} title="A Palavra Antes da Resposta" className="mission-card">
          <div className="mission-card__icon">{integrated ? <CheckCircle2/> : awaitingReview ? <Clock3/> : <BookOpenText/>}</div>
          <p>{integrated ? 'A ação foi revisada e a Lâmpada passou a fazer parte da Primeira Obra.' : awaitingReview ? 'Registre o que aconteceu, ajuste o passo ou deixe o ciclo em repouso sem perder progresso.' : 'Organize fato, interpretação, previsão e intenção para criar a Lâmpada da Palavra Clara.'}</p>
          <div className="mission-meta"><span>Capítulo do Ar</span><span>{awaitingReview ? 'Sem prazo obrigatório' : integrated ? 'Revisão concluída' : '8–12 minutos'}</span></div>
          <Button variant="secondary" onClick={() => navigate(missionAction.route)}>{missionAction.label} <MissionActionIcon size={18}/></Button>
        </Card>

        {waterAvailable && (
          <Card eyebrow={waterCompleted ? 'Capítulo concluído' : 'Capítulo disponível'} title="A Câmara dos Salmos" className="mission-card mission-card--water">
            <div className="mission-card__icon">{waterCompleted ? <CupSoda/> : <Droplets/>}</div>
            <p>{waterCompleted
              ? 'As quatro práticas foram revisadas, o Cálice foi posicionado e o primeiro ciclo da Água foi registrado.'
              : chaliceProgress?.positioned
                ? 'O Cálice ocupa a Câmara. Falta escolher o destino das quatro práticas para encerrar o capítulo.'
                : 'Reconheça emoção, lamento, memória e apoio sem transformá-los em diagnóstico ou pontuação moral.'}</p>
            <div className="mission-meta"><span>Capítulo da Água</span><span>{waterCompleted ? 'Ciclo registrado' : 'Práticas opcionais'}</span></div>
            <Button variant="secondary" onClick={() => navigate(waterCompleted ? '/temple/psalms-chamber' : chaliceProgress?.positioned ? '/review/water-chapter' : '/temple/psalms-chamber')}>{waterAction} <ArrowRight size={18}/></Button>
          </Card>
        )}

        {forgeAvailable && (
          <Card eyebrow="Novo capítulo disponível" title="A Forja dos Elementos" className="mission-card mission-card--fire">
            <div className="mission-card__icon"><Flame/></div>
            <p>A fundação do Fogo está aberta. A próxima missão distinguirá intensidade, impulso, necessidade e ação proporcional.</p>
            <div className="mission-meta"><span>Capítulo do Fogo</span><span>Fundação técnica</span></div>
            <Button variant="secondary" onClick={() => navigate('/temple/forge')}>Entrar na Forja <ArrowRight size={18}/></Button>
          </Card>
        )}

        <Card title="Mapa do Templo" eyebrow="Ambientes"><TempleMap temple={temple} onRoomSelect={roomSelect} unlockedRoomIds={[...(integrated ? ['psalms-chamber'] : []), ...(waterCompleted ? ['forge'] : [])]}/></Card>
        <Card title="Instrumentos da Obra" eyebrow={chaliceAvailable ? 'Água e Ar' : lamp ? integrated ? 'Instrumento integrado' : 'Instrumento em observação' : 'Nenhum item equipado'}>
          {lamp ? <div className="item-mini"><div className="lamp-icon"><LampDesk/></div><div><strong>{lamp.name}</strong><p>{lamp.action}</p></div></div> : <div className="empty-state"><LampDesk/><p>Sua primeira receita será desbloqueada na Biblioteca.</p></div>}
          {chaliceAvailable && <div className="item-mini"><div className="lamp-icon"><CupSoda/></div><div><strong>Cálice da Memória Serena</strong><p>{waterCompleted ? 'Ciclo da Água registrado' : 'Ciclo em revisão'}</p></div></div>}
        </Card>
        <Card title="Limites do sistema" eyebrow="Segurança"><div className="safety-summary"><ShieldCheck/><p>Nenhum status é diagnóstico. Símbolos não determinam o futuro, e toda ação pode ser recusada.</p></div></Card>
      </div>
    </div>
  );
}
