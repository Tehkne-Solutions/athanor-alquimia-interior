import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import { newWorkBiblicalUnit, newWorkModes, newWorkRestrictions, newWorkStartPoints } from './newWork';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

const biblicalUnitSchema = z.object({
  id: z.literal('psalm_new_work_v1'),
  reference: z.string().min(1),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(4),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
});

biblicalUnitSchema.parse(newWorkBiblicalUnit);
z.array(z.object({ id: z.string().min(1), label: z.string().min(1), description: z.string().min(1), route: z.string().startsWith('/') })).length(6).parse(newWorkStartPoints);
z.array(z.object({ id: z.string().min(1), label: z.string().min(1), description: z.string().min(1) })).length(4).parse(newWorkModes);
z.array(z.string().min(1)).min(5).parse(newWorkRestrictions);
