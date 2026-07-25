import { describe, expect, it } from 'vitest';
import { buildHomologationReport, homologationTasks } from './homologation';

describe('buildHomologationReport', () => {
  it('calcula o resumo e mantém somente dados da sessão moderada', () => {
    const report = buildHomologationReport({
      metadata: {
        participantCode: 'P-01',
        deviceProfile: 'notebook',
        assistiveTechnology: 'teclado',
        moderator: 'Tehkné Solutions'
      },
      results: {
        [homologationTasks[0].id]: { status: 'passed', notes: 'Concluiu sem ajuda.' },
        [homologationTasks[1].id]: { status: 'friction', notes: 'Demorou para perceber a reversibilidade.' },
        [homologationTasks[2].id]: { status: 'blocked', notes: 'Não compreendeu uma etiqueta.' }
      },
      ratings: { comprehension: 4, navigation: 3, visualComfort: 5, trust: 4 },
      finalNotes: 'Sessão concluída.',
      generatedAt: '2026-07-25T15:00:00.000Z'
    });

    expect(report.summary.passed).toBe(1);
    expect(report.summary.friction).toBe(1);
    expect(report.summary.blocked).toBe(1);
    expect(report.summary['not-tested']).toBe(homologationTasks.length - 3);
    expect(report.tasks).toHaveLength(homologationTasks.length);
    expect(report).not.toHaveProperty('journal');
    expect(JSON.stringify(report)).not.toContain('activeMission');
    expect(report.signature).toBe('Tehkné Solutions');
  });
});
