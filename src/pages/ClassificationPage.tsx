import { ArrowRight, CheckCircle2, CircleHelp } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { categories, classificationEntries } from '../content/seed';
import type { ClassificationEntry } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';

export function ClassificationPage() {
  const navigate = useNavigate();
  const mission = useAthanorStore((state) => state.activeMission);
  const classify = useAthanorStore((state) => state.classifyEntry);
  const complete = useAthanorStore((state) => state.completeClassification);
  const results = useMemo(() => classificationEntries.map((entry) => ({ entry, selected: mission?.classifications[entry.id], correct: mission?.classifications[entry.id] === entry.correctCategory })), [mission?.classifications]);
  const completeCount = results.filter((item) => item.selected).length;
  const correctCount = results.filter((item) => item.correct).length;
  const choose = (entry: ClassificationEntry, category: ClassificationEntry['correctCategory']) => classify(entry, category);
  const submit = () => { complete(); navigate('/mission/word-before-response/chain'); };
  return (
    <div className="page">
      <PageHeader eyebrow="Missão · Etapa de classificação" title="O que cada frase representa?" description="Escolha a categoria mais adequada. Você pode mudar qualquer resposta antes de continuar." action={<span className="progress-pill">{completeCount}/{classificationEntries.length}</span>} />
      <div className="classification-layout">
        <section className="sentence-list" aria-label="Frases para classificar">
          {results.map(({ entry, selected, correct }, index) => <Card key={entry.id} className={`sentence-card ${selected ? 'sentence-card--answered' : ''}`} eyebrow={`Mensagem ${index + 1}`}><p className="sentence-card__text">{entry.text}</p><div className="category-buttons">{categories.map((category) => <button key={category.id} type="button" className={`category-button ${selected === category.id ? 'category-button--selected' : ''}`} onClick={() => choose(entry, category.id)} aria-pressed={selected === category.id}>{category.label}</button>)}</div>{selected && <p role="status" aria-live="polite" className={`feedback ${correct ? 'feedback--correct' : 'feedback--review'}`}>{correct ? <CheckCircle2 size={17}/> : <CircleHelp size={17}/>}<span>{correct ? categories.find((category) => category.id === entry.correctCategory)?.help : `Reveja: esta frase funciona melhor como ${categories.find((category) => category.id === entry.correctCategory)?.label.toLowerCase()}.`}</span></p>}</Card>)}
        </section>
        <aside className="classification-guide"><Card title="Guia rápido" eyebrow="Sem diagnóstico">{categories.map((category) => <div className="guide-item" key={category.id}><strong>{category.label}</strong><span>{category.help}</span></div>)}<hr/><p><strong>{correctCount}</strong> classificações coerentes até agora. O objetivo é compreender as diferenças, não obter uma nota.</p></Card></aside>
      </div>
      <div className="mission-actions"><Button variant="ghost" onClick={() => navigate('/mission/word-before-response')}>Voltar</Button><Button disabled={completeCount < classificationEntries.length} onClick={submit}>Abrir cadeia simbólica <ArrowRight size={18}/></Button></div>
    </div>
  );
}
