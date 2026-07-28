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
  await import('../src/content/validateContinuousVersion');
  await import('../src/content/validateContinuousResource');
  await import('../src/content/validateContinuousInertJson');
  await import('../src/content/validateContinuousTextVisibility');
  await import('../src/content/validateContinuousUniqueKeys');
  await import('../src/content/validateContinuousNumericLexeme');
  await import('../src/content/validateContinuousStrictContract');
  await import('../src/content/validateContinuousExactText');
  await import('../src/content/validateContinuousExactTime');
  await import('../src/content/validateContinuousExactRelation');
  await import('../src/content/validateContinuousFieldCompatibility');
  await import('../src/content/validateContinuousCatalogReference');
  await import('../src/content/validateContinuousCanonicalNotice');
  await import('../src/content/validateContinuousFingerprintEquivalence');
  await import('../src/content/validateContinuousReceivedIdentity');
  console.log('Conteúdo Athanor validado com sucesso.');
} catch (error) {
  console.error('Falha na validação editorial:');
  console.error(error instanceof Error ? error.message : error);
  throw error;
}
