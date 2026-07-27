import { useMemo, useState } from 'react';
import { Archive, BookOpenText, CheckCircle2, Circle, Clock3, History, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  continuousMapBiblicalUnit,
  continuousMapCatalog,
  continuousMapGroupOptions,
  continuousMapKindOptions,
  continuousMapRestrictions,
  continuousMapStatusOptions
} from '../content/continuousMap';
import { continuousThemes } from '../content/continuousTheme';
import { continuousThemeCyclePackages } from '../content/continuousThemeCycle';
import { newWorkStartPoints } from '../content/newWork';
import {
  buildContinuousMapItems,
  compareContinuousMapItems,
  createContinuousMapExport,
  defaultContinuousMapFilters,
  filterContinuousMapItems,
  groupContinuousMapItems,
  type ContinuousMapFilters,
  type ContinuousMapGroupKey,
  type ContinuousMapItem,
  type ContinuousMapStatus
} from '../domain/continuousMap';
import { useContinuousThemeCycleStore } from '../state/useContinuousThemeCycleStore';
import { useContinuousTrailStore } from '../state/useContinuousTrailStore';

const statusLabels: Record<ContinuousMapStatus, string> = {
  active: 'Ativo',
  paused: 'Pausado',
  completed: 'Concluído',
  declined: 'Sem ciclo adicional',
  incomplete: 'Encerrado ou incompleto',
  unknown: 'Desconhecido'
};

const comparisonLabels = {
  kind: 'Tipo de registro',
  element: 'Elemento',
  theme: 'Tema',
  package: 'Pacote',
  variant: 'Variante',
  status: 'Estado',
  depth: 'Profundidade'
} as const;

function getElementLabel(id: string): string {
  return newWorkStartPoints.find((item) => item.id === id)?.label ?? id;
}

function getThemeLabel(id?: string, noTheme = false): string {
  if (id) return continuousThemes.find((item) => item.id === id)?.label ?? id;
  if (noTheme) return 'Sem tema';
  return 'Tema desconhecido';
}

function getPackageLabel(item: ContinuousMapItem): string {
  if (item.packageLabel) return item.packageLabel;
  if (item.packageId) return continuousThemeCyclePackages.find((entry) => entry.id === item.packageId)?.label ?? item.packageId;
  return item.kind === 'trail' ? 'Rastro sem pacote' : 'Pacote desconhecido';
}

function getGroupLabel(groupKey: ContinuousMapGroupKey, id: string): string {
  if (groupKey === 'element') return getElementLabel(id);
  if (groupKey === 'theme') {
    if (id === 'no-theme') return 'Sem tema';
    if (id === 'unknown-theme') return 'Tema desconhecido';
    return continuousThemes.find((item) => item.id === id)?.label ?? id;
  }
  if (id === 'trail-without-package') return 'Rastros sem pacote';
  if (id === 'unknown-package') return 'Pacote desconhecido';
  return continuousThemeCyclePackages.find((item) => item.id === id)?.label ?? id;
}

function StatusIcon({ status }: { status: ContinuousMapStatus }) {
  if (status === 'completed') return <CheckCircle2 aria-hidden="true"/>;
  if (status === 'paused') return <Clock3 aria-hidden="true"/>;
  if (status === 'declined') return <Archive aria-hidden="true"/>;
  return <Circle aria-hidden="true"/>;
}

export function ContinuousMapPage() {
  const navigate = useNavigate();
  const trails = useContinuousTrailStore((state) => state.progress.trails);
  const themeCycles = useContinuousThemeCycleStore((state) => state.progress.instances);
  const [filters, setFilters] = useState<ContinuousMapFilters>(defaultContinuousMapFilters);
  const [groupKey, setGroupKey] = useState<ContinuousMapGroupKey>('element');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allItems = useMemo(() => buildContinuousMapItems(trails, themeCycles), [trails, themeCycles]);
  const filteredItems = useMemo(() => filterContinuousMapItems(allItems, filters), [allItems, filters]);
  const groups = useMemo(() => groupContinuousMapItems(filteredItems, groupKey), [filteredItems, groupKey]);
  const themeOptions = useMemo(() => Array.from(new Set(allItems.map((item) => item.themeId ?? (item.noTheme ? 'no-theme' : 'unknown-theme')))).sort(), [allItems]);
  const packageOptions = useMemo(() => Array.from(new Set(allItems.map((item) => item.packageId ?? (item.kind === 'trail' ? 'trail-without-package' : 'unknown-package')))).sort(), [allItems]);
  const selectedItems = selectedIds.map((id) => allItems.find((item) => item.id === id)).filter((item): item is ContinuousMapItem => Boolean(item));
  const comparison = selectedItems.length === 2 ? compareContinuousMapItems(selectedItems[0], selectedItems[1]) : [];

  const updateFilter = <K extends keyof ContinuousMapFilters>(key: K, value: ContinuousMapFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const toggleComparison = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 2) return [current[1], id];
      return [...current, id];
    });
  };

  const exportMap = () => {
    const payload = createContinuousMapExport(filteredItems, filters, new Date().toISOString());
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `athanor-mapa-ciclos-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (allItems.length === 0) {
    return <div className="page page--continuous-map">
      <PageHeader eyebrow="Fase 8.5" title="O mapa ainda não possui Rastros." description="O mapa é criado somente a partir de registros locais existentes e não inventa um histórico."/>
      <Card title="Registros necessários" eyebrow="Mapa derivado"><p>Conclua ou inicie um Rastro da jornada contínua para que ele apareça aqui. Nenhum ciclo será aberto automaticamente.</p><Button onClick={() => navigate('/temple/continuous-cycles')}>Abrir jornadas contínuas</Button></Card>
    </div>;
  }

  return <div className="page page--continuous-map">
    <PageHeader eyebrow="O Mapa dos Ciclos que Não Hierarquiza" title="Visualize memória e contexto sem transformar registros em medida." description="Rastros e ciclos temáticos podem ser agrupados, filtrados, comparados e exportados. Nenhuma quantidade ou estado representa evolução pessoal."/>

    <div className="continuous-map-intro-grid">
      <Card title={continuousMapBiblicalUnit.title} eyebrow={continuousMapBiblicalUnit.reference}><blockquote>{continuousMapBiblicalUnit.principle}</blockquote><p>{continuousMapBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a reflexão; o mapa e suas operações são estruturas autorais da Tehkné Solutions.</span></div></Card>
      <Card title="Catálogo do mapa" eyebrow={`Versão ${continuousMapCatalog.version}`}><ul className="simple-list"><li>Modo: somente leitura</li><li>Política: sem ranking</li><li>Itens: {allItems.length}</li><li>Rastros: {allItems.filter((item) => item.kind === 'trail').length}</li><li>Ciclos temáticos: {allItems.filter((item) => item.kind === 'theme-cycle').length}</li></ul><div className="safety-summary"><ShieldCheck/><p>Filtros e comparação não alteram nenhum registro de origem.</p></div></Card>
    </div>

    <Card title="Filtros locais" eyebrow={`${filteredItems.length} de ${allItems.length} itens visíveis`}>
      <div className="continuous-map-filters">
        <label><span>Tipo</span><select value={filters.kind} onChange={(event) => updateFilter('kind', event.target.value as ContinuousMapFilters['kind'])}>{continuousMapKindOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
        <label><span>Elemento</span><select value={filters.startPoint} onChange={(event) => updateFilter('startPoint', event.target.value as ContinuousMapFilters['startPoint'])}><option value="all">Todos os elementos</option>{newWorkStartPoints.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
        <label><span>Tema</span><select value={filters.themeId} onChange={(event) => updateFilter('themeId', event.target.value)}><option value="all">Todos os temas</option>{themeOptions.map((id) => <option key={id} value={id}>{id === 'no-theme' ? 'Sem tema' : id === 'unknown-theme' ? 'Tema desconhecido' : getThemeLabel(id)}</option>)}</select></label>
        <label><span>Pacote</span><select value={filters.packageId} onChange={(event) => updateFilter('packageId', event.target.value)}><option value="all">Todos os pacotes</option>{packageOptions.map((id) => <option key={id} value={id}>{id === 'trail-without-package' ? 'Rastros sem pacote' : id === 'unknown-package' ? 'Pacote desconhecido' : continuousThemeCyclePackages.find((item) => item.id === id)?.label ?? id}</option>)}</select></label>
        <label><span>Estado</span><select value={filters.status} onChange={(event) => updateFilter('status', event.target.value as ContinuousMapFilters['status'])}>{continuousMapStatusOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
        <label><span>Buscar IDs ou nomes</span><input type="search" value={filters.query} onChange={(event) => updateFilter('query', event.target.value)} placeholder="Rastro, variante ou pacote"/></label>
      </div>
      <div className="continuous-map-toolbar"><div role="group" aria-label="Agrupar mapa">{continuousMapGroupOptions.map((option) => <button key={option.id} type="button" aria-pressed={groupKey === option.id} onClick={() => setGroupKey(option.id)}>{option.label}</button>)}</div><Button variant="secondary" onClick={exportMap}>Exportar mapa filtrado</Button><Button variant="ghost" onClick={() => { setFilters(defaultContinuousMapFilters); setSelectedIds([]); }}>Limpar filtros</Button></div>
    </Card>

    {groups.length === 0 ? <Card title="Nenhum registro neste recorte" eyebrow="Filtros preservados"><p>O histórico continua intacto. Remova ou altere filtros para visualizar outros registros.</p></Card> : <div className="continuous-map-groups">{groups.map((group) => <section key={group.id} className="continuous-map-group" aria-labelledby={`map-group-${group.id}`}><header><div><p className="eyebrow">Agrupado por {continuousMapGroupOptions.find((option) => option.id === groupKey)?.label}</p><h2 id={`map-group-${group.id}`}>{getGroupLabel(groupKey, group.id)}</h2></div><span>{group.items.length} registros</span></header><div className="continuous-map-items">{group.items.map((item) => <article key={`${item.kind}-${item.id}`} className={`continuous-map-item continuous-map-item--${item.status}`}><div className="continuous-map-item__status"><StatusIcon status={item.status}/><span>{statusLabels[item.status]}</span></div><p className="eyebrow">{item.kind === 'trail' ? 'Rastro' : 'Ciclo temático'}</p><h3>{item.kind === 'trail' ? getElementLabel(item.startPoint) : getPackageLabel(item)}</h3><dl><div><dt>Tema</dt><dd>{getThemeLabel(item.themeId, item.noTheme)}</dd></div><div><dt>Variante</dt><dd><code>{item.variantId}</code></dd></div><div><dt>Registro</dt><dd><code>{item.id}</code></dd></div><div><dt>Data local</dt><dd>{new Date(item.occurredAt).toLocaleString('pt-BR')}</dd></div>{item.kind === 'theme-cycle' && <><div><dt>Profundidade</dt><dd>{item.depth ?? 'desconhecida'}</dd></div><div><dt>Passagens</dt><dd>{item.passageSummary.completed} concluídas · {item.passageSummary.passed} passadas · {item.passageSummary.pending} pendentes</dd></div></>}</dl>{!item.linked && <p className="field-help">Origem não vinculada. O registro foi preservado sem interpretação.</p>}<button type="button" className="continuous-map-compare" aria-pressed={selectedIds.includes(item.id)} onClick={() => toggleComparison(item.id)}>{selectedIds.includes(item.id) ? 'Remover da comparação' : 'Selecionar para comparar'}</button></article>)}</div></section>)}</div>}

    <Card title="Comparação neutra" eyebrow={`${selectedItems.length} de 2 registros selecionados`}>
      {selectedItems.length < 2 ? <p>Selecione dois itens no mapa. A comparação mostrará somente igualdade, diferença ou informação desconhecida.</p> : <div className="continuous-map-comparison"><header><strong>{selectedItems[0].id}</strong><span>comparado com</span><strong>{selectedItems[1].id}</strong></header><div className="continuous-map-comparison__rows">{comparison.map((row) => <div key={row.dimension}><strong>{comparisonLabels[row.dimension]}</strong><span>{row.left}</span><span className={`continuous-map-relation continuous-map-relation--${row.relation}`}>{row.relation === 'same' ? 'igual' : row.relation === 'different' ? 'diferente' : 'desconhecido'}</span><span>{row.right}</span></div>)}</div></div>}
      <div className="safety-summary"><History/><p>A comparação não ordena, recomenda ou atribui valor aos registros.</p></div>
    </Card>

    <Card title="Linha do tempo local" eyebrow="Sem streak ou tendência"><ol className="continuous-map-timeline">{filteredItems.map((item) => <li key={`timeline-${item.kind}-${item.id}`}><span>{new Date(item.occurredAt).toLocaleString('pt-BR')}</span><strong>{item.kind === 'trail' ? `Rastro · ${getElementLabel(item.startPoint)}` : `Ciclo · ${getPackageLabel(item)}`}</strong><small>{statusLabels[item.status]}</small></li>)}</ol></Card>

    <Card title="Limites do mapa" eyebrow="Somente descrição"><ul className="simple-list">{continuousMapRestrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul><div className="continuous-map-toolbar"><Button variant="secondary" onClick={() => navigate('/temple/continuous-cycles')}>Voltar às jornadas</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Voltar ao Átrio</Button></div></Card>
  </div>;
}
