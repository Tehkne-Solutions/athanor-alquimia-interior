import { BookOpenText, CheckCircle2, CupSoda, Layers3, MoonStar, RotateCcw, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  waterChaliceComponentLabels,
  waterChaliceIntentions,
  waterChaliceLimits,
  waterChaliceRecipe,
  waterChaliceReviewWindows
} from '../content/waterChalice';
import { waterCareActions } from '../content/waterTrust';
import { canCraftWaterChalice } from '../domain/waterChalice';
import type { ReviewOutcome } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useWaterChaliceStore } from '../state/useWaterChaliceStore';
import { useWaterLamentStore } from '../state/useWaterLamentStore';
import { useWaterMemoryStore } from '../state/useWaterMemoryStore';
import { useWaterTrustStore } from '../state/useWaterTrustStore';

const lifecycleLabels = {
  crafting: 'Receita em preparação',
  active: 'Cálice criado',
  awaiting_review: 'Aguardando revisão',
  adjusted: 'Receita ajustada',
  integrated: 'Ciclo integrado',
  resting: 'Ciclo em repouso'
} as const;

export function WaterChalicePage() {
  const navigate = useNavigate();
  const [reflection, setReflection] = useState('');
  const waterJourney = useAthanorStore((state) => state.waterJourney);
  const lamentProgress = useWaterLamentStore((state) => state.progress);
  const lamentJourneyStartedAt = useWaterLamentStore((state) => state.journeyStartedAt);
  const memoryProgress = useWaterMemoryStore((state) => state.progress);
  const trustProgress = useWaterTrustStore((state) => state.progress);
  const storedProgress = useWaterChaliceStore((state) => state.progress);
  const start = useWaterChaliceStore((state) => state.start);
  const selectIntention = useWaterChaliceStore((state) => state.selectIntention);
  const selectCareAction = useWaterChaliceStore((state) => state.selectCareAction);
  const selectLimit = useWaterChaliceStore((state) => state.selectLimit);
  const selectReviewWindow = useWaterChaliceStore((state) => state.selectReviewWindow);
  const craft = useWaterChaliceStore((state) => state.craft);
  const requestReview = useWaterChaliceStore((state) => state.requestReview);
  const review = useWaterChaliceStore((state) => state.review);
  const resume = useWaterChaliceStore((state) => state.resume);
  const position = useWaterChaliceStore((state) => state.position);

  const journeyId = waterJourney?.startedAt;
  const namingCompleted = Boolean(waterJourney?.namedDropCreated);
  const lamentCompleted = Boolean(
    journeyId && lamentJourneyStartedAt === journeyId && lamentProgress?.status === 'completed'
  );
  const memoryCompleted = Boolean(
    journeyId && memoryProgress?.journeyStartedAt === journeyId && memoryProgress.status === 'completed'
  );
  const trustCompleted = Boolean(
    journeyId && trustProgress?.journeyStartedAt === journeyId && trustProgress.status === 'completed'
  );
  const prerequisitesComplete = namingCompleted && lamentCompleted && memoryCompleted && trustCompleted;
  const progress = journeyId && storedProgress?.journeyStartedAt === journeyId ? storedProgress : undefined;

  if (!prerequisitesComplete) {
    return (
      <div className="page page--water page--chalice">
        <PageHeader
          eyebrow="Capítulo da Água · Crafting"
          title="A receita do Cálice ainda está incompleta."
          description="Reúna primeiro os quatro componentes da Câmara dos Salmos. Nenhuma etapa pode ser substituída por sofrimento, intensidade ou quantidade de texto."
        />
        <Card title="Componentes necessários" eyebrow="Quatro práticas concluídas">
          <ul className="chalice-component-list">
            <li data-complete={namingCompleted}>{namingCompleted ? 'Disponível' : 'Pendente'} · Gota Nomeada</li>
            <li data-complete={lamentCompleted}>{lamentCompleted ? 'Disponível' : 'Pendente'} · Fragmento do Lamento</li>
            <li data-complete={memoryCompleted}>{memoryCompleted ? 'Disponível' : 'Pendente'} · Espelho das Águas</li>
            <li data-complete={trustCompleted}>{trustCompleted ? 'Disponível' : 'Pendente'} · Ponte da Confiança</li>
          </ul>
          <Button onClick={() => navigate('/temple/psalms-chamber')}>Voltar à Câmara</Button>
        </Card>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="page page--water page--chalice">
        <PageHeader
          eyebrow="Capítulo da Água · Crafting"
          title="A Forja do Cálice"
          description="Reúna os quatro componentes em uma intenção, uma ação, um limite e uma revisão."
        />
        <div className="chalice-intro-grid">
          <Card title={waterChaliceRecipe.name} eyebrow="Artefato integrador da Água">
            <div className="chalice-preview" aria-hidden="true"><CupSoda/></div>
            <blockquote>{waterChaliceRecipe.principle}</blockquote>
            <div className="provenance-inline"><BookOpenText size={17}/><span>Os Salmos iniciaram cada missão. O Cálice é uma síntese de gameplay criada pela Tehkné Solutions.</span></div>
          </Card>
          <Card title="Iniciar a receita" eyebrow="Sem ação obrigatória">
            <p>A ação pode ser “Nenhuma ação agora”. O limite e a revisão servem para impedir que o item seja tratado como promessa, solução imediata ou obrigação permanente.</p>
            <Button onClick={() => journeyId && start(journeyId, trustProgress?.careAction)}>Organizar a receita</Button>
          </Card>
        </div>
      </div>
    );
  }

  const selectedIntention = waterChaliceIntentions.find((item) => item.id === progress.intention);
  const selectedAction = waterCareActions.find((item) => item.id === progress.careAction);
  const selectedLimit = waterChaliceLimits.find((item) => item.id === progress.limit);
  const selectedReview = waterChaliceReviewWindows.find((item) => item.id === progress.reviewWindow);

  const submitReview = (outcome: ReviewOutcome) => {
    review(outcome, reflection);
    setReflection('');
  };

  if (progress.status === 'integrated') {
    return (
      <div className="page page--water page--chalice">
        <PageHeader
          eyebrow={progress.positioned ? 'Câmara restaurada' : 'Ciclo integrado'}
          title={progress.positioned ? 'O Cálice ocupa seu lugar na Câmara.' : 'O Cálice da Memória Serena foi integrado.'}
          description="O item registra um ciclo revisado. Ele não apaga memórias, não produz serenidade automática e não oferece proteção externa."
        />
        <div className="chalice-result-grid">
          <Card className="chalice-item-card">
            <div className="chalice-preview chalice-preview--complete" aria-hidden="true"><CupSoda/></div>
            <p className="eyebrow">Instrumento de jornada</p>
            <h2>Cálice da Memória Serena</h2>
            <span className="item-status item-status--integrated">Integrado</span>
          </Card>
          <Card title="Fórmula integrada" eyebrow="Ação limitada e revisada">
            <ul className="simple-list">
              <li><strong>Intenção:</strong> {selectedIntention?.label}</li>
              <li><strong>Ação:</strong> {selectedAction?.label}</li>
              <li><strong>Limite:</strong> {selectedLimit?.label}</li>
              <li><strong>Revisão:</strong> {selectedReview?.label}</li>
            </ul>
            {progress.reflection && <p className="chalice-reflection">{progress.reflection}</p>}
          </Card>
        </div>
        <Card title={progress.positioned ? 'Item posicionado' : 'Posicionar na Câmara'} eyebrow="Transformação do Templo">
          <p>{progress.positioned
            ? 'A Câmara dos Salmos reconhece a conclusão do primeiro ciclo da Água.'
            : 'Posicionar o Cálice restaura visualmente a Câmara. O item continua disponível para consulta e revisão futura.'}</p>
          <div className="water-mission-actions">
            {!progress.positioned && <Button onClick={position}>Posicionar o Cálice</Button>}
            <Button variant="secondary" onClick={() => navigate('/temple/psalms-chamber')}>Voltar à Câmara</Button>
            <Button variant="ghost" onClick={() => navigate('/inventory')}>Abrir inventário</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (progress.status === 'resting') {
    return (
      <div className="page page--water page--chalice">
        <PageHeader eyebrow="Ciclo em repouso" title="O Cálice permanece guardado sem desaparecer." description="Repousar não apaga componentes, não reduz progresso e não cria prazo obrigatório de retorno." />
        <Card title="Retomar quando fizer sentido" eyebrow="Sem sequência perdida">
          <div className="safety-summary"><MoonStar/><p>A receita e as escolhas permanecem salvas localmente.</p></div>
          <div className="water-mission-actions">
            <Button onClick={resume}><RotateCcw size={18}/> Retomar e ajustar</Button>
            <Button variant="ghost" onClick={() => navigate('/temple/psalms-chamber')}>Voltar à Câmara</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (progress.status === 'awaiting_review') {
    return (
      <div className="page page--water page--chalice">
        <PageHeader eyebrow="Revisão do Cálice" title="A criação ainda não encerra o ciclo." description="Revise a fórmula e escolha integrar, ajustar ou repousar." />
        <div className="chalice-review-grid">
          <Card title="Fórmula atual" eyebrow={lifecycleLabels[progress.status]}>
            <ul className="simple-list">
              <li><strong>Intenção:</strong> {selectedIntention?.label}</li>
              <li><strong>Ação:</strong> {selectedAction?.label}</li>
              <li><strong>Limite:</strong> {selectedLimit?.label}</li>
              <li><strong>Revisão:</strong> {selectedReview?.label}</li>
            </ul>
          </Card>
          <Card title="Registro opcional" eyebrow="Não altera recompensa">
            <label className="field-label" htmlFor="chalice-reflection">O que você deseja preservar desta revisão?</label>
            <textarea id="chalice-reflection" value={reflection} onChange={(event) => setReflection(event.target.value)} rows={5} placeholder="Este campo pode permanecer vazio."/>
          </Card>
        </div>
        <Card title="Destino do ciclo" eyebrow="Escolha reversível">
          <div className="chalice-review-actions">
            <Button onClick={() => submitReview('integrated')}>Integrar o Cálice</Button>
            <Button variant="secondary" onClick={() => submitReview('adjusted')}>Ajustar a fórmula</Button>
            <Button variant="ghost" onClick={() => submitReview('resting')}>Colocar em repouso</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (progress.status === 'active') {
    return (
      <div className="page page--water page--chalice">
        <PageHeader eyebrow="Cálice criado" title="A fórmula agora precisa de retorno." description="Criar o item não significa que a ação funcionou ou que o ciclo foi integrado." />
        <div className="chalice-result-grid">
          <Card className="chalice-item-card">
            <div className="chalice-preview" aria-hidden="true"><CupSoda/></div>
            <h2>Cálice da Memória Serena</h2>
            <span className="item-status item-status--active">Ativo</span>
          </Card>
          <Card title="Próxima etapa" eyebrow="Revisão explícita">
            <p>Quando desejar, envie a fórmula para revisão. O Athanor não verifica se uma ação externa foi executada.</p>
            <Button onClick={requestReview}>Revisar o Cálice agora</Button>
          </Card>
        </div>
      </div>
    );
  }

  const craftReady = canCraftWaterChalice(progress);

  return (
    <div className="page page--water page--chalice">
      <PageHeader
        eyebrow={progress.status === 'adjusted' ? 'Receita em ajuste' : 'Crafting da Água'}
        title="Organize a fórmula do Cálice."
        description="Cada escolha é limitada, reversível e armazenada somente neste dispositivo."
      />

      <Card title="Componentes reunidos" eyebrow="Quatro práticas da Água">
        <div className="chalice-components-grid">
          {waterChaliceRecipe.componentIds.map((id) => (
            <div key={id} className="chalice-component"><CheckCircle2/><strong>{waterChaliceComponentLabels[id]}</strong><small>Disponível</small></div>
          ))}
        </div>
      </Card>

      <div className="chalice-form-grid">
        <Card title="1. Intenção" eyebrow="O que o recipiente organizará">
          <div className="chalice-option-list">
            {waterChaliceIntentions.map((item) => <button key={item.id} type="button" aria-pressed={progress.intention === item.id} onClick={() => selectIntention(item.id)}><strong>{item.label}</strong><span>{item.description}</span></button>)}
          </div>
        </Card>
        <Card title="2. Ação de cuidado" eyebrow="Inclui não agir agora">
          <div className="chalice-option-list">
            {waterCareActions.map((item) => <button key={item.id} type="button" aria-pressed={progress.careAction === item.id} onClick={() => selectCareAction(item.id)}><strong>{item.label}</strong><span>{item.description}</span></button>)}
          </div>
        </Card>
        <Card title="3. Limite" eyebrow="Quando interromper ou reduzir">
          <div className="chalice-option-list">
            {waterChaliceLimits.map((item) => <button key={item.id} type="button" aria-pressed={progress.limit === item.id} onClick={() => selectLimit(item.id)}><strong>{item.label}</strong><span>{item.description}</span></button>)}
          </div>
        </Card>
        <Card title="4. Revisão" eyebrow="Quando retornar à fórmula">
          <div className="chalice-option-list">
            {waterChaliceReviewWindows.map((item) => <button key={item.id} type="button" aria-pressed={progress.reviewWindow === item.id} onClick={() => selectReviewWindow(item.id)}><strong>{item.label}</strong><span>{item.description}</span></button>)}
          </div>
        </Card>
      </div>

      <Card title="Limites do item" eyebrow="Síntese Athanor">
        <div className="safety-summary"><ShieldCheck/><p>O Cálice não apaga emoções ou memórias, não garante serenidade e não substitui apoio humano ou profissional.</p></div>
        <ul className="simple-list">{waterChaliceRecipe.restrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul>
        <div className="water-mission-actions">
          <Button variant="ghost" onClick={() => navigate('/temple/psalms-chamber')}>Pausar e voltar</Button>
          <Button disabled={!craftReady} onClick={craft}><Layers3 size={18}/> Criar Cálice</Button>
        </div>
      </Card>
    </div>
  );
}
