import { localize, Localization } from '@/localization/i18n'

const DocumentState = {
  NEW: 'new',
  UNIFICATION: 'unification',
  PREPROCESSING: 'preprocessing',
  IDENTIFICATION: 'identification',
  VERSION_IDENTIFICATION: 'versionIdentification',
  IMAGE_PREPROCESSING: 'imagePreprocessing',
  PARSING: 'parsing',
  DATA_EXTRACTION: 'dataExtraction',
  POSTPROCESSING: 'postprocessing',
  VALIDATION: 'validation',
  NEEDS_REVIEW: 'needsReview',
  IN_REVIEW: 'inReview',
  EXPORTING: 'exporting',
  EXPORTED: 'exported',
  COMPLETED: 'completed',
  FAILED: 'failed',
  EXCEPTIONAL_QUEUE: 'exceptionalQueue',
  POSTPONED: 'postponed',
}

const RESOURCE_DOCUMENT_STATE = {
  [DocumentState.NEW]: localize(Localization.NEW),
  [DocumentState.UNIFICATION]: localize(Localization.UNIFICATION),
  [DocumentState.PREPROCESSING]: localize(Localization.PREPROCESSING),
  [DocumentState.IDENTIFICATION]: localize(Localization.IDENTIFICATION),
  [DocumentState.VERSION_IDENTIFICATION]: localize(Localization.VERSION_IDENTIFICATION),
  [DocumentState.IMAGE_PREPROCESSING]: localize(Localization.IMAGE_PREPROCESSING),
  [DocumentState.PARSING]: localize(Localization.PARSING),
  [DocumentState.DATA_EXTRACTION]: localize(Localization.DATA_EXTRACTION),
  [DocumentState.POSTPROCESSING]: localize(Localization.POSTPROCESSING),
  [DocumentState.VALIDATION]: localize(Localization.VALIDATION),
  [DocumentState.NEEDS_REVIEW]: localize(Localization.NEEDS_REVIEW),
  [DocumentState.IN_REVIEW]: localize(Localization.IN_REVIEW),
  [DocumentState.EXPORTING]: localize(Localization.EXPORTING),
  [DocumentState.EXPORTED]: localize(Localization.EXPORTED),
  [DocumentState.COMPLETED]: localize(Localization.READY),
  [DocumentState.FAILED]: localize(Localization.FAILED),
  [DocumentState.EXCEPTIONAL_QUEUE]: localize(Localization.EXCEPTIONAL_QUEUE),
  [DocumentState.POSTPONED]: localize(Localization.POSTPONED),
}

export {
  DocumentState,
  RESOURCE_DOCUMENT_STATE,
}
