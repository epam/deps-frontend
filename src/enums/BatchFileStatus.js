import { localize, Localization } from '@/localization/i18n'

export const BatchFileStatus = {
  NEW: 'new',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REVIEW: 'review',
  FAILED: 'failed',
  ABORTED: 'aborted',
  EXPORTED: 'exported',
}

export const RESOURCE_BATCH_FILE_STATUS = {
  [BatchFileStatus.NEW]: localize(Localization.NEW),
  [BatchFileStatus.PROCESSING]: localize(Localization.PROCESSING),
  [BatchFileStatus.COMPLETED]: localize(Localization.COMPLETED),
  [BatchFileStatus.FAILED]: localize(Localization.FAILED),
  [BatchFileStatus.REVIEW]: localize(Localization.REVIEW),
  [BatchFileStatus.ABORTED]: localize(Localization.ABORTED),
  [BatchFileStatus.EXPORTED]: localize(Localization.EXPORTED),
}
