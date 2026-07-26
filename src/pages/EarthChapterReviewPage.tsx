import { Archive, CheckCircle2, Footprints, Gem, MoonStar, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  canCompleteEarthChapter,
  summarizeEarthChapter,
  type EarthChapterDestination,
  type EarthChapterMissionId
} from '../domain/earthChapter';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthChapterStore } from '../state/useEarthChapterStore';
import { useEarthStoneStore } from '../state/useEarthStoneStore';

const missionLabels: Record<EarthChapterMissionId, { title: string; component: string }> = {
  body_arrives_first: { title: 'O Corpo Chega Primeiro', component: 'Marca da Presença Corporal' },
  work_that_fits_today: { title: 'O Trabalho que Cabe Hoje', component: 'Semente do Primeiro Passo' },
  house_of_resources: { title: 'A Casa dos Recursos', component: 'Cesto dos Recursos Possíveis' },
  sustainable_rhythm: { title: 'O Ritmo que Pode Ser Mantido', component: 'Compasso do Ritmo Sustentável' },
  order_that_serves: { title: 'A Ordem que Serve', component: 'Mapa da Ordem Possível' }
};

const destinationOptions: { id: EarthChapterDestination; label: string; description: string }[] = [
  { id: 'preserve', label: 'Preservar', description: 'Manter a prática disponível para consultas futuras.' },
  { id: 'rest', label: 'Repousar', description: 'Retirar a prática do fluxo ativo sem apagar o progresso.' },
  { id: 'archive', label: 'Arquivar', description: 'Registrar a conclusão sem manter a prática ativa.' }
];

function applyEarthCompletionToTemple(): void {
  const timestamp = new Date().toISOString();
  useAthanorStore.setState((state) => {
    if (!state.temple) return state;
    const rooms = state.temple.rooms.map((room) => {
      if (room.roomId === 'garden') {
        return {
          ...room,
          status: 'restored' as const,
          restorationProgress: 100,
          activeMissionId: undefined,
          placedItemIds: [...new Set([...room.placedItemIds, 'item_first_step_stone_v1'])]
        };
      }
      if (room.roomId === 'central-tree') {
        return {
          ...room,
          name: 'Santuário do Espírito',
          status: room.status === 'restored' ? room.status : 'available' as const,
          restorationProgress: Math.max(room.restorationProgress, 8),
          activeMissionId: 'mission_integrated_thread_v1'
        };
      }
      if (room.roomId === 'atrium') {
        return { ...room, restorationProgress: Math.max(room.restorationProgress, 98) };
      }
      return room;
    });

    return {
      temple: {
        ...state.temple,
        rooms,
        placedItems: [...new Set([...state.temple.placedItems, 'item_first_step_stone_v1'])],
        restorationLevel: Math.max(state.temple.restorationLevel, 9),
        updatedAt: timestamp
      },
      character: state.character
        ? { ...state.character, workLevel: 'integration' as const, updatedAt: timestamp }
        : state.character
    };
  });
}

export function EarthChapterReviewPage() {
  const navigate = useNavigate();
  const stoneProgress = useEarthStoneStore((state) => state.progress);
  const storedProgress = useEarthChapterStore((state) => state.progress);
  const start = useEarthChapterStore((state) => state.start);
  const selectDestination = useEarthChapterStore((state) => state.selectDestination);
  const setNote = useEarthChapterStore((state) => state.setNote);
  const complete = useEarthChapterStore((state) => state.complete);

  const sourceStoneId = stoneProgress?.craftedAt ?? (stoneProgress ? `${stoneProgress.sourceOrderMapId}:stone` : undefined);
  const stoneReady = Boolean(sourceStoneId && stoneProgress?.status === 'integrated' && stoneProgress.positioned);
  const progress = sourceStoneId && storedProgress?.sourceStoneId === sourceStoneId ? storedProgress : undefined;

  useEffect(() => {
    if (progress?.status === 'completed') applyEarthCompletionToTemple();
  }, [progress?.status]);

  if (!stoneReady) {
    return <div className="page page--earth page--earth-review"><PageHeader eyebrow="Encerramento da Terra" title="O ciclo ainda não está pronto para revisão geral." description="Integre e posicione primeiro a Pedra do Primeiro Passo. Criar o item sem revisão não conclui o capítulo."/><Card title="Dependência da jornada" eyebrow="Pedra integrada e posicionada"><p>A revisão organiza práticas concluídas, mas não confirma saúde, produtividade, estabilidade ou execução de ações externas.</p><Button onClick={() => navigate('/crafting/first-step-stone')}>Voltar à Pedra</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--earth page--earth-review"><PageHeader eyebrow="Encerramento da Terra" title="O Jardim recebeu uma estrutura revisada." description="Escolha o destino de cada prática antes de restaurar integralmente o Jardim e abrir o Santuário do Espírito."/><div className="earth-review-intro-grid"><Card title="Primeiro ciclo da Terra" eyebrow="Revisão sem pontuação"><div className="earth-review-symbol" aria-hidden="true"><Footprints/></div><p>Preservar, repousar e arquivar são destinos igualmente válidos. Nenhuma escolha mede disciplina, saúde, organização ou produtividade.</p></Card><Card title="Iniciar revisão" eyebrow="Cinco escolhas explícitas"><p>O registro permanece local. Uma nota final é opcional e não altera recompensas ou desbloqueios.</p><Button onClick={() => sourceStoneId && start(sourceStoneId)}>Revisar o capítulo</Button></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const summary = summarizeEarthChapter(progress);
    return <div className="page page--earth page--earth-review page--earth-complete"><PageHeader eyebrow="Capítulo da Terra concluído" title="O Jardim Interior foi restaurado." description="O primeiro ciclo da Terra foi registrado, e o Santuário do Espírito está disponível para a próxima jornada."/><div className="earth-completion-grid"><Card className="earth-completion-card"><div className="earth-review-symbol earth-review-symbol--complete" aria-hidden="true"><CheckCircle2/></div><p className="eyebrow">Ciclo registrado</p><h2>Livro da Terra · Primeiro ciclo</h2><p>Identificador local: <code>{progress.cycleId}</code></p></Card><Card title="Destinos escolhidos" eyebrow="Sem ranking"><ul className="simple-list"><li><strong>{summary.preserve}</strong> práticas preservadas</li><li><strong>{summary.rest}</strong> práticas em repouso</li><li><strong>{summary.archive}</strong> práticas arquivadas</li></ul>{progress.note && <p className="earth-review-note">{progress.note}</p>}</Card></div><Card title="O Santuário desperta" eyebrow="Quinto elemento disponível"><div className="safety-summary"><Sparkles/><p>O Espírito começará por síntese entre palavra, emoção, impulso, corpo e ação, sem diagnóstico, leitura oculta ou exigência de coerência perfeita.</p></div><div className="earth-review-actions"><Button onClick={() => navigate('/temple/spirit-sanctuary')}>Entrar no Santuário</Button><Button variant="secondary" onClick={() => navigate('/temple/garden')}>Visitar o Jardim restaurado</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Voltar ao Átrio</Button></div></Card></div>;
  }

  const ready = canCompleteEarthChapter(progress);
  return <div className="page page--earth page--earth-review"><PageHeader eyebrow="Revisão geral da Terra" title="Escolha o destino de cada prática." description="Esses destinos organizam o Templo. Eles não classificam a experiência como sucesso, fracasso, disciplina ou desorganização."/><div className="earth-review-list">{(Object.keys(missionLabels) as EarthChapterMissionId[]).map((missionId) => { const mission = missionLabels[missionId]; return <Card key={missionId} title={mission.title} eyebrow={mission.component}><div className="earth-destination-options" role="group" aria-label={`Destino de ${mission.title}`}>{destinationOptions.map((option) => <button key={option.id} type="button" className="earth-destination-option" aria-pressed={progress.destinations[missionId] === option.id} onClick={() => selectDestination(missionId, option.id)}>{option.id === 'preserve' ? <CheckCircle2/> : option.id === 'rest' ? <MoonStar/> : <Archive/>}<span><strong>{option.label}</strong><small>{option.description}</small></span></button>)}</div></Card>; })}</div><Card title="Nota de encerramento" eyebrow="Opcional e local"><label className="field-label" htmlFor="earth-chapter-note">O que você deseja lembrar deste ciclo?</label><textarea id="earth-chapter-note" rows={5} value={progress.note ?? ''} onChange={(event) => setNote(event.target.value)} placeholder="Este campo pode permanecer vazio."/></Card><Card title="Concluir o capítulo" eyebrow="Abertura controlada do Santuário"><div className="safety-summary"><ShieldCheck/><p>O encerramento restaura o Jardim e abre a próxima sala. Ele não afirma que corpo, recursos, ritmo, ordem ou tarefas foram resolvidos.</p></div><Button disabled={!ready} onClick={() => { const completed = complete(); if (completed?.status === 'completed') applyEarthCompletionToTemple(); }}>Concluir o ciclo da Terra</Button>{!ready && <p className="field-help">Escolha um destino para cada uma das cinco práticas.</p>}</Card></div>;
}
