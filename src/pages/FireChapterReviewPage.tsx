import { Archive, CheckCircle2, Flame, MoonStar, Shield, ShieldCheck, Sprout } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  canCompleteFireChapter,
  summarizeFireChapter,
  type FireChapterDestination,
  type FireChapterMissionId
} from '../domain/fireChapter';
import { useAthanorStore } from '../state/useAthanorStore';
import { useFireChapterStore } from '../state/useFireChapterStore';
import { useFireShieldStore } from '../state/useFireShieldStore';

const missionLabels: Record<FireChapterMissionId, { title: string; component: string }> = {
  name_the_flame: { title: 'O Nome da Chama', component: 'Chama Nomeada' },
  before_the_gesture: { title: 'O Instante Antes do Gesto', component: 'Brasa do Intervalo' },
  limit_that_protects: { title: 'O Limite que Protege', component: 'Placa do Limite' },
  proportional_courage: { title: 'A Coragem Proporcional', component: 'Marca da Coragem Proporcional' },
  what_needs_transformation: { title: 'O que Precisa Ser Transformado', component: 'Metal Transformado' }
};

const destinationOptions: { id: FireChapterDestination; label: string; description: string }[] = [
  { id: 'preserve', label: 'Preservar', description: 'Manter a prática disponível para consultas futuras.' },
  { id: 'rest', label: 'Repousar', description: 'Retirar a prática do fluxo ativo sem apagar o progresso.' },
  { id: 'archive', label: 'Arquivar', description: 'Registrar a conclusão sem manter a prática ativa.' }
];

function applyFireCompletionToTemple(): void {
  const timestamp = new Date().toISOString();
  useAthanorStore.setState((state) => {
    if (!state.temple) return state;
    const rooms = state.temple.rooms.map((room) => {
      if (room.roomId === 'forge') {
        return {
          ...room,
          status: 'restored' as const,
          restorationProgress: 100,
          activeMissionId: undefined,
          placedItemIds: [...new Set([...room.placedItemIds, 'item_just_boundary_shield_v1'])]
        };
      }
      if (room.roomId === 'garden') {
        return {
          ...room,
          status: room.status === 'restored' ? room.status : 'available' as const,
          restorationProgress: Math.max(room.restorationProgress, 8),
          activeMissionId: 'mission_body_arrives_first_v1'
        };
      }
      if (room.roomId === 'atrium') {
        return { ...room, restorationProgress: Math.max(room.restorationProgress, 90) };
      }
      return room;
    });

    return {
      temple: {
        ...state.temple,
        rooms,
        placedItems: [...new Set([...state.temple.placedItems, 'item_just_boundary_shield_v1'])],
        restorationLevel: Math.max(state.temple.restorationLevel, 7),
        updatedAt: timestamp
      },
      character: state.character
        ? { ...state.character, workLevel: 'construction' as const, updatedAt: timestamp }
        : state.character
    };
  });
}

export function FireChapterReviewPage() {
  const navigate = useNavigate();
  const shieldProgress = useFireShieldStore((state) => state.progress);
  const storedProgress = useFireChapterStore((state) => state.progress);
  const start = useFireChapterStore((state) => state.start);
  const selectDestination = useFireChapterStore((state) => state.selectDestination);
  const setNote = useFireChapterStore((state) => state.setNote);
  const complete = useFireChapterStore((state) => state.complete);

  const sourceShieldId = shieldProgress?.craftedAt ?? (shieldProgress ? `${shieldProgress.sourceTransformedMetalId}:shield` : undefined);
  const shieldReady = Boolean(sourceShieldId && shieldProgress?.status === 'integrated' && shieldProgress.positioned);
  const progress = sourceShieldId && storedProgress?.sourceShieldId === sourceShieldId ? storedProgress : undefined;

  useEffect(() => {
    if (progress?.status === 'completed') applyFireCompletionToTemple();
  }, [progress?.status]);

  if (!shieldReady) {
    return <div className="page page--fire page--fire-review"><PageHeader eyebrow="Encerramento do Fogo" title="O ciclo ainda não está pronto para revisão geral." description="Integre e posicione primeiro o Escudo do Limite Justo. Criar o item sem revisão não conclui o capítulo."/><Card title="Dependência da jornada" eyebrow="Escudo integrado e posicionado"><p>A revisão geral organiza práticas concluídas, mas não substitui o crafting nem afirma que intensidade, limites ou decisões foram resolvidos.</p><Button onClick={() => navigate('/crafting/just-boundary-shield')}>Voltar ao Escudo</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--fire page--fire-review"><PageHeader eyebrow="Encerramento do Fogo" title="A Forja recebeu uma estrutura revisada." description="Escolha o destino de cada prática antes de restaurar integralmente a Forja e abrir o Jardim Interior."/><div className="fire-review-intro-grid"><Card title="Primeiro ciclo do Fogo" eyebrow="Revisão sem pontuação"><div className="fire-review-symbol" aria-hidden="true"><Flame/></div><p>Preservar, repousar e arquivar são destinos igualmente válidos. Nenhuma escolha mede coragem, autocontrole ou maturidade.</p></Card><Card title="Iniciar revisão" eyebrow="Cinco escolhas explícitas"><p>O registro permanece local. Uma nota final é opcional e não altera recompensas ou desbloqueios.</p><Button onClick={() => sourceShieldId && start(sourceShieldId)}>Revisar o capítulo</Button></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const summary = summarizeFireChapter(progress);
    return <div className="page page--fire page--fire-review page--fire-complete"><PageHeader eyebrow="Capítulo do Fogo concluído" title="A Forja dos Elementos foi restaurada." description="O primeiro ciclo do Fogo foi registrado, e o Jardim Interior está disponível para a próxima jornada."/><div className="fire-completion-grid"><Card className="fire-completion-card"><div className="fire-review-symbol fire-review-symbol--complete" aria-hidden="true"><CheckCircle2/></div><p className="eyebrow">Ciclo registrado</p><h2>Livro do Fogo · Primeiro ciclo</h2><p>Identificador local: <code>{progress.cycleId}</code></p></Card><Card title="Destinos escolhidos" eyebrow="Sem ranking"><ul className="simple-list"><li><strong>{summary.preserve}</strong> práticas preservadas</li><li><strong>{summary.rest}</strong> práticas em repouso</li><li><strong>{summary.archive}</strong> práticas arquivadas</li></ul>{progress.note && <p className="fire-review-note">{progress.note}</p>}</Card></div><Card title="O Jardim desperta" eyebrow="Próximo capítulo disponível"><div className="safety-summary"><Sprout/><p>A Terra começará por condições percebidas do corpo, descanso e uma ação pequena, sem diagnóstico, contagem corporal ou obrigação de produtividade.</p></div><div className="fire-review-actions"><Button onClick={() => navigate('/temple/garden')}>Entrar no Jardim</Button><Button variant="secondary" onClick={() => navigate('/temple/forge')}>Visitar a Forja restaurada</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Voltar ao Átrio</Button></div></Card></div>;
  }

  const ready = canCompleteFireChapter(progress);
  return <div className="page page--fire page--fire-review"><PageHeader eyebrow="Revisão geral do Fogo" title="Escolha o destino de cada prática." description="Esses destinos organizam o Templo. Eles não classificam a experiência como sucesso, fracasso, força ou fraqueza."/><div className="fire-review-list">{(Object.keys(missionLabels) as FireChapterMissionId[]).map((missionId) => { const mission = missionLabels[missionId]; return <Card key={missionId} title={mission.title} eyebrow={mission.component}><div className="fire-destination-options" role="group" aria-label={`Destino de ${mission.title}`}>{destinationOptions.map((option) => <button key={option.id} type="button" className="fire-destination-option" aria-pressed={progress.destinations[missionId] === option.id} onClick={() => selectDestination(missionId, option.id)}>{option.id === 'preserve' ? <CheckCircle2/> : option.id === 'rest' ? <MoonStar/> : <Archive/>}<span><strong>{option.label}</strong><small>{option.description}</small></span></button>)}</div></Card>; })}</div><Card title="Nota de encerramento" eyebrow="Opcional e local"><label className="field-label" htmlFor="fire-chapter-note">O que você deseja lembrar deste ciclo?</label><textarea id="fire-chapter-note" rows={5} value={progress.note ?? ''} onChange={(event) => setNote(event.target.value)} placeholder="Este campo pode permanecer vazio."/></Card><Card title="Concluir o capítulo" eyebrow="Abertura controlada do Jardim"><div className="safety-summary"><ShieldCheck/><p>O encerramento restaura a Forja e abre a próxima sala. Ele não afirma que impulsos, limites ou decisões foram resolvidos.</p></div><Button disabled={!ready} onClick={() => { const completed = complete(); if (completed?.status === 'completed') applyFireCompletionToTemple(); }}>Concluir o ciclo do Fogo</Button>{!ready && <p className="field-help">Escolha um destino para cada uma das cinco práticas.</p>}</Card></div>;
}
