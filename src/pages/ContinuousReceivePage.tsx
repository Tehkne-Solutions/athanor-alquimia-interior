import { useState, type ChangeEvent } from 'react';
import { Archive, BookOpenText, Eye, FileJson, Inbox, MessageCircleReply, RotateCcw, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { continuousExactTextCatalog } from '../content/continuousExactText';
import { continuousExactTimeCatalog } from '../content/continuousExactTime';
import { continuousInertJsonCatalog } from '../content/continuousInertJson';
import { continuousNumericLexemeCatalog } from '../content/continuousNumericLexeme';
import {
  continuousReceiveBiblicalUnit,
  continuousReceiveCatalog,
  continuousReceiveConsentSteps,
  continuousReceiveRestrictions
} from '../content/continuousReceive';
import { continuousReceivedHydrationPolicy } from '../content/continuousReceivedHydration';
import { continuousReceivedHydrationGatePolicy } from '../content/continuousReceivedHydrationGate';
import { continuousReceivedPersistenceCommitPolicy } from '../content/continuousReceivedPersistenceCommit';
import { continuousReceivedPersistenceConflictPolicy } from '../content/continuousReceivedPersistenceConflict';
import { continuousReceivedStoreDelegationPolicy } from '../content/continuousReceivedStoreDelegation';
import { continuousResourceCatalog } from '../content/continuousResource';
import { continuousStrictContractCatalog } from '../content/continuousStrictContract';
import { continuousTextVisibilityCatalog } from '../content/continuousTextVisibility';
import { continuousUniqueKeysCatalog } from '../content/continuousUniqueKeys';
import {
  findEquivalentReceivedCollection,
  findReceivedAllByFingerprint,
  findReceivedCollection,
  type ContinuousReceiveSuccess
} from '../domain/continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from '../domain/continuousReceiveConsistency';
import { readContinuousJsonFile } from '../domain/continuousResource';
import { useContinuousReceivedHydrationRuntimeStore } from '../state/useContinuousReceivedHydrationRuntimeStore';
import { useContinuousReceivedPersistenceRuntimeStore } from '../state/useContinuousReceivedPersistenceRuntimeStore';
import { useContinuousReceivedStore, type MutateReceivedResult } from '../state/useContinuousReceivedStore';

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
  const hydrationStatus = useContinuousReceivedHydrationRuntimeStore((state) => state.status);
  const hydrationMessage = useContinuousReceivedHydrationRuntimeStore((state) => state.message);
  const hydrationIssues = useContinuousReceivedHydrationRuntimeStore((state) => state.issues);
  const persistenceStatus = useContinuousReceivedPersistenceRuntimeStore((state) => state.status);
  const persistenceMessage = useContinuousReceivedPersistenceRuntimeStore((state) => state.message);
  const persistenceIssues = useContinuousReceivedPersistenceRuntimeStore((state) => state.issues);
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
  const equivalentRecord = candidate
    ? findEquivalentReceivedCollection(registry, candidate.package)
    : undefined;
  const fingerprintCandidates = candidate
    ? findReceivedAllByFingerprint(registry, candidate.fingerprint)
    : [];
  const fingerprintCollision = Boolean(candidate && !equivalentRecord && fingerprintCandidates.length > 0);
  const hydrationBlocked = hydrationStatus === 'initial' || hydrationStatus === 'unavailable';
  const persistenceWriting = persistenceStatus === 'writing';
  const persistenceConflict = persistenceStatus === 'conflict';
  const persistenceBlocked = persistenceWriting || persistenceConflict;
  const actionsBlocked = hydrationBlocked || persistenceBlocked;
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
    if (hydrationBlocked) {
      setErrors([hydrationMessage ?? 'A biblioteca local ainda não está disponível para receber ações.']);
      return;
    }

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

  const keep = async () => {
    if (!candidate || !ready) {
      setErrors(['Revise e confirme os quatro itens antes de guardar a cópia local.']);
      return;
    }
    const result = await keepPackage(candidate.package);
    const accepted = result.status === 'kept' || result.status === 'equivalent' || result.status === 'disambiguated';
    if (!accepted || !result.id) {
      setErrors([result.message]);
      setMessage(undefined);
      return;
    }
    setSelectedRecordId(result.id);
    setMessage(result.message);
    resetCandidate();
  };

  const handleMutation = (result: MutateReceivedResult): boolean => {
    if (result.status === 'updated' || result.status === 'unchanged') {
      setErrors([]);
      setMessage(result.message);
      return true;
    }
    setMessage(undefined);
    setErrors([result.message]);
    return false;
  };

  const archive = async (recordId: string) => {
    handleMutation(await archiveRecord(recordId));
  };

  const reactivate = async (recordId: string) => {
    handleMutation(await reactivateRecord(recordId));
  };

  const remove = async (recordId: string) => {
    const result = await removeRecord(recordId);
    if (!handleMutation(result) || result.status !== 'updated') return;
    if (selectedRecordId === recordId || selectedRecord?.id === recordId) setSelectedRecordId(undefined);
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
          <li>Chaves: únicas antes do parse · v{continuousUniqueKeysCatalog.version}</li>
          <li>Números: medida decimal preservada · v{continuousNumericLexemeCatalog.version}</li>
          <li>Forma aceita: JSON inerte v{continuousInertJsonCatalog.version}</li>
          <li>Texto aceito: Unicode {continuousTextVisibilityCatalog.normalization} v{continuousTextVisibilityCatalog.version}</li>
          <li>Campos extras: recusados · v{continuousStrictContractCatalog.version}</li>
          <li>Margens textuais: exatas · v{continuousExactTextCatalog.version}</li>
          <li>Tempo: {continuousExactTimeCatalog.format} · v{continuousExactTimeCatalog.version}</li>
          <li>Fachada: decisões delegadas ao domínio · v{continuousReceivedStoreDelegationPolicy.version}</li>
          <li>Hidratação: memória persistida revalidada · v{continuousReceivedHydrationPolicy.version}</li>
          <li>Ações: bloqueadas até a hidratação terminar · v{continuousReceivedHydrationGatePolicy.version}</li>
          <li>Escrita: confirmação IndexedDB antes do runtime · v{continuousReceivedPersistenceCommitPolicy.version}</li>
          <li>Concorrência: compare-and-set atômico · v{continuousReceivedPersistenceConflictPolicy.version}</li>
          <li>Limite de arquivo: {continuousResourceCatalog.maxFileBytes / 1024} KiB</li>
        </ul>
        <div className="safety-summary"><ShieldCheck/><p>Selecionar ou descartar um arquivo não envia confirmação e não registra recusa.</p></div>
      </Card>
    </div>

    {hydrationStatus === 'initial' && <Card title="Examinando a memória local" eyebrow={`Portão v${continuousReceivedHydrationGatePolicy.version}`}>
      <p>{hydrationMessage}</p>
      <p>As ações permanecem desabilitadas e não serão enfileiradas ou repetidas automaticamente.</p>
    </Card>}

    {hydrationStatus === 'unavailable' && <Card title="Memória local indisponível" eyebrow={`Portão v${continuousReceivedHydrationGatePolicy.version}`}>
      <p>{hydrationMessage}</p>
      <p>A biblioteca provisória não será gravada por cima de um estado persistido que não pôde ser lido.</p>
      {hydrationIssues.length > 0 && <ul className="continuous-receive-errors">{hydrationIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
    </Card>}

    {hydrationStatus === 'rejected' && <Card title="Memória persistida recusada" eyebrow={`Hidratação v${continuousReceivedHydrationPolicy.version}`}>
      <p>{hydrationMessage}</p>
      <p>A biblioteca nova desta sessão foi preservada. Os bytes anteriores continuam na IndexedDB e não foram apagados, corrigidos ou migrados automaticamente.</p>
      {hydrationIssues.length > 0 && <ul className="continuous-receive-errors">{hydrationIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
    </Card>}

    {persistenceWriting && <Card title="Conferindo e gravando a alteração local" eyebrow={`Escrita v${continuousReceivedPersistenceCommitPolicy.version}`}>
      <p>{persistenceMessage}</p>
      <p>Outras mutações permanecem bloqueadas e não serão enfileiradas.</p>
    </Card>}

    {persistenceStatus === 'failed' && <Card title="Gravação local não confirmada" eyebrow={`Escrita v${continuousReceivedPersistenceCommitPolicy.version}`}>
      <p>{persistenceMessage}</p>
      <p>A biblioteca ativa anterior permanece intacta. A ação pode ser decidida novamente de forma explícita.</p>
      {persistenceIssues.length > 0 && <ul className="continuous-receive-errors">{persistenceIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
    </Card>}

    {persistenceConflict && <Card title="Memória alterada em outra aba" eyebrow={`Concorrência v${continuousReceivedPersistenceConflictPolicy.version}`}>
      <p>{persistenceMessage}</p>
      <p>Nenhuma versão foi escolhida, sobrescrita ou mesclada. Recarregue a página para examinar a memória mais recente antes de decidir novamente.</p>
      {persistenceIssues.length > 0 && <ul className="continuous-receive-errors">{persistenceIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
    </Card>}

    <Card title="1. Selecionar arquivo recebido" eyebrow="Leitura exclusivamente local">
      <div className="continuous-receive-upload">
        <label>
          <Upload aria-hidden="true"/>
          <span>Selecionar pacote JSON da Fase 8.7</span>
          <input type="file" accept="application/json,.json" onChange={handleFile} disabled={hydrationBlocked}/>
        </label>
        <p>Tamanho e texto bruto são limitados primeiro. Depois, chaves únicas, medida numérica, JSON.parse, forma inerte, orçamento, texto visível, selo, versão, contrato estrito, margens exatas, tempo UTC canônico, schema e conteúdo curado são validados nessa ordem.</p>
      </div>
      {errors.length > 0 && <ul className="continuous-receive-errors">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
    </Card>

    {candidate && <>
      <Card title="2. Prévia sanitizada" eyebrow={`${candidate.package.items.length} itens`}>
        <div className="continuous-receive-preview-heading"><Eye aria-hidden="true"/><div><strong>{candidate.package.collection.label}</strong><p>Modelo {candidate.package.collection.templateId} · estado {candidate.package.collection.status}</p></div></div>
        {equivalentRecord && <p className="continuous-receive-warning">Uma cópia canonicamente equivalente já existe. Guardar novamente abrirá o registro existente sem duplicação.</p>}
        {fingerprintCollision && <p className="continuous-receive-warning">A impressão curta coincide com outra cópia, mas o conteúdo é diferente. O domínio preservará ambas separadamente.</p>}
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
              <input type="checkbox" checked={consent[field]} onChange={() => toggleConsent(field)} disabled={actionsBlocked}/>
              <span><strong>{step.label}</strong><small>{step.description}</small></span>
            </label>;
          })}
        </div>
        <div className="continuous-receive-actions">
          <Button disabled={!ready || actionsBlocked} onClick={keep}><Inbox size={18}/> {persistenceWriting ? 'Gravando…' : 'Guardar cópia recebida'}</Button>
          <Button variant="ghost" disabled={persistenceWriting} onClick={() => { resetCandidate(); setMessage('A prévia foi descartada sem criar registro.'); }}>Descartar prévia</Button>
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
              ? <Button variant="ghost" disabled={actionsBlocked} onClick={() => archive(selectedRecord.id)}><Archive size={17}/> Arquivar cópia</Button>
              : <Button variant="secondary" disabled={actionsBlocked} onClick={() => reactivate(selectedRecord.id)}><RotateCcw size={17}/> Reativar cópia</Button>}
            <Button variant="danger" disabled={actionsBlocked} onClick={() => remove(selectedRecord.id)}><Trash2 size={17}/> Remover cópia local</Button>
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
