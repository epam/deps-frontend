import { localize, Localization } from '@/localization/i18n'

const DocumentColumn = {
  TITLE: 'title',
  DATE: 'date',
  DOCUMENT_TYPE: 'documentType',
  STATE: 'state',
  ENGINE: 'engine',
  LABELS: 'labels',
  REVIEWER: 'reviewer',
  LANGUAGE: 'language',
  LLM_TYPE: 'llmType',
  GROUP: 'group',
}

const RESOURCE_DOCUMENT_COLUMN = {
  [DocumentColumn.TITLE]: localize(Localization.TITLE),
  [DocumentColumn.DATE]: localize(Localization.DATE),
  [DocumentColumn.DOCUMENT_TYPE]: localize(Localization.TYPE),
  [DocumentColumn.STATE]: localize(Localization.STATE),
  [DocumentColumn.ENGINE]: localize(Localization.ENGINE),
  [DocumentColumn.LABELS]: localize(Localization.LABELS),
  [DocumentColumn.REVIEWER]: localize(Localization.REVIEWER),
  [DocumentColumn.LANGUAGE]: localize(Localization.LANGUAGE),
  [DocumentColumn.LLM_TYPE]: localize(Localization.LLM_TYPE),
  [DocumentColumn.GROUP]: localize(Localization.GROUP),
}

export {
  DocumentColumn,
  RESOURCE_DOCUMENT_COLUMN,
}
