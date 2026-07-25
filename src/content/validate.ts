import { z } from 'zod';
import { biblicalUnits, chainNodes, classificationEntries } from './seed';
import { provenanceClassSchema } from '../domain/types';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

const biblicalUnitSchema = z.object({
  id: z.string().min(1),
  reference: z.string().min(1),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string()).min(1),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
});

const nodeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['biblical', 'principle', 'sefirah', 'element', 'letter', 'trigram', 'archetype', 'athanor']),
  description: z.string().min(1),
  provenance: provenanceSchema,
  layer: z.enum(['sefer', 'kabbalah', 'iching', 'tarot']).optional(),
  fallbackNodeId: z.string().optional()
});

export function validateContent(): void {
  z.array(biblicalUnitSchema).parse(biblicalUnits);
  z.array(nodeSchema).parse(chainNodes);
  z.array(z.object({ id: z.string(), text: z.string(), correctCategory: z.enum(['fact', 'interpretation', 'prediction', 'intention']) })).parse(classificationEntries);

  const nodeIds = new Set(chainNodes.map((node) => node.id));
  for (const node of chainNodes) {
    if (node.fallbackNodeId && !nodeIds.has(node.fallbackNodeId)) {
      throw new Error(`Fallback inexistente: ${node.fallbackNodeId}`);
    }
  }
}

validateContent();
