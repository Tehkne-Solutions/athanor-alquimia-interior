export type WaterTrustStatementCategory = 'support' | 'guarantee' | 'prediction';

export type WaterSupportResourceId =
  | 'trusted_person'
  | 'time'
  | 'information'
  | 'safe_place'
  | 'rest'
  | 'professional_support'
  | 'prior_experience';

export type WaterCareActionId =
  | 'ask_for_company'
  | 'confirm_information'
  | 'reorganize_deadline'
  | 'rest'
  | 'seek_professional_support'
  | 'none_now';

export type WaterTrustStatus = 'active' | 'completed';

export interface WaterTrustStatement {
  id: string;
  text: string;
  suggestedCategory: WaterTrustStatementCategory;
  explanation: string;
}

export interface WaterTrustProgress {
  id: 'mission_space_of_trust_v1';
  journeyStartedAt: string;
  status: WaterTrustStatus;
  classifications: Record<string, WaterTrustStatementCategory>;
  selectedResources: WaterSupportResourceId[];
  careAction?: WaterCareActionId;
  skippedClassification: boolean;
  bridgeCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface WaterTrustEvaluation {
  total: number;
  classified: number;
  aligned: number;
  differences: {
    statementId: string;
    selected: WaterTrustStatementCategory;
    suggested: WaterTrustStatementCategory;
  }[];
}

export const waterTrustStatementCategories: WaterTrustStatementCategory[] = [
  'support',
  'guarantee',
  'prediction'
];

export function createWaterTrustProgress(journeyStartedAt: string, startedAt: string): WaterTrustProgress {
  return {
    id: 'mission_space_of_trust_v1',
    journeyStartedAt,
    status: 'active',
    classifications: {},
    selectedResources: [],
    skippedClassification: false,
    bridgeCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function classifyWaterTrustStatement(
  progress: WaterTrustProgress,
  statementId: string,
  category: WaterTrustStatementCategory,
  updatedAt: string
): WaterTrustProgress {
  return {
    ...progress,
    classifications: { ...progress.classifications, [statementId]: category },
    skippedClassification: false,
    updatedAt
  };
}

export function toggleWaterSupportResource(
  progress: WaterTrustProgress,
  resourceId: WaterSupportResourceId,
  updatedAt: string
): WaterTrustProgress {
  const selectedResources = progress.selectedResources.includes(resourceId)
    ? progress.selectedResources.filter((candidate) => candidate !== resourceId)
    : [...progress.selectedResources, resourceId];

  return { ...progress, selectedResources, updatedAt };
}

export function selectWaterCareAction(
  progress: WaterTrustProgress,
  careAction: WaterCareActionId,
  updatedAt: string
): WaterTrustProgress {
  return { ...progress, careAction, updatedAt };
}

export function skipWaterTrustClassification(
  progress: WaterTrustProgress,
  updatedAt: string
): WaterTrustProgress {
  return {
    ...progress,
    classifications: {},
    skippedClassification: true,
    updatedAt
  };
}

export function canCompleteWaterTrust(
  progress: WaterTrustProgress,
  statements: WaterTrustStatement[]
): boolean {
  return progress.skippedClassification
    || statements.every((statement) => Boolean(progress.classifications[statement.id]));
}

export function evaluateWaterTrust(
  progress: WaterTrustProgress,
  statements: WaterTrustStatement[]
): WaterTrustEvaluation {
  const differences: WaterTrustEvaluation['differences'] = [];
  let aligned = 0;
  let classified = 0;

  for (const statement of statements) {
    const selected = progress.classifications[statement.id];
    if (!selected) continue;
    classified += 1;
    if (selected === statement.suggestedCategory) {
      aligned += 1;
    } else {
      differences.push({
        statementId: statement.id,
        selected,
        suggested: statement.suggestedCategory
      });
    }
  }

  return { total: statements.length, classified, aligned, differences };
}

export function completeWaterTrust(
  progress: WaterTrustProgress,
  statements: WaterTrustStatement[],
  completedAt: string
): WaterTrustProgress {
  if (!canCompleteWaterTrust(progress, statements)) return progress;

  return {
    ...progress,
    status: 'completed',
    bridgeCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
