import { useMemo, useState, type ChangeEvent } from 'react';
import { Archive, ArrowDown, ArrowUp, BookOpenText, FolderOpen, Import, Inbox, RotateCcw, Share2, ShieldCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  continuousCollectionBiblicalUnit,
  continuousCollectionCatalog,
  continuousCollectionRestrictions,
  continuousCollectionTemplates
} from '../content/continuousCollection';
import { continuousThemes } from '../content/continuousTheme';
import { continuousThemeCyclePackages } from '../content/continuousThemeCycle';
import { newWorkStartPoints } from '../content/newWork';
import {
  collectionItemKey,
  findContinuousCollection,
  parseContinuousMapExport
} from '../domain/continuousCollection';
import { buildContinuousMapItems, type ContinuousMapItem } from '../domain/continuousMap';
import { useContinuousCollectionStore } from '../state/useContinuousCollectionStore';
import { useContinuousThemeCycleStore } from '../state/useContinuousThemeCycleStore';
import { useContinuousTrailStore } from '../state/useContinuousTrailStore';

function elementLabel(item: ContinuousMapItem): string {
  return newWorkStartPoints.find((entry) => entry.id === item.startPoint)?.label ?? item.startPoint;
}

function themeLabel(item: ContinuousMapItem): string {
  if (item.themeId) return continuousThemes.find((entry) => entry.id === item.themeId)?.label ?? item.themeId;
  return item.noTheme ? 'Sem tema' : 'Tema desconhecido';
}

function itemLabel(item: ContinuousMapItem): string {
  if (item.kind === 'trail') return `Rastro · ${elementLabel(item)}`;
  return continuousThemeCyclePackages.find((entry) => entry.id === item.packageId)?.label
    ?? item.packageLabel
    ?? 'Ciclo temático desconhecido';
}

export function ContinuousCollectionPage() {
  const navigate = useNavigate();
  const trails = useContinuousTrailStore((state) => state.progress.trails);
  const themeCycles = useContinuousThemeCycleStore((state) => state.progress.instances);
  const registry = useContinuousCollectionStore((state) => state.registry);
  const createCollection = useContinuousCollectionStore((state) => state.createCollection);
  const addLocalItem = useContinuousCollectionStore((state) => state.addLocalItem);
  const addImportedItems = useContinuousCollectionStore((state) => state.addImportedItems);
  const removeItem = useContinuousCollectionStore((state) => state.removeItem);
  const moveItem = useContinuousCollectionStore((state) => state.moveItem);
  const archiveCollection = useContinuousCollectionStore((state) => state.archiveCollection);
  const reactivateCollection = useContinuousCollectionStore((state) => state.reactivateCollection);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>();
  const [importMessage, setImportMessage] = useState<string>();
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const localMapItems = useMemo(() => buildContinuousMapItems(trails, themeCycles), [trails, themeCycles]);
  const selectedCollection = findContinuousCollection(
    registry,
    selectedCollectionId ?? registry.collections[0]?.id ?? ''
  );
  const selectedKeys = new Set(selectedCollection?.items.map((reference) => reference.key) ?? []);

  const createFromTemplate = (templateId: string) => {
    const template = continuousCollectionTemplates.find((entry) => entry.id === templateId);
    if (!template) return;
    const id = createCollection(template);
    setSelectedCollectionId(id);
    setImportMessage(undefined);
    setImportErrors([]);
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !selectedCollection || selectedCollection.status !== 'active') return;
    setImportMessage(undefined);
    setImportErrors([]);
    try {
      const parsedJson: unknown = JSON.parse(await file.text());
      const result = parseContinuousMapExport(parsedJson);
      if (!result.ok) {
        setImportErrors(result.errors);
        return;
      }
      addImportedItems(selectedCollection.id, result.export.items);
      const warnings = result.warnings.length > 0 ? ` ${result.warnings.join(' ')}` : '';
      setImportMessage(`${result.export.items.length} referências compatíveis foram processadas.${warnings}`);
    } catch {
      setImportErrors(['Não foi possível ler o arquivo JSON.']);
    }
  };

  return <div className="page page--continuous-collection">
    <PageHeader
      eyebrow="A Coleção que Cresce sem Acumular Valor"
      title="Reúna referências sem transformar quantidade em mérito."
      description="Coleções guardam snapshots locais de Rastros e ciclos. Criar, ordenar, remover ou arquivar nunca altera os registros de origem."
    />

    <div className="continuous-collection-intro-grid">
      <Card title={continuousCollectionBiblicalUnit.title} eyebrow={continuousCollectionBiblicalUnit.reference}>
        <blockquote>{continuousCollectionBiblicalUnit.principle}</blockquote>
        <p>{continuousCollectionBiblicalUnit.context}</p>
        <div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a reflexão; as coleções são estruturas autorais da Tehkné Solutions.</span></div>
      </Card>
      <Card title="Catálogo de coleções" eyebrow={`Versão ${continuousCollectionCatalog.version}`}>
        <ul className="simple-list">
          <li>Modo: referências locais curadas</li>
          <li>Política: sem valor acumulado</li>
          <li>Coleções: {registry.collections.length}</li>
          <li>Partilha: arquivo local com consentimento explícito</li>
        </ul>
        <div className="safety-summary"><ShieldCheck/><p>Uma coleção vazia possui o mesmo valor de uma coleção preenchida.</p></div>
        <div className="continuous-collection-actions"><Button variant="secondary" onClick={() => navigate('/temple/continuous-received')}><Inbox size={17}/> Biblioteca recebida</Button></div>
      </Card>
    </div>

    <Card title="1. Criar uma coleção" eyebrow="Coleções vazias são válidas">
      <div className="continuous-collection-template-grid">
        {continuousCollectionTemplates.map((template) => <button key={template.id} type="button" onClick={() => createFromTemplate(template.id)}>
          <FolderOpen aria-hidden="true"/>
          <strong>{template.label}</strong>
          <span>{template.description}</span>
        </button>)}
      </div>
    </Card>

    {registry.collections.length === 0 ? <Card title="Nenhuma coleção criada" eyebrow="Sem obrigação de preencher">
      <p>Escolha um modelo somente quando desejar. O mapa e todas as jornadas permanecem disponíveis sem coleções.</p>
      <div className="continuous-collection-actions"><Button variant="secondary" onClick={() => navigate('/temple/continuous-map')}>Abrir mapa dos ciclos</Button><Button variant="secondary" onClick={() => navigate('/temple/continuous-received')}><Inbox size={17}/> Receber partilha</Button></div>
    </Card> : <>
      <Card title="2. Escolher uma coleção" eyebrow={`${registry.collections.length} registros locais`}>
        <div className="continuous-collection-selector" role="group" aria-label="Coleções disponíveis">
          {registry.collections.map((collection) => <button
            key={collection.id}
            type="button"
            aria-pressed={selectedCollection?.id === collection.id}
            onClick={() => setSelectedCollectionId(collection.id)}
          >
            <strong>{collection.label}</strong>
            <span>{collection.items.length} referências · {collection.status === 'active' ? 'ativa' : 'arquivada'}</span>
          </button>)}
        </div>
      </Card>

      {selectedCollection && <Card title={selectedCollection.label} eyebrow={selectedCollection.status === 'active' ? 'Coleção ativa' : 'Coleção arquivada'}>
        <div className="continuous-collection-actions">
          {selectedCollection.status === 'active'
            ? <Button variant="ghost" onClick={() => archiveCollection(selectedCollection.id)}><Archive size={17}/> Arquivar coleção</Button>
            : <Button variant="secondary" onClick={() => reactivateCollection(selectedCollection.id)}><RotateCcw size={17}/> Reativar coleção</Button>}
          <Button variant="secondary" onClick={() => navigate(`/temple/continuous-collections/${selectedCollection.id}/share`)}><Share2 size={17}/> Preparar partilha</Button>
          <Button variant="secondary" onClick={() => navigate('/temple/continuous-received')}><Inbox size={17}/> Receber partilha</Button>
          <Button variant="ghost" onClick={() => navigate('/temple/continuous-map')}>Consultar mapa</Button>
        </div>

        <h3>Referências ordenadas manualmente</h3>
        {selectedCollection.items.length === 0 ? <p>Esta coleção está vazia. Isso não representa falta, atraso ou trabalho incompleto.</p> : <ol className="continuous-collection-items">
          {selectedCollection.items.map((reference, index) => <li key={reference.key}>
            <div>
              <p className="eyebrow">{reference.source === 'local-map' ? 'Mapa local' : 'Mapa importado'}</p>
              <strong>{itemLabel(reference.item)}</strong>
              <span>{themeLabel(reference.item)} · {reference.item.status}</span>
              <code>{reference.key}</code>
              {!reference.item.linked && <small>Origem não vinculada; referência preservada como desconhecida.</small>}
            </div>
            <div className="continuous-collection-item-actions">
              <button type="button" disabled={selectedCollection.status !== 'active' || index === 0} onClick={() => moveItem(selectedCollection.id, reference.key, -1)} aria-label={`Mover ${itemLabel(reference.item)} para cima`}><ArrowUp/></button>
              <button type="button" disabled={selectedCollection.status !== 'active' || index === selectedCollection.items.length - 1} onClick={() => moveItem(selectedCollection.id, reference.key, 1)} aria-label={`Mover ${itemLabel(reference.item)} para baixo`}><ArrowDown/></button>
              <button type="button" disabled={selectedCollection.status !== 'active'} onClick={() => removeItem(selectedCollection.id, reference.key)} aria-label={`Remover referência ${itemLabel(reference.item)}`}><Trash2/></button>
            </div>
          </li>)}
        </ol>}

        <h3>3. Adicionar do mapa local</h3>
        {localMapItems.length === 0 ? <p>Nenhum Rastro ou ciclo está disponível no mapa local.</p> : <div className="continuous-collection-source-grid">
          {localMapItems.map((item) => {
            const added = selectedKeys.has(collectionItemKey(item));
            return <article key={`${item.kind}-${item.id}`}>
              <p className="eyebrow">{item.kind === 'trail' ? 'Rastro' : 'Ciclo temático'}</p>
              <strong>{itemLabel(item)}</strong>
              <span>{themeLabel(item)} · {item.status}</span>
              <Button variant="secondary" disabled={selectedCollection.status !== 'active' || added} onClick={() => addLocalItem(selectedCollection.id, item)}>{added ? 'Referência incluída' : 'Adicionar referência'}</Button>
            </article>;
          })}
        </div>}

        <h3>4. Importar mapa exportado</h3>
        <div className="continuous-collection-import">
          <label className={selectedCollection.status !== 'active' ? 'continuous-collection-import--disabled' : ''}>
            <Import aria-hidden="true"/>
            <span>Selecionar JSON do mapa 8.5</span>
            <input type="file" accept="application/json,.json" disabled={selectedCollection.status !== 'active'} onChange={handleImport}/>
          </label>
          <p>O arquivo é validado localmente. A importação adiciona referências à coleção e não restaura jornadas.</p>
          {importMessage && <p className="continuous-collection-import__success">{importMessage}</p>}
          {importErrors.length > 0 && <ul className="continuous-collection-import__errors">{importErrors.map((error) => <li key={error}>{error}</li>)}</ul>}
        </div>
      </Card>}
    </>}

    <Card title="Limites das coleções" eyebrow="Sem valor acumulado">
      <ul className="simple-list">{continuousCollectionRestrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul>
      <div className="continuous-collection-actions"><Button variant="secondary" onClick={() => navigate('/temple/continuous-map')}>Voltar ao mapa</Button><Button variant="secondary" onClick={() => navigate('/temple/continuous-received')}><Inbox size={17}/> Biblioteca recebida</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Voltar ao Átrio</Button></div>
    </Card>
  </div>;
}
