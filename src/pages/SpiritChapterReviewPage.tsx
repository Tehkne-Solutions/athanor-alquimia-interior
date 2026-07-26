import { Archive, CheckCircle2, Circle, MoonStar, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  canCompleteSpiritChapter,
  summarizeSpiritChapter,
  type SpiritChapterDestination,
  type SpiritChapterMissionId
} from '../domain/spiritChapter';
import { useAthanorStore } from '../state/useAthanorStore';
import { useSpiritChapterStore } from '../state/useSpiritChapterStore';
import { useSpiritOrbStore } from '../state/useSpiritOrbStore';

const missionLabels: Record<SpiritChapterMissionId, { title: string; component: string }> = {
  thread_that_gathers: { title: 'O Fio que Reúne', component: 'Fio da Síntese Possível' },
  center_without_erasing: { title: 'O Centro que Não Apaga as Partes', component: 'Nó do Centro Provisório' },
  council_of_parts: { title: 'O Conselho das Partes', component: 'Selo do Conselho Aberto' },
  decision_remains_open: { title: 'A Decisão que Permanece Aberta', component: 'Marca da Decisão Revisável' },
  return_without_condemnation: { title: 'O Retorno que Não Condena', component: 'Chave do Retorno Possível' }
};

const destinationOptions: { id: SpiritChapterDestination; label: string; description: string }[] = [
  { id: 'preserve', label: 'Preservar', description: 'Manter a prática disponível para consultas futuras.' },
  { id: 'rest', label: 'Repousar', description: 'Retirar a prática do fluxo ativo sem apagar o progresso.' },
  { id: 'archive', label: 'Arquivar', description: 'Registrar a conclusão sem manter a prática ativa.' }
];

function applySpiritCompletionToTemple(): void {
  const timestamp = new Date().toISOString();
  useAthanorStore.setState((state) => {
    if (!state.temple) return state;
    const rooms = state.temple.rooms.map((room) => {
      if (room.roomId === 'central-tree') {
        return {
          ...room,
          name: 'Santuário do Espírito',
          status: 'restored' as const,
          restorationProgress: 100,
          activeMissionId: undefined,
          placedItemIds: [...new Set([...room.placedItemIds, 'item_possible_integration_orb_v1'])]
        };
      }
      if (room.roomId === 'atrium') {
        return { ...room, restorationProgress: 100 };
      }
      return room;
    });

    return {
      temple: {
        ...state.temple,
        rooms,
        activeRoomId: 'central-tree',
        placedItems: [...new Set([...state.temple.placedItems, 'item_possible_integration_orb_v1'])],
        restorationLevel: Math.max(state.temple.restorationLevel, 10),
        updatedAt: timestamp
      },
      character: state.character
        ? { ...state.character, workLevel: 'new_work' as const, updatedAt: timestamp }
        : state.character
    };
  });
}

export function SpiritChapterReviewPage() {
  const navigate = useNavigate();
  const orbProgress = useSpiritOrbStore((state) => state.progress);
  const storedProgress = useSpiritChapterStore((state) => state.progress);
  const start = useSpiritChapterStore((state) => state.start);
  const selectDestination = useSpiritChapterStore((state) => state.selectDestination);
  const setNote = useSpiritChapterStore((state) => state.setNote);
  const complete = useSpiritChapterStore((state) => state.complete);

  const sourceOrbId = orbProgress?.craftedAt ?? (orbProgress ? `${orbProgress.sourceReturnKeyId}:orb` : undefined);
  const orbReady = Boolean(sourceOrbId && orbProgress?.status === 'integrated' && orbProgress.positioned);
  const progress = sourceOrbId && storedProgress?.sourceOrbId === sourceOrbId ? storedProgress : undefined;

  useEffect(() => {
    if (progress?.status === 'completed') applySpiritCompletionToTemple();
  }, [progress?.status]);

  if (!orbReady) {
    return <div className="page page--spirit page--spirit-review"><PageHeader eyebrow="Encerramento do Espírito" title="O ciclo ainda não está pronto para revisão geral." description="Integre e posicione primeiro o Orbe da Integração Possível. Criar o item sem revisão não conclui o capítulo."/><Card title="Dependência da jornada" eyebrow="Orbe integrado e posicionado"><p>A revisão organiza práticas concluídas, mas não confirma coerência, cura, maturidade ou integração espiritual.</p><Button onClick={() => navigate('/crafting/possible-integration-orb')}>Voltar ao Orbe</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--spirit page--spirit-review"><PageHeader eyebrow="Encerramento do Espírito" title="O Santuário recebeu um conjunto revisado." description="Escolha o destino de cada prática antes de restaurar integralmente o Santuário e abrir a Nova Obra."/><div className="spirit-review-intro-grid"><Card title="Primeiro ciclo do Espírito" eyebrow="Revisão sem pontuação"><div className="spirit-review-symbol" aria-hidden="true"><Circle/></div><p>Preservar, repousar e arquivar são destinos igualmente válidos. Nenhuma escolha mede pureza, coerência, maturidade ou elevação.</p></Card><Card title="Iniciar revisão" eyebrow="Cinco escolhas explícitas"><p>O registro permanece local. Uma nota final é opcional e não altera recompensas ou desbloqueios.</p><Button onClick={() => sourceOrbId && start(sourceOrbId)}>Revisar o capítulo</Button></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const summary = summarizeSpiritChapter(progress);
    return <div className="page page--spirit page--spirit-review page--spirit-complete"><PageHeader eyebrow="Capítulo do Espírito concluído" title="O Santuário foi restaurado." description="O primeiro grande percurso elemental foi registrado, e a Nova Obra está disponível sem apagar qualquer ciclo anterior."/><div className="spirit-completion-grid"><Card className="spirit-completion-card"><div className="spirit-review-symbol spirit-review-symbol--complete" aria-hidden="true"><CheckCircle2/></div><p className="eyebrow">Ciclo registrado</p><h2>Livro do Espírito · Primeiro ciclo</h2><p>Identificador local: <code>{progress.cycleId}</code></p></Card><Card title="Destinos escolhidos" eyebrow="Sem ranking"><ul className="simple-list"><li><strong>{summary.preserve}</strong> práticas preservadas</li><li><strong>{summary.rest}</strong> práticas em repouso</li><li><strong>{summary.archive}</strong> práticas arquivadas</li></ul>{progress.note && <p className="spirit-review-note">{progress.note}</p>}</Card></div><Card title="A Nova Obra está aberta" eyebrow="Modo contínuo do Templo"><div className="safety-summary"><Sparkles/><p>Escolha um novo ponto de partida, somente observe ou descanse. Nenhuma missão será reiniciada automaticamente.</p></div><div className="spirit-review-actions"><Button onClick={() => navigate('/temple/new-work')}>Abrir a Nova Obra</Button><Button variant="secondary" onClick={() => navigate('/temple/spirit-sanctuary')}>Visitar o Santuário restaurado</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Voltar ao Átrio</Button></div></Card></div>;
  }

  const ready = canCompleteSpiritChapter(progress);
  return <div className="page page--spirit page--spirit-review"><PageHeader eyebrow="Revisão geral do Espírito" title="Escolha o destino de cada prática." description="Esses destinos organizam o Templo. Eles não classificam a experiência como coerente, elevada, madura ou incompleta."/><div className="spirit-review-list">{(Object.keys(missionLabels) as SpiritChapterMissionId[]).map((missionId) => { const mission = missionLabels[missionId]; return <Card key={missionId} title={mission.title} eyebrow={mission.component}><div className="spirit-destination-options" role="group" aria-label={`Destino de ${mission.title}`}>{destinationOptions.map((option) => <button key={option.id} type="button" className="spirit-destination-option" aria-pressed={progress.destinations[missionId] === option.id} onClick={() => selectDestination(missionId, option.id)}>{option.id === 'preserve' ? <CheckCircle2/> : option.id === 'rest' ? <MoonStar/> : <Archive/>}<span><strong>{option.label}</strong><small>{option.description}</small></span></button>)}</div></Card>; })}</div><Card title="Nota de encerramento" eyebrow="Opcional e local"><label className="field-label" htmlFor="spirit-chapter-note">O que você deseja lembrar deste ciclo?</label><textarea id="spirit-chapter-note" rows={5} value={progress.note ?? ''} onChange={(event) => setNote(event.target.value)} placeholder="Este campo pode permanecer vazio."/></Card><Card title="Concluir o primeiro percurso" eyebrow="Abertura controlada da Nova Obra"><div className="safety-summary"><ShieldCheck/><p>O encerramento restaura o Santuário e abre o modo contínuo. Ele não afirma que palavra, emoção, impulso, corpo ou ação foram integrados definitivamente.</p></div><Button disabled={!ready} onClick={() => { const completed = complete(); if (completed?.status === 'completed') applySpiritCompletionToTemple(); }}>Concluir o ciclo do Espírito</Button>{!ready && <p className="field-help">Escolha um destino para cada uma das cinco práticas.</p>}</Card></div>;
}
