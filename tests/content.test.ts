import { describe, expect, it } from 'vitest';
import { biblicalUnits, chainNodes, classificationEntries } from '../src/content/seed';
import { validateContent } from '../src/content/validate';

describe('Bíblia Core seed', () => {
  it('valida o catálogo sem erros', () => {
    expect(() => validateContent()).not.toThrow();
  });

  it('mantém a Bíblia como primeiro nó da cadeia', () => {
    expect(chainNodes[0].category).toBe('biblical');
    expect(chainNodes[0].provenance.class).toBe('BIB');
  });

  it('possui fallbacks para todas as camadas opcionais', () => {
    const optionalNodes = chainNodes.filter((node) => node.layer);
    expect(optionalNodes.every((node) => Boolean(node.fallbackNodeId))).toBe(true);
  });

  it('inclui as quatro categorias de classificação', () => {
    const categories = new Set(classificationEntries.map((entry) => entry.correctCategory));
    expect(categories).toEqual(new Set(['fact', 'interpretation', 'prediction', 'intention']));
  });

  it('mantém referências bíblicas e contexto separados', () => {
    expect(biblicalUnits.every((unit) => unit.reference && unit.context && unit.principle)).toBe(true);
  });
});
