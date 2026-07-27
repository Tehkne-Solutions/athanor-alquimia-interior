try {
  await import('../src/content/validate');
  await import('../src/content/validateNewWork');
  await import('../src/content/validateContinuousCycle');
  await import('../src/content/validateContinuousTrail');
  await import('../src/content/validateContinuousVariation');
  await import('../src/content/validateContinuousTheme');
  await import('../src/content/validateContinuousThemeCycle');
  await import('../src/content/validateContinuousMap');
  await import('../src/content/validateContinuousCollection');
  await import('../src/content/validateContinuousShare');
  await import('../src/content/validateContinuousReceive');
  await import('../src/content/validateContinuousResponse');
  await import('../src/content/validateContinuousReturn');
  await import('../src/content/validateContinuousConsistency');
  console.log('Conteúdo Athanor validado com sucesso.');
} catch (error) {
  console.error('Falha na validação editorial:');
  console.error(error instanceof Error ? error.message : error);
  throw error;
}
