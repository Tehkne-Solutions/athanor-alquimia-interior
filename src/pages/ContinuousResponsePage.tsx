import { useMemo, useState } from 'react';
import { ArrowLeft, BookOpenText, Download, Eye, FileJson, MessageCircleReply, ShieldCheck, VolumeX } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  continuousResponseBiblicalUnit,
  continuousResponseCatalog,
  continuousResponseConsentSteps,
  continuousResponseGestures,
  continuousResponseRestrictions,
  type ContinuousResponseGestureId
} from '../content/continuousResponse';
import { findReceivedCollection } from '../domain/continuousReceive';
import {
  buildContinuousResponsePreview,
  createContinuousResponseExport,
  emptyContinuousResponseConsent,
  hasExplicitContinuousResponseConsent,
  type ContinuousResponseConsent
} from '../domain/continuousResponse';
import { useContinuousReceivedStore } from '../state/useContinuousReceivedStore';

const consentFieldByStep = {
  source: 'source',
  preview: 'preview',
  'local-file': 'localFile',
  'no-reply': 'noReply'
} as const;

function safeFileSegment(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'resposta';
}

export function ContinuousResponsePage() {
  const navigate = useNavigate();
  const { recordId = '' } = useParams();
  const registry = useContinuousReceivedStore((state) => state.registry);
  const record = findReceivedCollection(registry, recordId);
  const [gestureId, setGestureId] = useState<ContinuousResponseGestureId>('silence');
  const [consent, setConsent] = useState<ContinuousResponseConsent>(emptyContinuousResponseConsent);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<string>();

  const gesture = continuousResponseGestures.find((entry) => entry.id === gestureId) ?? continuousResponseGestures[4];
  const preview = useMemo(
    () => record ? buildContinuousResponsePreview(record, gesture) : undefined,
    [record, gesture]
  );
  const ready = gesture.createsFile && hasExplicitContinuousResponseConsent(consent);

  const selectGesture = (id: ContinuousResponseGestureId) => {
    setGestureId(id);
    setConsent(emptyContinuousResponseConsent());
    setErrors([]);
    setMessage(undefined);
  };

  const toggleConsent = (field: keyof ContinuousResponseConsent) => {
    setConsent((current) => ({ ...current, [field]: !current[field] }));
    setErrors([]);
    setMessage(undefined);
  };

  const preserveSilence = () => {
    setErrors([]);
    setMessage('Silêncio preservado. Nenhum arquivo, histórico ou indicação de recusa foi criado.');
  };

  const download = () => {
    if (!record) return;
    const result = createContinuousResponseExport(
      record,
      gesture,
      consent,
      continuousResponseCatalog.version,
      new Date().toISOString()
    );
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    const blob = new Blob([JSON.stringify(result.export, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `athanor-resposta-${safeFileSegment(record.package.collection.label)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setErrors([]);
    setMessage('Arquivo criado localmente. O Athanor não o enviou, não registrou destinatário e não espera nova resposta.');
  };

  if (!record) return <div className="page page--continuous-response">
    <PageHeader eyebrow="A Resposta que Não Cobra Retorno" title="Cópia recebida não encontrada." description="Nenhuma resposta foi preparada ou registrada."/>
    <Card title="Voltar à biblioteca recebida" eyebrow="Sem alteração de estado">
      <p>A cópia pode ter sido removida ou ainda não existir neste dispositivo.</p>
      <Button variant="secondary" onClick={() => navigate('/temple/continuous-received')}><ArrowLeft size={17}/> Abrir biblioteca recebida</Button>
    </Card>
  </div>;

  return <div className="page page--continuous-response">
    <PageHeader
      eyebrow="A Resposta que Não Cobra Retorno"
      title="Escolha falar, estabelecer limite ou preservar silêncio."
      description="Responder é opcional. O Athanor oferece apenas gestos curados e arquivo local, sem mensagem livre, envio automático, rastreamento ou expectativa de continuidade."
    />

    <div className="continuous-response-intro-grid">
      <Card title={continuousResponseBiblicalUnit.title} eyebrow={continuousResponseBiblicalUnit.reference}>
        <blockquote>{continuousResponseBiblicalUnit.principle}</blockquote>
        <p>{continuousResponseBiblicalUnit.context}</p>
        <div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a reflexão; gestos e protocolo de resposta são estruturas autorais da Tehkné Solutions.</span></div>
      </Card>
      <Card title="Protocolo opcional" eyebrow={`Versão ${continuousResponseCatalog.version}`}>
        <ul className="simple-list">
          <li>Schema: {continuousResponseCatalog.schema}</li>
          <li>Modo: arquivo local ou silêncio</li>
          <li>Mensagem livre: não</li>
          <li>Histórico persistido: não</li>
        </ul>
        <div className="safety-summary"><ShieldCheck/><p>Receber uma partilha não cria dívida, prazo ou obrigação de agradecimento.</p></div>
      </Card>
    </div>

    <Card title="1. Cópia recebida escolhida" eyebrow={record.status === 'active' ? 'Cópia ativa' : 'Cópia arquivada'}>
      <div className="continuous-response-source">
        <div>
          <strong>{record.package.collection.label}</strong>
          <span>{record.package.collection.itemCount} itens · impressão <code>{record.fingerprint}</code></span>
        </div>
        <Button variant="ghost" onClick={() => navigate('/temple/continuous-received')}><ArrowLeft size={17}/> Trocar cópia</Button>
      </div>
      <p>O arquivo de resposta não incluirá os itens, datas, temas ou conteúdo interno desta coleção.</p>
    </Card>

    <Card title="2. Escolher um gesto" eyebrow="Silêncio permanece válido">
      <div className="continuous-response-gesture-grid" role="group" aria-label="Gestos de resposta">
        {continuousResponseGestures.map((entry) => <button
          key={entry.id}
          type="button"
          aria-pressed={gesture.id === entry.id}
          onClick={() => selectGesture(entry.id)}
        >
          {entry.id === 'silence' ? <VolumeX aria-hidden="true"/> : <MessageCircleReply aria-hidden="true"/>}
          <strong>{entry.label}</strong>
          <span>{entry.description}</span>
          <small>{entry.createsFile ? 'Pode gerar arquivo local' : 'Não gera arquivo'}</small>
        </button>)}
      </div>
    </Card>

    {preview && <Card title="3. Prévia completa" eyebrow={gesture.createsFile ? 'Arquivo minimizado' : 'Conclusão sem arquivo'}>
      <div className="continuous-response-preview-heading"><Eye aria-hidden="true"/><div><strong>{preview.gesture.label}</strong><p>{preview.gesture.statement}</p></div></div>
      <dl className="continuous-response-meta">
        <div><dt>Impressão referenciada</dt><dd><code>{preview.source.fingerprint}</code></dd></div>
        <div><dt>Rótulo curado</dt><dd>{preview.source.collectionLabel}</dd></div>
        <div><dt>Quantidade descritiva</dt><dd>{preview.source.itemCount}</dd></div>
        <div><dt>Resposta adicional</dt><dd>não exigida</dd></div>
      </dl>
      <ul className="simple-list">{preview.notices.map((notice) => <li key={notice}>{notice}</li>)}</ul>
      <details className="continuous-response-json"><summary><FileJson size={16}/> Inspecionar prévia minimizada</summary><pre>{JSON.stringify(preview, null, 2)}</pre></details>
    </Card>}

    {gesture.createsFile ? <Card title="4. Consentimentos" eyebrow="Quatro confirmações obrigatórias">
      <div className="continuous-response-consents">
        {continuousResponseConsentSteps.map((step) => {
          const field = consentFieldByStep[step.id];
          return <label key={step.id}>
            <input type="checkbox" checked={consent[field]} onChange={() => toggleConsent(field)}/>
            <span><strong>{step.label}</strong><small>{step.description}</small></span>
          </label>;
        })}
      </div>
      <div className="continuous-response-actions">
        <Button disabled={!ready} onClick={download}><Download size={18}/> Baixar resposta opcional</Button>
        <Button variant="ghost" onClick={() => selectGesture('silence')}><VolumeX size={17}/> Preservar silêncio</Button>
      </div>
    </Card> : <Card title="4. Preservar silêncio" eyebrow="Conclusão completa">
      <p>Nenhum consentimento adicional é necessário porque nenhum arquivo será criado.</p>
      <div className="continuous-response-actions">
        <Button onClick={preserveSilence}><VolumeX size={18}/> Concluir sem gerar arquivo</Button>
      </div>
    </Card>}

    {message && <p className="continuous-response-success">{message}</p>}
    {errors.length > 0 && <ul className="continuous-response-errors">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}

    <Card title="Limites da resposta" eyebrow="Sem cobrança de continuidade">
      <ul className="simple-list">{continuousResponseRestrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul>
      <div className="continuous-response-actions"><Button variant="secondary" onClick={() => navigate('/temple/continuous-received')}>Voltar à biblioteca recebida</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Voltar ao Átrio</Button></div>
    </Card>
  </div>;
}
