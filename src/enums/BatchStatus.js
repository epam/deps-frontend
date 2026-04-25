import { localize, Localization } from '@/localization/i18n'

export const BatchStatus = {
  NEW: 'new',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REVIEW: 'review',
  FAILED: 'failed',
  ABORTED: 'aborted',
  CONSOLIDATION: 'consolidation',
  VALIDATION: 'validation',
  EXPORTING: 'exporting',
  EXPORTED: 'exported',
}

export const RESOURCE_BATCH_STATUS = {
  [BatchStatus.NEW]: localize(Localization.NEW),
  [BatchStatus.PROCESSING]: localize(Localization.PROCESSING),
  [BatchStatus.COMPLETED]: localize(Localization.COMPLETED),
  [BatchStatus.FAILED]: localize(Localization.FAILED),
  [BatchStatus.REVIEW]: localize(Localization.REVIEW),
  [BatchStatus.ABORTED]: localize(Localization.ABORTED),
  [BatchStatus.CONSOLIDATION]: localize(Localization.CONSOLIDATION),
  [BatchStatus.VALIDATION]: localize(Localization.VALIDATION),
  [BatchStatus.EXPORTING]: localize(Localization.EXPORTING),
  [BatchStatus.EXPORTED]: localize(Localization.EXPORTED),
}
