import {
  continuousResponseConditionalNotices,
  continuousResponseMandatoryNotices,
  continuousShareConditionalNotices,
  continuousShareMandatoryNotices
} from '../content/continuousCanonicalNotice';

export function canonicalShareNotices(
  includeDates = false,
  itemCount = 0,
  includeUnlinkedNotice = false
): string[] {
  const notices: string[] = [...continuousShareMandatoryNotices];
  if (!includeDates) notices.push(continuousShareConditionalNotices.datesOmitted);
  if (itemCount === 0) notices.push(continuousShareConditionalNotices.emptyCollection);
  if (includeUnlinkedNotice) notices.push(continuousShareConditionalNotices.unlinkedRecords);
  return notices;
}

export function canonicalResponseNotices(itemCount = 0): string[] {
  const notices: string[] = [...continuousResponseMandatoryNotices];
  if (itemCount === 0) notices.push(continuousResponseConditionalNotices.emptySource);
  return notices;
}
