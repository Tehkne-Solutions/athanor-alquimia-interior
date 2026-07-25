import { ArrowRight, BookOpenText, CheckCircle2, Clock3, Flame, LockKeyhole, Shield, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { fireBoundaryActionOptions, fireBoundaryDurationOptions } from '../content/fireBoundary';
import { fireFoundationBiblicalUnit } from '../content/fireFoundation';
import { fireExitOptions, fireIntervalOptions } from '../content/fireInterval';
import { fireActionOptions, fireEmotionOptions } from '../content/fireMission';
import { useAthanorStore } from '../state/useAthanorStore';
import { useFireBoundaryStore } from '../state/useFireBoundaryStore';
import { useFireIntervalStore } from '../state/useFireIntervalStore';
import { useFireMissionStore } from '../state/useFireMissionStore';
import { useWaterChapterStore } from '../state/useWaterChapterStore';

export function ForgePage() {
  const navigate = useNavigate();
  const forge = useAthanorStore((state) => state.temple?.rooms.find((room) => room.roomId === 'forge'));
  const waterChapter = useWaterChapterStore((state) => state.progress);
  const rawFireProgress = useFireMissionStore((state) => state.progress);
  const rawIntervalProgress = useFireIntervalStore((state) => state.progress);
  const rawBoundaryProgress = useFireBoundaryStore((state) => state.progress);
  const sourceWaterCycleId = waterChapter?.cycleId ?? waterChapter?.completedAt;
  const fireProgress = sourceWaterCycleId && rawFireProgress?.sourceWaterCycleId === sourceWaterCycleId
    ? rawFireProgress
    : undefined;
  const sourceNamedFlameId = fireProgress?.status === 'completed'
    ? fireProgress.completedAt ?? fireProgress.updatedAt
    : undefined;
  const intervalProgress = sourceNamedFlameId && rawIntervalProgress?.sourceNamedFlameId === sourceNamedFlameId
    ? rawIntervalProgress
    : undefined;
  const sourceIntervalEmberId = intervalProgress?.status === 'completed' && intervalProgress.intervalEmberCreated
    ? intervalProgress.completedAt ?? `${intervalProgress.sourceNamedFlameId}:interval-ember`
    : undefined;
  const boundaryProgress = sourceIntervalEmberId && rawBoundaryProgress?.sourceIntervalEmberId === sourceIntervalEmberId
    ? rawBoundaryProgress
    : undefined;
  const available = Boolean(
    forge
      && forge.status !== 'dormant'
      && forge.status !== 'hidden'
      && waterChapter?.status === 'completed'
  );

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

  const selectedAction = fireActionOptions.find((option) => option.id === fireProgress?.action);
  const selectedEmotionLabels = fireEmotionOptions.filter((option) => fireProgress?.emotions.includes(option.id)).map((option) => option.label);
  const selectedInterval = fireIntervalOptions.find((option) => option.id === intervalProgress?.interval);
  const selectedExit = fireExitOptions.find((option) => option.id === intervalProgress?.exit);
  const selectedBoundaryAction = fireBoundaryActionOptions.find((option) => option.id === boundaryProgress?.action);
  const selectedBoundaryDuration = fireBoundaryDurationOptions.find((option) => option.id === boundaryProgress?.duration);

  const missionLabel = fireProgress?.status === 'completed' ? 'Revisar a Chama Nomeada' : fireProgress ? 'Continuar O Nome da Chama' : 'Iniciar O Nome da Chama';
  const intervalLabel = intervalProgress?.status === 'completed' ? 'Revisar a Brasa do Intervalo' : intervalProgress ? 'Continuar O Instante Antes do Gesto' : 'Iniciar O Instante Antes do Gesto';
  const boundaryLabel = boundaryProgress?.status === 'completed' ? 'Revisar a Placa do Limite' : boundaryProgress ? 'Continuar O Limite que Protege' : 'Iniciar O Limite que Protege';

  return (
    <div className="page page--fire">
      <PageHeader
        eyebrow="Forja dos Elementos"
        title={boundaryProgress?.status === 'completed'
          ? 'O Fogo recebeu forma, duração e revisão.'
          : intervalProgress?.status === 'completed'
            ? 'A chama recebeu um intervalo antes do gesto.'
            : fireProgress?.status === 'completed'
              ? 'A primeira chama recebeu nome e medida.'
              : 'A chama pode ser reconhecida antes de pedir ação.'}
        description="O Fogo trabalha intensidade, impulso, limite e ação proporcional sem transformar emoções em diagnóstico ou autorização para confronto."
      />
      <div className="fire-foundation-grid">
        <Card className={fireProgress?.status === 'completed' ? 'fire-hero-card fire-hero-card--named' : 'fire-hero-card'}>
          <div className="fire-hero-symbol" aria-hidden="true">{boundaryProgress?.status === 'completed' ? <Shield/> : <Flame/>}</div>
          <div>
            <p className="eyebrow">Estado da Forja</p>
            <h2>{boundaryProgress?.status === 'completed'
              ? 'Placa do Limite criada'
              : intervalProgress?.status === 'completed'
                ? 'Brasa do Intervalo criada'
                : fireProgress?.status === 'completed'
                  ? 'Chama Nomeada criada'
                  : fireProgress ? 'Missão em andamento' : 'Primeira missão disponível'}</h2>
            <p>{boundaryProgress?.status === 'completed'
              ? 'Três componentes registram intensidade, intervalo e limite. O capítulo do Fogo ainda não está concluído.'
              : intervalProgress?.status === 'completed'
                ? 'Dois componentes registram reconhecimento e intervalo. O capítulo do Fogo ainda não está concluído.'
                : fireProgress?.status === 'completed'
                  ? 'O componente registra um ciclo de reconhecimento, pausa e ação escolhida. Ele não conclui o capítulo do Fogo.'
                  : 'A missão diferencia emoção, impulso, necessidade e ação usando escolhas opcionais e frases fictícias.'}</p>
          </div>
        </Card>

        <Card title={fireFoundationBiblicalUnit.title} eyebrow={fireFoundationBiblicalUnit.reference}>
          <blockquote>{fireFoundationBiblicalUnit.principle}</blockquote>
          <p>{fireFoundationBiblicalUnit.context}</p>
          <div className="provenance-inline"><BookOpenText size={17}/><span>Fonte bíblica como núcleo editorial. Gevurah, Shin, I Ching e Tarot permanecem camadas opcionais e identificadas.</span></div>
        </Card>

        <Card title="O Nome da Chama" eyebrow="Primeira missão do Fogo">
          <p>Reconheça movimentos de intensidade, crie um intervalo inicial e escolha um passo limitado — inclusive não responder agora.</p>
          <Button onClick={() => navigate('/mission/name-the-flame')}>{missionLabel} <ArrowRight size={18}/></Button>
        </Card>

        {fireProgress?.status === 'completed' && (
          <Card title="O Instante Antes do Gesto" eyebrow="Segunda missão do Fogo">
            <p>Organize uma sequência fictícia, diferencie urgência verificável de pressão percebida e escolha uma saída segura.</p>
            <Button onClick={() => navigate('/mission/before-the-gesture')}>{intervalLabel} <Clock3 size={18}/></Button>
          </Card>
        )}

        {intervalProgress?.status === 'completed' && (
          <Card title="O Limite que Protege" eyebrow="Terceira missão do Fogo">
            <p>Diferencie limite, controle e punição e construa uma formulação em primeira pessoa com duração e revisão.</p>
            <ul className="simple-list"><li>não solicita nomes ou conflitos reais;</li><li>nenhuma opção controla terceiros;</li><li>o limite pode permanecer aberto à revisão;</li><li>nenhuma ação agora continua válida.</li></ul>
            <Button onClick={() => navigate('/mission/limit-that-protects')}>{boundaryLabel} <Shield size={18}/></Button>
          </Card>
        )}

        {fireProgress?.status === 'completed' && (
          <Card title="Chama Nomeada" eyebrow="Primeiro componente criado">
            <div className="fire-component-summary"><CheckCircle2/><div><strong>{selectedEmotionLabels.length ? selectedEmotionLabels.join(', ') : 'Check-in recusado'}</strong><p>{selectedAction?.label ?? 'Ação não registrada'}</p></div></div>
            <p className="field-help">O componente não é prova de controle, coragem ou melhora.</p>
          </Card>
        )}

        {intervalProgress?.status === 'completed' && (
          <Card title="Brasa do Intervalo" eyebrow="Segundo componente criado">
            <div className="fire-component-summary"><Clock3/><div><strong>{selectedInterval?.label ?? 'Intervalo não registrado'}</strong><p>{selectedExit?.label ?? 'Saída não registrada'}</p></div></div>
            <p className="field-help">A Brasa registra apenas a conclusão didática da missão.</p>
          </Card>
        )}

        {boundaryProgress?.status === 'completed' && (
          <Card title="Placa do Limite" eyebrow="Terceiro componente criado">
            <div className="fire-component-summary"><Shield/><div><strong>{selectedBoundaryAction?.label ?? 'Ação não registrada'}</strong><p>{selectedBoundaryDuration?.label ?? 'Duração não registrada'}</p></div></div>
            <p className="field-help">A Placa não controla terceiros, não garante proteção e não prova assertividade.</p>
          </Card>
        )}

        <Card title="Limites da Forja" eyebrow="Segurança">
          <div className="safety-summary"><ShieldCheck/><p>O Athanor não incentiva confronto perigoso, retaliação, punição ou permanência em situação de risco. Estados críticos interrompem o simbolismo.</p></div>
          <Button variant="ghost" onClick={() => navigate('/safety?source=fire')}>Abrir apoio direto</Button>
        </Card>
      </div>
    </div>
  );
}
