try {
  await import('../src/content/validate');
  await import('../src/content/validateNewWork');
  console.log('Conteúdo Athanor validado com sucesso.');
} catch (error) {
  console.error('Falha na validação editorial:');
  console.error(error instanceof Error ? error.message : error);
  throw error;
}
