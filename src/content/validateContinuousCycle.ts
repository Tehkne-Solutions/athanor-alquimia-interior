import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousCycleBiblicalUnit,
  continuousCycleComparisonOptions,
  continuousCycleProceduralPolicy,
  continuousCycleRestrictions,
  continuousCycleStatusOptions
} from './continuousCycle';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('psalm_continuous_return_v1'),
  reference: z.string().min(1),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousCycleBiblicalUnit);

z.array(z.object({ id: z.enum(['active', 'paused', 'closed', 'archived']), label: z.string().min(1), description: z.string().min(1) })).length(4).parse(continuousCycleStatusOptions);
z.array(z.object({ id: z.enum(['not_compared', 'similar_context', 'changed_context', 'changed_resources', 'changed_focus', 'unknown']), label: z.string().min(1), description: z.string().min(1) })).length(6).parse(continuousCycleComparisonOptions);
z.object({ id: z.literal('continuous_curated_policy_v1'), source: z.literal('curated_registry'), copiesPreviousCycle: z.literal(false), allowedStages: z.tuple([z.literal('orientation'), z.literal('observation'), z.literal('review')]), description: z.string().min(1) }).parse(continuousCycleProceduralPolicy);
z.array(z.string().min(1)).min(7).parse(continuousCycleRestrictions);
