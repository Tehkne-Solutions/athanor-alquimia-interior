import { useState, type ChangeEvent } from 'react';
import { Archive, BookOpenText, Eye, FileJson, Inbox, MessageCircleReply, RotateCcw, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { continuousInertJsonCatalog } from '../content/continuousInertJson';
import {
  continuousReceiveBiblicalUnit,
  continuousReceiveCatalog,
  continuousReceiveConsentSteps,
  continuousReceiveRestrictions
} from '../content/continuousReceive';
import { continuousResourceCatalog } from '../content/continuousResource';
import {
  findReceivedByFingerprint,
  findReceivedCollection,
  type ContinuousReceiveSuccess
} from '../domain/continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from '../domain/continuousReceiveConsistency';
import { readContinuousJsonFile } from '../domain/continuousResource';
import { useContinuousReceivedStore } from '../state/useContinuousReceivedStore';

interface ReceiveConsent {
  file: boolean;
  preview: boolean;
  separateLibrary: boolean;
  keepCopy: boolean;
}

const emptyConsent = (): ReceiveConsent => ({
  file: false,
  preview: false,
  separateLibrary: false,
  keepCopy: false
});

const consentFieldByStep = {
  file: 'file',
  preview: 'preview',
  'separate-library': 'separateLibrary',
  'keep-copy': 'keepCopy'
} as const;

function allConsentsChecked(value: ReceiveConsent): boolean {
  return value.file && value.preview && value.separateLibrary && value.keepCopy;
}

function itemTitle(kind: 'trail' | 'theme-cycle', startPoint: string): string {
  return `${kind === 'trail' ? 'Rastro' : 'Ciclo temático'} · ${startPoint}`;
}

export function ContinuousReceivePage() {
  const navigate = useNavigate();
  const registry = useContinuousReceivedStore((state) => state.registry);
  const keepPackage = useContinuousReceivedStore((state) => state.keepPackage);
  const archiveRecord = useContinuousReceivedStore((state) => state.archiveRecord);
  const reactivateRecord = useContinuousReceivedStore((state) => state.reactivateRecord);
  const removeRecord = useContinuousReceivedStore((state) => state.removeRecord);
  const [candidate, setCandidate] = useState<ContinuousReceiveSuccess>();
  const [consent, setConsent] = useState<ReceiveConsent>(emptyConsent);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<string>();
  const [selectedRecordId, setSelectedRecordId] = useState<string>();

  const selectedRecord = findReceivedCollection(
    registry,
    selectedRecordId ?? registry.records[0]?.id ?? ''
  );
  const duplicateRecord = candidate ? findReceivedByFingerprint(registry, candidate.fingerprint) : undefined;
  const ready = allConsentsChecked(consent);

  const resetCandidate = () => {
    setCandidate(undefined);
    setConsent(emptyConsent());
    setErrors([]);
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setMessage(undefined);
    resetCandidate();
    if (!file) return;

    const readResult = await readContinuousJsonFile(file);
    if (!readResult.ok) {
      setErrors(readResult.errors);
      return;
    }

    const result = parseContinuousCollectionShareWithConsistency(readResult.value);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setCandidate(result);
  };

  const toggleConsent = (field: keyof ReceiveConsent) => {
    setConsent((current) => ({ ...current, [field]: !current[field] }));
    setErrors([]);
    setMessage(undefined);
  };

  const keep = () => {
    if (!candidate || !ready) {
      setErrors(['Revise e confirme os quatro itens antes de guardar a cópia local.']);
      return;
    }
    const result = keepPackage(candidate.package);
    setSelectedRecordId(result.id);
    setMessage(result.duplicate
      ? 'Este mesmo conteúdo já estava guardado. A cópia existente foi aberta sem duplicação.'
      : 'Cópia recebida guardada na biblioteca separada. Nenhuma jornada ou coleção própria foi alterada.');
    resetCandidate();
  };

  const remove = (recordId: string) => {
    removeRecord(recordId);
    if (selectedRecordId === recordId || selectedRecord?.id === recordId) setSelectedRecordId(undefined);
    setMessage('A cópia local foi removida. O arquivo externo e sua origem não foram alterados.');
  };

  return <div className="page page--continuous-receive">
    <PageHeader
      eyebrow="A Recepção que Não se Apropria"
      title="Acolha uma partilha sem transformá-la em história própria."
      description="Pacotes compatíveis são validados, sanitizados e guardados em biblioteca separada. Nada é incorporado às suas jornadas, mapas, coleções ou progresso."
    />

    <div className="continuous-receive-intro-grid">
      <Card title={continuousReceiveBiblicalUnit.title} eyebrow={continuousReceiveBiblicalUnit.reference}>
        <blockquote>{continuousReceiveBiblicalUnit.principle}</blockquote>
        <p>{continuousReceiveBiblicalUnit.context}</p>
        <div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a reflexão; a recepção separada é uma estrutura autoral da Tehkné Solutions.</span></div>
      </Card>
      <Card title="Protocolo de recepção" eyebrow={`Versão ${continuousReceiveCatalog.version}`}>
        <ul className="simple-list">
          <li>Schema aceito: {continuousReceiveCatalog.acceptedSchema}</li>
          <li>Biblioteca: separada e local</li>
          <li>Forma aceita: JSON inerte v{continuousInertJsonCatalog.version}</li>
          <li>Limite de arquivo: {continuousResourceCatalog.maxFileBytes / 1024} KiB</li>
        </ul>
        <div className="safety-summary"><ShieldCheck/><p>Selecionar ou descartar um arquivo não envia confirmação e não registra recusa.</p></div>
      </Card>
    </div>

    <Card title="1. Selecionar arquivo recebido" eyebrow="Leitura exclusivamente local">
      <div className="continuous-receive-upload">
        <label>
          <Upload aria-hidden="true"/>
          <span>Selecionar pacote JSON da Fase 8.7</span>
          <input type="file" accept="application/json,.json" onChange={handleFile}/>
        </label>
        <p>O tamanho é conferido antes da leitura. Depois, forma inerte, orçamento estrutural, selo, versão, schema e conteúdo curado são validados nessa ordem.</p>
      </div>
      {errors.length > 0 && <ul className="continuous-receive-errors">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
    </Card>

    {candidate && <>
      <Card title="2. Prévia sanitizada" eyebrow={`${candidate.package.items.length} itens`}>
        <div className="continuous-receive-preview-heading"><Eye aria-hidden="true"/><div><strong>{candidate.package.collection.label}</strong><p>Modelo {candidate.package.collection.templateId} · estado {candidate.package.collection.status}</p></div></div>
        {duplicateRecord && <p className="continuous-receive-warning">Uma cópia com o mesmo conteúdo já existe na biblioteca. Guardar novamente apenas abrirá o registro existente.</p>}
        {candidate.package.items.length === 0 ? <p>A coleção recebida está vazia. Isso não representa ausência de valor ou conteúdo incompleto.</p> : <ol className="continuous-receive-items">
          {candidate.package.items.map((item) => <li key={`${item.position}-${item.kind}-${item.variantId}`}>
            <span>{item.position}</span>
            <div><strong>{itemTitle(item.kind, item.startPoint)}</strong><small>{item.themeId ?? (item.noTheme ? 'Sem tema' : 'Tema desconhecido')} · {item.status}</small></div>
          </li>)}
        </ol>}
        <ul className="simple-list">{[...candidate.package.notices, ...candidate.warnings].map((notice) => <li key={notice}>{notice}</li>)}</ul>
        <details className="continuous-receive-json"><summary><FileJson size={16}/> Inspecionar pacote sanitizado</summary><pre>{JSON.stringify(candidate.package, null, 2)}</pre></details>
      </Card>

      <Card title="3. Confirmações de recepção" eyebrow="Quatro escolhas explícitas">
        <div className="continuous-receive-consents">
          {continuousReceiveConsentSteps.map((step) => {
            const field = consentFieldByStep[step.id];
            return <label key={step.id}>
              <input type="checkbox" checked={consent[field]} onChange={() => toggleConsent(field)}/>
              <span><strong>{step.label}</strong><small>{step.description}</small></span>
            </label>;
          })}
        </div>
        <div className="continuous-receive-actions">
          <Button disabled={!ready} onClick={keep}><Inbox size={18}/> Guardar cópia recebida</Button>
          <Button variant="ghost" onClick={() => { resetCandidate(); setMessage('A prévia foi descartada sem criar registro.'); }}>Descartar prévia</Button>
        </div>
      </Card>
    </>}

    {message && <p className="continuous-receive-success">{message}</p>}

    <Card title="Biblioteca recebida" eyebrow={`${registry.records.length} cópias locais`}>
      {registry.records.length === 0 ? <p>Nenhuma cópia recebida foi guardada. A biblioteca vazia é um estado completo.</p> : <>
        <div className="continuous-receive-selector" role="group" aria-label="Coleções recebidas">
          {registry.records.map((record) => <button key={record.id} type="button" aria-pressed={selectedRecord?.id === record.id} onClick={() => setSelectedRecordId(record.id)}>
            <strong>{record.package.collection.label}</strong>
            <span>{record.package.items.length} itens · {record.status === 'active' ? 'ativa' : 'arquivada'}</span>
          </button>)}
        </div>

        {selectedRecord && <article className="continuous-receive-record">
          <header><div><p className="eyebrow">Cópia recebida {selectedRecord.status === 'active' ? 'ativa' : 'arquivada'}</p><h3>{selectedRecord.package.collection.label}</h3><p>{selectedRecord.package.items.length} itens · impressão <code>{selectedRecord.fingerprint}</code></p></div></header>
          {selectedRecord.package.items.length === 0 ? <p>Coleção vazia preservada sem interpretação.</p> : <ol className="continuous-receive-items">
            {selectedRecord.package.items.map((item) => <li key={`${item.position}-${item.kind}-${item.variantId}`}><span>{item.position}</span><div><strong>{itemTitle(item.kind, item.startPoint)}</strong><small>{item.themeId ?? (item.noTheme ? 'Sem tema' : 'Tema desconhecido')} · {item.status}</small></div></li>)}
          </ol>}
          <div className="continuous-receive-actions">
            <Button variant="secondary" onClick={() => navigate(`/temple/continuous-received/${selectedRecord.id}/respond`)}><MessageCircleReply size={17}/> Preparar resposta opcional</Button>
            {selectedRecord.status === 'active'
              ? <Button variant="ghost" onClick={() => archiveRecord(selectedRecord.id)}><Archive size={17}/> Arquivar cópia</Button>
              : <Button variant="secondary" onClick={() => reactivateRecord(selectedRecord.id)}><RotateCcw size={17}/> Reativar cópia</Button>}
            <Button variant="danger" onClick={() => remove(selectedRecord.id)}><Trash2 size={17}/> Remover cópia local</Button>
          </div>
        </article>}
      </>}
    </Card>

    <Card title="Limites da recepção" eyebrow="Sem apropriação">
      <ul className="simple-list">{continuousReceiveRestrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul>
      <div className="continuous-receive-actions"><Button variant="secondary" onClick={() => navigate('/temple/continuous-collections')}>Abrir minhas coleções</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Voltar ao Átrio</Button></div>
    </Card>
  </div>;
}
