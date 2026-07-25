import { Archive, CheckCircle2, Droplets, Flame, MoonStar, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  canCompleteWaterChapter,
  summarizeWaterChapter,
  type WaterChapterDestination,
  type WaterChapterMissionId
} from '../domain/waterChapter';
import { useAthanorStore } from '../state/useAthanorStore';
import { useWaterChaliceStore } from '../state/useWaterChaliceStore';
import { useWaterChapterStore } from '../state/useWaterChapterStore';

const missionLabels: Record<WaterChapterMissionId, { title: string; component: string }> = {
  name_the_waters: { title: 'O Nome das Águas', component: 'Gota Nomeada' },
  voice_of_lament: { title: 'A Voz do Lamento', component: 'Fragmento do Lamento' },
  mirror_of_memories: { title: 'O Espelho das Memórias', component: 'Espelho das Águas' },
  space_of_trust: { title: 'O Espaço da Confiança', component: 'Ponte da Confiança' }
};

const destinationOptions: { id: WaterChapterDestination; label: string; description: string }[] = [
  { id: 'preserve', label: 'Preservar', description: 'Manter o aprendizado disponível para consultas futuras.' },
  { id: 'rest', label: 'Repousar', description: 'Retirar a prática do fluxo ativo sem apagar o progresso.' },
  { id: 'archive', label: 'Arquivar', description: 'Registrar a conclusão sem manter a prática ativa.' }
];

function applyWaterCompletionToTemple(): void {
  const timestamp = new Date().toISOString();
  useAthanorStore.setState((state) => {
    if (!state.temple) return state;
    const rooms = state.temple.rooms.map((room) => {
      if (room.roomId === 'psalms-chamber') {
        return {
          ...room,
          status: 'restored' as const,
          restorationProgress: 100,
          activeMissionId: undefined,
          placedItemIds: [...new Set([...room.placedItemIds, 'item_memory_serene_chalice_v1'])]
        };
      }
      if (room.roomId === 'forge') {
        return {
          ...room,
          status: room.status === 'restored' ? room.status : 'available' as const,
          restorationProgress: Math.max(room.restorationProgress, 8),
          activeMissionId: 'mission_name_flame_v1'
        };
      }
      if (room.roomId === 'atrium') {
        return { ...room, restorationProgress: Math.max(room.restorationProgress, 78) };
      }
      return room;
    });

    return {
      temple: {
        ...state.temple,
        rooms,
        placedItems: [...new Set([...state.temple.placedItems, 'item_memory_serene_chalice_v1'])],
        restorationLevel: Math.max(state.temple.restorationLevel, 5),
        updatedAt: timestamp
      },
      character: state.character
        ? { ...state.character, workLevel: 'form' as const, updatedAt: timestamp }
        : state.character
    };
  });
}

export function WaterChapterReviewPage() {
  const navigate = useNavigate();
  const waterJourney = useAthanorStore((state) => state.waterJourney);
  const chaliceProgress = useWaterChaliceStore((state) => state.progress);
  const storedProgress = useWaterChapterStore((state) => state.progress);
  const start = useWaterChapterStore((state) => state.start);
  const selectDestination = useWaterChapterStore((state) => state.selectDestination);
  const setNote = useWaterChapterStore((state) => state.setNote);
  const complete = useWaterChapterStore((state) => state.complete);

  const journeyStartedAt = waterJourney?.startedAt;
  const chaliceReady = Boolean(
    journeyStartedAt
      && chaliceProgress?.journeyStartedAt === journeyStartedAt
      && chaliceProgress.status === 'integrated'
      && chaliceProgress.positioned
  );
  const progress = journeyStartedAt && storedProgress?.journeyStartedAt === journeyStartedAt
    ? storedProgress
    : undefined;

  useEffect(() => {
    if (progress?.status === 'completed') applyWaterCompletionToTemple();
  }, [progress?.status]);

  if (!chaliceReady) {
    return (
      <div className="page page--water page--water-review">
        <PageHeader eyebrow="Encerramento da Água" title="O ciclo ainda não está pronto para revisão geral." description="Integre e posicione primeiro o Cálice da Memória Serena. Criar o item sem revisão não conclui o capítulo." />
        <Card title="Dependência da jornada" eyebrow="Cálice integrado e posicionado">
          <p>A revisão geral somente organiza práticas já concluídas. Ela não substitui nenhuma das quatro missões nem o retorno ao crafting.</p>
          <Button onClick={() => navigate('/crafting/memory-serene-chalice')}>Voltar ao Cálice</Button>
        </Card>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="page page--water page--water-review">
        <PageHeader eyebrow="Encerramento da Água" title="As águas encontraram um recipiente." description="Revise o destino de cada prática antes de restaurar integralmente a Câmara e abrir a Forja." />
        <div className="water-review-intro-grid">
          <Card title="Primeiro ciclo da Água" eyebrow="Revisão sem pontuação">
            <div className="water-review-symbol" aria-hidden="true"><Droplets/></div>
            <p>Preservar, repousar e arquivar são destinos igualmente válidos. Nenhuma escolha altera seu valor, maturidade ou condição emocional.</p>
          </Card>
          <Card title="Iniciar revisão" eyebrow="Quatro escolhas explícitas">
            <p>O registro permanece local. Uma nota final é opcional e não altera recompensas ou desbloqueios.</p>
            <Button onClick={() => journeyStartedAt && start(journeyStartedAt)}>Revisar o capítulo</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (progress.status === 'completed') {
    const summary = summarizeWaterChapter(progress);
    return (
      <div className="page page--water page--water-review page--water-complete">
        <PageHeader eyebrow="Capítulo da Água concluído" title="A Câmara dos Salmos foi restaurada." description="O primeiro ciclo da Água foi registrado, e a Forja dos Elementos está disponível para a próxima jornada." />
        <div className="water-completion-grid">
          <Card className="water-completion-card">
            <div className="water-review-symbol water-review-symbol--complete" aria-hidden="true"><CheckCircle2/></div>
            <p className="eyebrow">Ciclo registrado</p>
            <h2>Livro das Águas · Primeiro ciclo</h2>
            <p>Identificador local: <code>{progress.cycleId}</code></p>
          </Card>
          <Card title="Destinos escolhidos" eyebrow="Sem ranking">
            <ul className="simple-list">
              <li><strong>{summary.preserve}</strong> práticas preservadas</li>
              <li><strong>{summary.rest}</strong> práticas em repouso</li>
              <li><strong>{summary.archive}</strong> práticas arquivadas</li>
            </ul>
            {progress.note && <p className="water-review-note">{progress.note}</p>}
          </Card>
        </div>
        <Card title="A Forja desperta" eyebrow="Próximo capítulo disponível">
          <div className="safety-summary"><Flame/><p>O Fogo começará pelo reconhecimento da intensidade, sem tratar ira, coragem ou urgência como diagnóstico ou autorização para agir.</p></div>
          <div className="water-mission-actions">
            <Button onClick={() => navigate('/temple/forge')}>Entrar na Forja</Button>
            <Button variant="secondary" onClick={() => navigate('/temple/psalms-chamber')}>Visitar a Câmara restaurada</Button>
            <Button variant="ghost" onClick={() => navigate('/temple')}>Voltar ao Átrio</Button>
          </div>
        </Card>
      </div>
    );
  }

  const ready = canCompleteWaterChapter(progress);

  return (
    <div className="page page--water page--water-review">
      <PageHeader eyebrow="Revisão geral da Água" title="Escolha o destino de cada prática." description="Esses destinos organizam o Templo. Eles não classificam a experiência como sucesso, fracasso, cura ou regressão." />

      <div className="water-review-list">
        {(Object.keys(missionLabels) as WaterChapterMissionId[]).map((missionId) => {
          const mission = missionLabels[missionId];
          return (
            <Card key={missionId} title={mission.title} eyebrow={mission.component}>
              <div className="water-destination-options" role="group" aria-label={`Destino de ${mission.title}`}>
                {destinationOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="water-destination-option"
                    aria-pressed={progress.destinations[missionId] === option.id}
                    onClick={() => selectDestination(missionId, option.id)}
                  >
                    {option.id === 'preserve' ? <CheckCircle2/> : option.id === 'rest' ? <MoonStar/> : <Archive/>}
                    <span><strong>{option.label}</strong><small>{option.description}</small></span>
                  </button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <Card title="Nota de encerramento" eyebrow="Opcional e local">
        <label className="field-label" htmlFor="water-chapter-note">O que você deseja lembrar deste ciclo?</label>
        <textarea
          id="water-chapter-note"
          rows={5}
          value={progress.note ?? ''}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Este campo pode permanecer vazio."
        />
      </Card>

      <Card title="Concluir o capítulo" eyebrow="Abertura controlada da Forja">
        <div className="safety-summary"><ShieldCheck/><p>O encerramento restaura a Câmara e abre a próxima sala. Ele não afirma que emoções, memórias ou necessidades foram resolvidas.</p></div>
        <Button
          disabled={!ready}
          onClick={() => {
            const completed = complete();
            if (completed?.status === 'completed') applyWaterCompletionToTemple();
          }}
        >Concluir o ciclo da Água</Button>
        {!ready && <p className="field-help">Escolha um destino para cada uma das quatro práticas.</p>}
      </Card>
    </div>
  );
}
