import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import { biblicalUnits, chainNodes, classificationEntries } from './seed';
import {
  waterBiblicalUnit,
  waterLamentBiblicalUnit,
  waterMemoryBiblicalUnit,
  waterMemoryEntries,
  waterMemoryNodes
} from './water';
import { waterChaliceRecipe } from './waterChalice';
import {
  waterTrustBiblicalUnit,
  waterTrustNodes,
  waterTrustStatements
} from './waterTrust';

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

const waterMemoryEntrySchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  suggestedCategory: z.enum(['memory', 'present_sensation', 'prediction', 'need', 'action']),
  explanation: z.string().min(1)
});

const waterTrustStatementSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  suggestedCategory: z.enum(['support', 'guarantee', 'prediction']),
  explanation: z.string().min(1)
});

const waterChaliceRecipeSchema = z.object({
  id: z.literal('recipe_memory_serene_chalice_v1'),
  name: z.string().min(1),
  componentIds: z.array(z.string().min(1)).length(4),
  principle: z.string().min(1),
  restrictions: z.array(z.string().min(1)).min(4),
  version: z.string().min(1)
});

export function validateContent(): void {
  z.array(biblicalUnitSchema).parse([
    ...biblicalUnits,
    waterBiblicalUnit,
    waterLamentBiblicalUnit,
    waterMemoryBiblicalUnit,
    waterTrustBiblicalUnit
  ]);

  const allNodes = [...chainNodes, ...waterMemoryNodes, ...waterTrustNodes];
  z.array(nodeSchema).parse(allNodes);
  z.array(waterMemoryEntrySchema).min(5).parse(waterMemoryEntries);
  z.array(waterTrustStatementSchema).min(6).parse(waterTrustStatements);
  waterChaliceRecipeSchema.parse(waterChaliceRecipe);
  z.array(z.object({ id: z.string(), text: z.string(), correctCategory: z.enum(['fact', 'interpretation', 'prediction', 'intention']) })).parse(classificationEntries);

  const nodeIds = new Set(allNodes.map((node) => node.id));
  for (const node of allNodes) {
    if (node.fallbackNodeId && !nodeIds.has(node.fallbackNodeId)) {
      throw new Error(`Fallback inexistente: ${node.fallbackNodeId}`);
    }
  }
}

validateContent();
