
import { DocumentState } from '@/enums/DocumentState'
import { Localization, localize } from '@/localization/i18n'

const DocumentStatisticState = {
  IN_PROCESSING: 'inProcessing',
  NEEDS_REVIEW: 'needsReview',
  IN_REVIEW: 'inReview',
  COMPLETED: 'completed',
  FAILED: 'failed',
}

const RESOURCE_DOCUMENT_STATISTIC_STATE = {
  [DocumentStatisticState.IN_PROCESSING]: localize(Localization.IN_PROCESSING),
  [DocumentStatisticState.NEEDS_REVIEW]: localize(Localization.NEEDS_REVIEW),
  [DocumentStatisticState.IN_REVIEW]: localize(Localization.IN_REVIEW),
  [DocumentStatisticState.COMPLETED]: localize(Localization.COMPLETED),
  [DocumentStatisticState.FAILED]: localize(Localization.FAILED_TEXT),
}

const DOCUMENT_STATISTIC_STATE_TO_DOCUMENT_STATE = {
  [DocumentStatisticState.IN_PROCESSING]: [
    DocumentState.NEW,
    DocumentState.UNIFICATION,
    DocumentState.PREPROCESSING,
    DocumentState.IDENTIFICATION,
    DocumentState.VERSION_IDENTIFICATION,
    DocumentState.IMAGE_PREPROCESSING,
    DocumentState.PARSING,
    DocumentState.DATA_EXTRACTION,
    DocumentState.POSTPROCESSING,
    DocumentState.VALIDATION,
    DocumentState.EXPORTING,
  ],
  [DocumentStatisticState.NEEDS_REVIEW]: [DocumentState.NEEDS_REVIEW],
  [DocumentStatisticState.IN_REVIEW]: [DocumentState.IN_REVIEW],
  [DocumentStatisticState.COMPLETED]: [
    DocumentState.COMPLETED,
    DocumentState.EXPORTED,
  ],
  [DocumentStatisticState.FAILED]: [
    DocumentState.FAILED,
    DocumentState.EXCEPTIONAL_QUEUE,
    DocumentState.POSTPONED,
  ],
}

export {
  DocumentStatisticState,
  RESOURCE_DOCUMENT_STATISTIC_STATE,
  DOCUMENT_STATISTIC_STATE_TO_DOCUMENT_STATE,
}
