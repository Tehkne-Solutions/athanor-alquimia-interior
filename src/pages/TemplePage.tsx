import { ArrowRight, BookOpenText, CheckCircle2, Clock3, Database, LampDesk, RefreshCw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { PageHeader } from '../components/PageHeader';
import { TempleMap } from '../components/TempleMap';
import { biblicalUnits } from '../content/seed';
import { useAthanorStore } from '../state/useAthanorStore';

export function TemplePage() {
  const navigate = useNavigate();
  const character = useAthanorStore((state) => state.character);
  const temple = useAthanorStore((state) => state.temple);
  const inventory = useAthanorStore((state) => state.inventory);
  const mission = useAthanorStore((state) => state.activeMission);
  const reviews = useAthanorStore((state) => state.reviews ?? []);
  const passage = biblicalUnits[0];

  if (!character || !temple) return null;

  const lamp = inventory.find((item) => item.id === 'item_clear_word_lamp_v1');
  const awaitingReview = lamp?.lifecycle === 'awaiting_review' || lamp?.lifecycle === 'adjusted';
  const integrated = lamp?.lifecycle === 'integrated';
  const roomSelect = (roomId: string) => {
    if (roomId === 'proverbs-library') navigate('/temple/proverbs-library');
  };
  const workLevel = character.workLevel === 'first_fire' ? 'Primeiro Fogo' : 'Fundação';

  const missionAction = awaitingReview
    ? { label: 'Revisar a Lâmpada', route: '/review/clear-word-lamp', icon: RefreshCw }
    : integrated
      ? { label: 'Visitar a Biblioteca', route: '/temple/proverbs-library', icon: CheckCircle2 }
      : { label: mission ? 'Continuar jornada' : 'Iniciar jornada', route: '/mission/word-before-response', icon: ArrowRight };
  const MissionActionIcon = missionAction.icon;

  return (
    <div className="page page--temple">
      <PageHeader
        eyebrow="Átrio da Presença"
        title={`Bem-vindo ao Templo, ${character.name}.`}
        description="Seu Templo registra ciclos de gameplay, itens e revisões. Ele não mede sua condição espiritual."
        action={<span className="local-badge"><Database size={16}/> Dados locais</span>}
      />
      <div className="temple-dashboard">
        <Card className="hero-card">
          <div className="hero-card__scene"><div className={`temple-backdrop temple-backdrop--${temple.theme}`} aria-hidden="true"/><CharacterAvatar character={character}/></div>
          <div className="hero-card__content">
            <p className="eyebrow">Nível da Obra</p>
            <h2>{workLevel}</h2>
            <p>{integrated ? 'A primeira Obra foi revisada e integrada ao Templo.' : awaitingReview ? 'A Biblioteca foi restaurada e aguarda o retorno da sua ação.' : 'A Biblioteca dos Provérbios aguarda sua primeira restauração.'}</p>
            <div className="status-row">
              <span><strong>{temple.rooms.filter((room) => room.status === 'active' || room.status === 'restored').length}</strong> salas ativas</span>
              <span><strong>{inventory.length}</strong> item criado</span>
              <span><strong>{reviews.length}</strong> revisões registradas</span>
              <span><strong>{temple.restorationLevel}</strong> nível do Templo</span>
            </div>
          </div>
        </Card>

        <Card eyebrow="Princípio do ciclo" title={passage.title} className="principle-card">
          <blockquote>{passage.principle}</blockquote>
          <p>{passage.application}</p>
          <Button onClick={() => navigate('/temple/proverbs-library')}>Entrar na Biblioteca <ArrowRight size={18}/></Button>
        </Card>

        <Card
          eyebrow={integrated ? 'Ciclo integrado' : awaitingReview ? 'Retorno pendente' : 'Missão principal'}
          title="A Palavra Antes da Resposta"
          className="mission-card"
        >
          <div className="mission-card__icon">{integrated ? <CheckCircle2/> : awaitingReview ? <Clock3/> : <BookOpenText/>}</div>
          <p>{integrated ? 'A ação foi revisada e a Lâmpada passou a fazer parte da Primeira Obra.' : awaitingReview ? 'Registre o que aconteceu, ajuste o passo ou deixe o ciclo em repouso sem perder progresso.' : 'Organize fato, interpretação, previsão e intenção para criar a Lâmpada da Palavra Clara.'}</p>
          <div className="mission-meta"><span>Capítulo do Ar</span><span>{awaitingReview ? 'Sem prazo obrigatório' : integrated ? 'Revisão concluída' : '8–12 minutos'}</span></div>
          <Button variant="secondary" onClick={() => navigate(missionAction.route)}>{missionAction.label} <MissionActionIcon size={18}/></Button>
        </Card>

        <Card title="Mapa do Templo" eyebrow="Ambientes"><TempleMap temple={temple} onRoomSelect={roomSelect}/></Card>
        <Card title="Item ativo" eyebrow={lamp ? integrated ? 'Instrumento integrado' : 'Instrumento em observação' : 'Nenhum item equipado'}>
          {lamp ? <div className="item-mini"><div className="lamp-icon"><LampDesk/></div><div><strong>{lamp.name}</strong><p>{lamp.action}</p></div></div> : <div className="empty-state"><LampDesk/><p>Sua primeira receita será desbloqueada na Biblioteca.</p></div>}
        </Card>
        <Card title="Limites do sistema" eyebrow="Segurança"><div className="safety-summary"><ShieldCheck/><p>Nenhum status é diagnóstico. Símbolos não determinam o futuro, e toda ação pode ser recusada.</p></div></Card>
      </div>
    </div>
  );
}
