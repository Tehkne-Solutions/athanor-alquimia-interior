import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import { earthBodyEntries, earthBodyNodes } from './earthBody';
import { earthFoundationBiblicalUnit, earthFoundationNodes } from './earthFoundation';
import { earthOrderBiblicalUnit, earthOrderEntries, earthOrderNodes } from './earthOrder';
import { earthResourceEntries, earthResourcesBiblicalUnit, earthResourcesNodes } from './earthResources';
import { earthRhythmBiblicalUnit, earthRhythmEntries, earthRhythmNodes } from './earthRhythm';
import { earthStoneBiblicalUnit, earthStoneNodes, earthStoneRecipe } from './earthStone';
import { earthWorkBiblicalUnit, earthWorkEntries, earthWorkNodes } from './earthWork';
import { fireBoundaryBiblicalUnit, fireBoundaryNodes, fireBoundaryStatements } from './fireBoundary';
import { fireCourageBiblicalUnit, fireCourageNodes, fireCourageStatements } from './fireCourage';
import { fireIntervalBiblicalUnit, fireIntervalNodes, fireTimelineEntries, fireUrgencyEntries } from './fireInterval';
import { fireFoundationBiblicalUnit, fireFoundationNodes } from './fireFoundation';
import { fireClassificationEntries, fireMissionNodes } from './fireMission';
import { fireShieldBiblicalUnit, fireShieldNodes, fireShieldRecipe } from './fireShield';
import { fireTransformationBiblicalUnit, fireTransformationNodes, fireTransformationStatements } from './fireTransformation';
import { biblicalUnits, chainNodes, classificationEntries } from './seed';
import { spiritCenterBiblicalUnit, spiritCenterEntries, spiritCenterNodes, spiritCenterScenarios } from './spiritCenter';
import { spiritCouncilBiblicalUnit, spiritCouncilEntries, spiritCouncilNodes, spiritCouncilScenarios } from './spiritCouncil';
import { spiritDecisionBiblicalUnit, spiritDecisionEntries, spiritDecisionNodes, spiritDecisionScenarios } from './spiritDecision';
import { spiritFoundationBiblicalUnit, spiritFoundationNodes, spiritSynthesisDimensions } from './spiritFoundation';
import { spiritScenarios, spiritThreadEntries, spiritThreadNodes } from './spiritThread';
import { waterBiblicalUnit, waterLamentBiblicalUnit, waterMemoryBiblicalUnit, waterMemoryEntries, waterMemoryNodes } from './water';
import { waterChaliceRecipe } from './waterChalice';
import { waterTrustBiblicalUnit, waterTrustNodes, waterTrustStatements } from './waterTrust';

const provenanceSchema = z.object({ id: z.string().min(1), label: z.string().min(1), class: provenanceClassSchema, explanation: z.string().min(1), sourceLabel: z.string().optional() });
const biblicalUnitSchema = z.object({ id: z.string().min(1), reference: z.string().min(1), title: z.string().min(1), principle: z.string().min(1), context: z.string().min(1), themes: z.array(z.string()).min(1), application: z.string().min(1), provenance: z.array(provenanceSchema).min(1) });
const nodeSchema = z.object({ id: z.string().min(1), name: z.string().min(1), category: z.enum(['biblical', 'principle', 'sefirah', 'element', 'letter', 'trigram', 'archetype', 'athanor']), description: z.string().min(1), provenance: provenanceSchema, layer: z.enum(['sefer', 'kabbalah', 'iching', 'tarot']).optional(), fallbackNodeId: z.string().optional() });
const waterMemoryEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['memory', 'present_sensation', 'prediction', 'need', 'action']), explanation: z.string().min(1) });
const waterTrustStatementSchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['support', 'guarantee', 'prediction']), explanation: z.string().min(1) });
const fireClassificationEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['emotion', 'impulse', 'need', 'action']), explanation: z.string().min(1) });
const fireTimelineEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedPhase: z.enum(['trigger', 'body_signal', 'impulse', 'gesture']), explanation: z.string().min(1) });
const fireUrgencyEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['immediate_safety', 'time_sensitive', 'perceived_pressure', 'insufficient_information']), explanation: z.string().min(1) });
const fireBoundaryStatementSchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['boundary', 'control', 'punishment']), explanation: z.string().min(1) });
const fireCourageStatementSchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['proportional_courage', 'imprudent_exposure', 'avoidance', 'external_pressure']), explanation: z.string().min(1) });
const fireTransformationStatementSchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['preserve', 'repair', 'transform', 'close', 'archive']), explanation: z.string().min(1) });
const earthBodyEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['perceived_signal', 'interpretation', 'need', 'action']), explanation: z.string().min(1) });
const earthWorkEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['intention', 'project', 'task', 'first_step']), explanation: z.string().min(1) });
const earthResourceEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['resource', 'desire', 'dependency', 'guarantee']), explanation: z.string().min(1) });
const earthRhythmEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['rhythm', 'rush', 'repetition', 'pressure']), explanation: z.string().min(1) });
const earthOrderEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['order', 'priority', 'rigidity', 'accumulation']), explanation: z.string().min(1) });
const spiritDimensionSchema = z.object({ id: z.enum(['word', 'emotion', 'impulse', 'body', 'action']), label: z.string().min(1), description: z.string().min(1) });
const spiritThreadEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['word', 'emotion', 'impulse', 'body', 'action', 'unknown']), explanation: z.string().min(1) });
const spiritScenarioSchema = z.object({ id: z.string().min(1), title: z.string().min(1), context: z.string().min(1), dimensions: z.object({ word: z.string().min(1), emotion: z.string().min(1), impulse: z.string().min(1), body: z.string().min(1), action: z.string().min(1) }) });
const spiritCenterEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['centrality', 'superiority', 'exclusion', 'integration']), explanation: z.string().min(1) });
const spiritCenterScenarioSchema = z.object({ id: z.string().min(1), title: z.string().min(1), description: z.string().min(1), competingParts: z.array(z.string().min(1)).min(2) });
const spiritCouncilEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['agreement', 'negotiation', 'silence', 'coercion']), explanation: z.string().min(1) });
const spiritCouncilScenarioSchema = z.object({ id: z.string().min(1), title: z.string().min(1), description: z.string().min(1), prompts: z.object({ word: z.string().min(1), emotion: z.string().min(1), impulse: z.string().min(1), body: z.string().min(1), action: z.string().min(1) }) });
const spiritDecisionEntrySchema = z.object({ id: z.string().min(1), text: z.string().min(1), suggestedCategory: z.enum(['provisional_decision', 'promise', 'prediction', 'obedience']), explanation: z.string().min(1) });
const spiritDecisionScenarioSchema = z.object({ id: z.string().min(1), title: z.string().min(1), description: z.string().min(1), positions: z.object({ word: z.string().min(1), emotion: z.string().min(1), impulse: z.string().min(1), body: z.string().min(1), action: z.string().min(1) }) });
const waterChaliceRecipeSchema = z.object({ id: z.literal('recipe_memory_serene_chalice_v1'), name: z.string().min(1), componentIds: z.array(z.string().min(1)).length(4), principle: z.string().min(1), restrictions: z.array(z.string().min(1)).min(4), version: z.string().min(1) });
const fireShieldRecipeSchema = z.object({ id: z.literal('recipe_just_boundary_shield_v1'), name: z.string().min(1), componentIds: z.array(z.string().min(1)).length(5), principle: z.string().min(1), restrictions: z.array(z.string().min(1)).min(5), version: z.string().min(1) });
const earthStoneRecipeSchema = z.object({ id: z.literal('recipe_first_step_stone_v1'), name: z.string().min(1), componentIds: z.array(z.string().min(1)).length(5), principle: z.string().min(1), restrictions: z.array(z.string().min(1)).min(5), version: z.string().min(1) });

export function validateContent(): void {
  z.array(biblicalUnitSchema).parse([
    ...biblicalUnits,
    waterBiblicalUnit,
    waterLamentBiblicalUnit,
    waterMemoryBiblicalUnit,
    waterTrustBiblicalUnit,
    fireFoundationBiblicalUnit,
    fireIntervalBiblicalUnit,
    fireBoundaryBiblicalUnit,
    fireCourageBiblicalUnit,
    fireTransformationBiblicalUnit,
    fireShieldBiblicalUnit,
    earthFoundationBiblicalUnit,
    earthWorkBiblicalUnit,
    earthResourcesBiblicalUnit,
    earthRhythmBiblicalUnit,
    earthOrderBiblicalUnit,
    earthStoneBiblicalUnit,
    spiritFoundationBiblicalUnit,
    spiritCenterBiblicalUnit,
    spiritCouncilBiblicalUnit,
    spiritDecisionBiblicalUnit
  ]);

  const allNodes = [
    ...chainNodes,
    ...waterMemoryNodes,
    ...waterTrustNodes,
    ...fireFoundationNodes,
    ...fireMissionNodes,
    ...fireIntervalNodes,
    ...fireBoundaryNodes,
    ...fireCourageNodes,
    ...fireTransformationNodes,
    ...fireShieldNodes,
    ...earthFoundationNodes,
    ...earthBodyNodes,
    ...earthWorkNodes,
    ...earthResourcesNodes,
    ...earthRhythmNodes,
    ...earthOrderNodes,
    ...earthStoneNodes,
    ...spiritFoundationNodes,
    ...spiritThreadNodes,
    ...spiritCenterNodes,
    ...spiritCouncilNodes,
    ...spiritDecisionNodes
  ];

  z.array(nodeSchema).parse(allNodes);
  z.array(waterMemoryEntrySchema).min(5).parse(waterMemoryEntries);
  z.array(waterTrustStatementSchema).min(6).parse(waterTrustStatements);
  z.array(fireClassificationEntrySchema).length(8).parse(fireClassificationEntries);
  z.array(fireTimelineEntrySchema).length(8).parse(fireTimelineEntries);
  z.array(fireUrgencyEntrySchema).length(8).parse(fireUrgencyEntries);
  z.array(fireBoundaryStatementSchema).length(9).parse(fireBoundaryStatements);
  z.array(fireCourageStatementSchema).length(8).parse(fireCourageStatements);
  z.array(fireTransformationStatementSchema).length(10).parse(fireTransformationStatements);
  z.array(earthBodyEntrySchema).length(8).parse(earthBodyEntries);
  z.array(earthWorkEntrySchema).length(8).parse(earthWorkEntries);
  z.array(earthResourceEntrySchema).length(8).parse(earthResourcesEntries);
  z.array(earthRhythmEntrySchema).length(8).parse(earthRhythmEntries);
  z.array(earthOrderEntrySchema).length(8).parse(earthOrderEntries);
  z.array(spiritDimensionSchema).length(5).parse(spiritSynthesisDimensions);
  z.array(spiritThreadEntrySchema).length(10).parse(spiritThreadEntries);
  z.array(spiritScenarioSchema).length(4).parse(spiritScenarios);
  z.array(spiritCenterEntrySchema).length(8).parse(spiritCenterEntries);
  z.array(spiritCenterScenarioSchema).length(4).parse(spiritCenterScenarios);
  z.array(spiritCouncilEntrySchema).length(8).parse(spiritCouncilEntries);
  z.array(spiritCouncilScenarioSchema).length(4).parse(spiritCouncilScenarios);
  z.array(spiritDecisionEntrySchema).length(8).parse(spiritDecisionEntries);
  z.array(spiritDecisionScenarioSchema).length(4).parse(spiritDecisionScenarios);
  waterChaliceRecipeSchema.parse(waterChaliceRecipe);
  fireShieldRecipeSchema.parse(fireShieldRecipe);
  earthStoneRecipeSchema.parse(earthStoneRecipe);
  z.array(z.object({ id: z.string(), text: z.string(), correctCategory: z.enum(['fact', 'interpretation', 'prediction', 'intention']) })).parse(classificationEntries);

  const nodeIds = new Set(allNodes.map((node) => node.id));
  for (const node of allNodes) {
    if (node.fallbackNodeId && !nodeIds.has(node.fallbackNodeId)) throw new Error(`Fallback inexistente: ${node.fallbackNodeId}`);
  }
}

validateContent();
