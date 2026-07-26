try {
  await import('../src/content/validate');
  await import('../src/content/validateNewWork');
  await import('../src/content/validateContinuousCycle');
  await import('../src/content/validateContinuousTrail');
  console.log('Conteúdo Athanor validado com sucesso.');
} catch (error) {
  console.error('Falha na validação editorial:');
  console.error(error instanceof Error ? error.message : error);
  throw error;
}
