
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'

export const FIELD_FORM_CODE = {
  BATCH_NAME: 'name',
  GROUP: 'group',
  DOCUMENT_TYPE: 'documentType',
  ENGINE: 'engine',
  LLM_TYPE: 'llmType',
  PARSING_FEATURES: 'parsingFeatures',
  FILES: 'files',
}

export const FORM_SECTION_BLOCK_CODE = {
  NAME_AND_GROUP: 'name&group',
  BULK_FILES_SETTINGS: 'bulkFilesSettings',
}

export const DEFAULT_FORM_VALUES = {
  [FIELD_FORM_CODE.BATCH_NAME]: '',
  [FIELD_FORM_CODE.GROUP]: null,
  [FIELD_FORM_CODE.DOCUMENT_TYPE]: null,
  [FIELD_FORM_CODE.ENGINE]: null,
  [FIELD_FORM_CODE.LLM_TYPE]: null,
  [FIELD_FORM_CODE.PARSING_FEATURES]: [KnownParsingFeature.TEXT],
}
