import { useMemo, useState } from 'react';
import { ArrowLeft, BookOpenText, Download, Eye, FileJson, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  continuousShareBiblicalUnit,
  continuousShareCatalog,
  continuousShareConsentSteps,
  continuousShareRestrictions
} from '../content/continuousShare';
import { findContinuousCollection } from '../domain/continuousCollection';
import {
  buildContinuousSharePreview,
  createContinuousCollectionShareExport,
  emptyContinuousShareConsent,
  hasExplicitContinuousShareConsent,
  type ContinuousShareConsent
} from '../domain/continuousShare';
import { useContinuousCollectionStore } from '../state/useContinuousCollectionStore';

const consentFieldByStep = {
  collection: 'collection',
  preview: 'preview',
  'local-file': 'localFile',
  recipient: 'recipient',
  'no-personal-notes': 'noPersonalNotes'
} as const;

function safeFileSegment(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'colecao';
}

export function ContinuousSharePage() {
  const navigate = useNavigate();
  const { collectionId = '' } = useParams();
  const registry = useContinuousCollectionStore((state) => state.registry);
  const collection = findContinuousCollection(registry, collectionId);
  const [consent, setConsent] = useState<ContinuousShareConsent>(emptyContinuousShareConsent);
  const [includeDates, setIncludeDates] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [downloaded, setDownloaded] = useState(false);

  const preview = useMemo(
    () => collection ? buildContinuousSharePreview(collection, { includeDates }) : undefined,
    [collection, includeDates]
  );
  const ready = hasExplicitContinuousShareConsent(consent);

  const toggleConsent = (field: keyof ContinuousShareConsent) => {
    setConsent((current) => ({ ...current, [field]: !current[field] }));
    setErrors([]);
    setDownloaded(false);
  };

  const download = () => {
    if (!collection) return;
    const result = createContinuousCollectionShareExport(
      collection,
      consent,
      { includeDates },
      continuousShareCatalog.version,
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
    anchor.download = `athanor-partilha-${safeFileSegment(collection.label)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setErrors([]);
    setDownloaded(true);
  };

  if (!collection) return <div className="page page--continuous-share">
    <PageHeader eyebrow="A Partilha que Exige Consentimento" title="Coleção não encontrada." description="Nenhum dado foi preparado ou exportado."/>
    <Card title="Voltar às coleções" eyebrow="Sem alteração de estado">
      <p>A coleção pode ter sido removida do endereço ou ainda não existir neste dispositivo.</p>
      <Button variant="secondary" onClick={() => navigate('/temple/continuous-collections')}><ArrowLeft size={17}/> Abrir coleções</Button>
    </Card>
  </div>;

  return <div className="page page--continuous-share">
    <PageHeader
      eyebrow="A Partilha que Exige Consentimento"
      title="Revise, minimize e gere somente um arquivo local."
      description="O Athanor não envia, publica, sincroniza nem registra o destinatário. A exportação só é liberada após cinco confirmações explícitas."
    />

    <div className="continuous-share-intro-grid">
      <Card title={continuousShareBiblicalUnit.title} eyebrow={continuousShareBiblicalUnit.reference}>
        <blockquote>{continuousShareBiblicalUnit.principle}</blockquote>
        <p>{continuousShareBiblicalUnit.context}</p>
        <div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a reflexão; o protocolo de partilha é uma estrutura autoral da Tehkné Solutions.</span></div>
      </Card>
      <Card title="Protocolo local" eyebrow={`Versão ${continuousShareCatalog.version}`}>
        <ul className="simple-list">
          <li>Schema: {continuousShareCatalog.schema}</li>
          <li>Modo: arquivo local manual</li>
          <li>Envio automático: desativado</li>
          <li>Destinatário armazenado: não</li>
        </ul>
        <div className="safety-summary"><ShieldCheck/><p>Sair desta tela não registra intenção, tentativa ou recusa de partilha.</p></div>
      </Card>
    </div>

    <Card title="1. Coleção selecionada" eyebrow={collection.status === 'active' ? 'Coleção ativa' : 'Coleção arquivada'}>
      <div className="continuous-share-source">
        <div><strong>{collection.label}</strong><span>{collection.items.length} referências · modelo {collection.templateId}</span></div>
        <Button variant="ghost" onClick={() => navigate('/temple/continuous-collections')}><ArrowLeft size={17}/> Trocar coleção</Button>
      </div>
    </Card>

    <Card title="2. Minimização" eyebrow="Datas omitidas por padrão">
      <label className="continuous-share-option">
        <input type="checkbox" checked={includeDates} onChange={(event) => { setIncludeDates(event.target.checked); setDownloaded(false); }}/>
        <span><strong>Incluir datas descritivas dos itens</strong><small>Desmarcado, o pacote não inclui datas de ocorrência ou conclusão.</small></span>
      </label>
      <p>IDs internos de coleção, jornada, Rastro e ciclo são sempre removidos e não podem ser reativados nesta tela.</p>
    </Card>

    {preview && <Card title="3. Prévia completa" eyebrow={`${preview.items.length} itens`}>
      <div className="continuous-share-preview-heading"><Eye aria-hidden="true"/><p>Esta é a estrutura que será gravada no arquivo, sem notas pessoais ou dados de contato.</p></div>
      {preview.items.length === 0 ? <p>A coleção está vazia. O arquivo conterá apenas metadados mínimos da coleção e avisos de segurança.</p> : <ol className="continuous-share-items">
        {preview.items.map((item) => <li key={`${item.position}-${item.kind}-${item.variantId}`}>
          <span>{item.position}</span>
          <div><strong>{item.kind === 'trail' ? 'Rastro' : 'Ciclo temático'} · {item.startPoint}</strong><small>{item.themeId ?? (item.noTheme ? 'Sem tema' : 'Tema desconhecido')} · {item.status}</small></div>
        </li>)}
      </ol>}
      <ul className="simple-list">{preview.notices.map((notice) => <li key={notice}>{notice}</li>)}</ul>
      <details className="continuous-share-json"><summary><FileJson size={16}/> Inspecionar JSON minimizado</summary><pre>{JSON.stringify(preview, null, 2)}</pre></details>
    </Card>}

    <Card title="4. Consentimentos" eyebrow="Todos são obrigatórios">
      <div className="continuous-share-consents">
        {continuousShareConsentSteps.map((step) => {
          const field = consentFieldByStep[step.id];
          return <label key={step.id}>
            <input type="checkbox" checked={consent[field]} onChange={() => toggleConsent(field)}/>
            <span><strong>{step.label}</strong><small>{step.description}</small></span>
          </label>;
        })}
      </div>
    </Card>

    <Card title="5. Gerar arquivo" eyebrow="Ação local e reversível até o download">
      <div className="continuous-share-download">
        <Button disabled={!ready} onClick={download}><Download size={18}/> Baixar pacote consentido</Button>
        <p>{ready ? 'As cinco confirmações foram registradas apenas no estado desta tela.' : 'Confirme os cinco itens acima para liberar o download.'}</p>
      </div>
      {downloaded && <p className="continuous-share-success">Arquivo criado localmente. O Athanor não sabe se ele será guardado, enviado ou descartado.</p>}
      {errors.length > 0 && <ul className="continuous-share-errors">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
    </Card>

    <Card title="Limites da partilha" eyebrow="Sem transmissão automática">
      <ul className="simple-list">{continuousShareRestrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul>
      <div className="continuous-share-actions"><Button variant="secondary" onClick={() => navigate('/temple/continuous-collections')}>Voltar às coleções</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Voltar ao Átrio</Button></div>
    </Card>
  </div>;
}
