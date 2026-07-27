import { useState, type ChangeEvent } from 'react';
import { BookOpenText, CheckCircle2, Eye, FileJson, ShieldCheck, Upload, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { continuousInertJsonCatalog } from '../content/continuousInertJson';
import { continuousResourceCatalog } from '../content/continuousResource';
import {
  continuousReturnBiblicalUnit,
  continuousReturnCatalog,
  continuousReturnConsentSteps,
  continuousReturnRestrictions
} from '../content/continuousReturn';
import { continuousTextVisibilityCatalog } from '../content/continuousTextVisibility';
import { readContinuousJsonFile } from '../domain/continuousResource';
import {
  completeContinuousReturnReview,
  emptyContinuousReturnConsent,
  hasExplicitContinuousReturnConsent,
  type ContinuousReturnConsent,
  type ContinuousReturnSuccess
} from '../domain/continuousReturn';
import { parseContinuousResponseReturnWithConsistency } from '../domain/continuousReturnConsistency';

const consentFieldByStep = {
  file: 'file',
  preview: 'preview',
  'no-reopen': 'noReopen'
} as const;

export function ContinuousReturnPage() {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<ContinuousReturnSuccess>();
  const [consent, setConsent] = useState<ContinuousReturnConsent>(emptyContinuousReturnConsent);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<string>();
  const ready = hasExplicitContinuousReturnConsent(consent);

  const clearCandidate = () => {
    setCandidate(undefined);
    setConsent(emptyContinuousReturnConsent());
    setErrors([]);
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    clearCandidate();
    setMessage(undefined);
    if (!file) return;

    const readResult = await readContinuousJsonFile(file);
    if (!readResult.ok) {
      setErrors(readResult.errors);
      return;
    }

    const result = parseContinuousResponseReturnWithConsistency(readResult.value);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setCandidate(result);
  };

  const toggleConsent = (field: keyof ContinuousReturnConsent) => {
    setConsent((current) => ({ ...current, [field]: !current[field] }));
    setErrors([]);
    setMessage(undefined);
  };

  const complete = () => {
    if (!candidate) return;
    const result = completeContinuousReturnReview(candidate.package, consent);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    clearCandidate();
    setMessage('Leitura concluída e descartada. Nenhum histórico, resposta, lembrete ou reabertura foi criado.');
  };

  const discard = () => {
    clearCandidate();
    setMessage('O arquivo foi descartado sem registrar recusa, leitura ou ausência de resposta.');
  };

  return <div className="page page--continuous-return">
    <PageHeader
      eyebrow="O Retorno que Não Reabre o Ciclo"
      title="Leia um gesto sem transformar encerramento em nova espera."
      description="A resposta é validada e exibida apenas nesta tela. Concluir ou descartar não cria histórico, confirmação, vínculo, lembrete ou nova obrigação."
    />

    <div className="continuous-return-intro-grid">
      <Card title={continuousReturnBiblicalUnit.title} eyebrow={continuousReturnBiblicalUnit.reference}>
        <blockquote>{continuousReturnBiblicalUnit.principle}</blockquote>
        <p>{continuousReturnBiblicalUnit.context}</p>
        <div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a reflexão; a leitura transitória é uma estrutura autoral da Tehkné Solutions.</span></div>
      </Card>
      <Card title="Protocolo transitório" eyebrow={`Versão ${continuousReturnCatalog.version}`}>
        <ul className="simple-list">
          <li>Schema aceito: {continuousReturnCatalog.acceptedSchema}</li>
          <li>Modo: prévia local transitória</li>
          <li>Forma aceita: JSON inerte v{continuousInertJsonCatalog.version}</li>
          <li>Texto aceito: Unicode {continuousTextVisibilityCatalog.normalization} v{continuousTextVisibilityCatalog.version}</li>
          <li>Limite de arquivo: {continuousResourceCatalog.maxFileBytes / 1024} KiB</li>
        </ul>
        <div className="safety-summary"><ShieldCheck/><p>A ausência de arquivo ou de retorno continua sendo um encerramento completo.</p></div>
      </Card>
    </div>

    <Card title="1. Selecionar arquivo de retorno" eyebrow="Leitura exclusivamente local">
      <div className="continuous-return-upload">
        <label>
          <Upload aria-hidden="true"/>
          <span>Selecionar JSON da Fase 8.9</span>
          <input type="file" accept="application/json,.json" onChange={handleFile}/>
        </label>
        <p>O tamanho é conferido antes da leitura. Depois, forma inerte, orçamento estrutural, texto visível, selo, versão e gesto curado são validados sem criar histórico.</p>
      </div>
      {errors.length > 0 && <ul className="continuous-return-errors">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
    </Card>

    {candidate && <>
      <Card title="2. Prévia sanitizada" eyebrow="Nenhum registro criado">
        <div className="continuous-return-preview-heading"><Eye aria-hidden="true"/><div><strong>{candidate.package.gesture.label}</strong><p>{candidate.package.gesture.statement}</p></div></div>
        <dl className="continuous-return-meta">
          <div><dt>Coleção referenciada</dt><dd>{candidate.package.source.collectionLabel}</dd></div>
          <div><dt>Impressão descritiva</dt><dd><code>{candidate.package.source.fingerprint}</code></dd></div>
          <div><dt>Quantidade descritiva</dt><dd>{candidate.package.source.itemCount}</dd></div>
          <div><dt>Estado na resposta</dt><dd>{candidate.package.source.status === 'active' ? 'ativa' : 'arquivada'}</dd></div>
        </dl>
        <ul className="simple-list">{[...candidate.package.notices, ...candidate.warnings].map((notice) => <li key={notice}>{notice}</li>)}</ul>
        <details className="continuous-return-json"><summary><FileJson size={16}/> Inspecionar pacote sanitizado</summary><pre>{JSON.stringify(candidate.package, null, 2)}</pre></details>
      </Card>

      <Card title="3. Confirmar encerramento" eyebrow="Três escolhas explícitas">
        <div className="continuous-return-consents">
          {continuousReturnConsentSteps.map((step) => {
            const field = consentFieldByStep[step.id];
            return <label key={step.id}>
              <input type="checkbox" checked={consent[field]} onChange={() => toggleConsent(field)}/>
              <span><strong>{step.label}</strong><small>{step.description}</small></span>
            </label>;
          })}
        </div>
        <div className="continuous-return-actions">
          <Button disabled={!ready} onClick={complete}><CheckCircle2 size={18}/> Concluir e descartar</Button>
          <Button variant="ghost" onClick={discard}><XCircle size={17}/> Descartar sem concluir</Button>
        </div>
      </Card>
    </>}

    {message && <p className="continuous-return-success">{message}</p>}

    <Card title="Limites do retorno" eyebrow="Sem reabertura">
      <ul className="simple-list">{continuousReturnRestrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul>
      <div className="continuous-return-actions"><Button variant="secondary" onClick={() => navigate('/temple/continuous-collections')}>Abrir minhas coleções</Button><Button variant="secondary" onClick={() => navigate('/temple/continuous-received')}>Biblioteca recebida</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Voltar ao Átrio</Button></div>
    </Card>
  </div>;
}
