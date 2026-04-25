
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { ReviewPolicy } from '@/enums/ReviewPolicy'

export const DRAWER_WIDTH_DEFAULT = '60%'

export const FIELD_FORM_CODE = {
  ENGINE: 'engine',
  PARSING_FEATURES: 'parsingFeatures',
  FILES: 'files',
  LABELS: 'labels',
  DOCUMENT_TYPE: 'documentType',
  LLM_TYPE: 'llmType',
  NEEDS_EXTRACTION: 'needsExtraction',
  ASSIGNED_TO_ME: 'assignedToMe',
  GROUP: 'group',
  SHOULD_CLASSIFY: 'shouldClassify',
  NEEDS_REVIEW: 'needsReview',
  NEEDS_VALIDATION: 'needsValidation',
}

export const TEST_IDS = {
  PARSING_FEATURES_INFO_ICON: 'parsing-features-info-icon',
  WORKFLOW_CONFIG_INFO_ICON: 'workflow-config-info-icon',
}

export const DefaultFormValues = {
  [FIELD_FORM_CODE.ENGINE]: null,
  [FIELD_FORM_CODE.PARSING_FEATURES]: [KnownParsingFeature.TEXT],
  [FIELD_FORM_CODE.LABELS]: [],
  [FIELD_FORM_CODE.DOCUMENT_TYPE]: null,
  [FIELD_FORM_CODE.LLM_TYPE]: null,
  [FIELD_FORM_CODE.ASSIGNED_TO_ME]: true,
  [FIELD_FORM_CODE.NEEDS_EXTRACTION]: true,
  [FIELD_FORM_CODE.GROUP]: null,
  [FIELD_FORM_CODE.SHOULD_CLASSIFY]: false,
  [FIELD_FORM_CODE.NEEDS_REVIEW]: ReviewPolicy.ALWAYS_REVIEW,
  [FIELD_FORM_CODE.NEEDS_VALIDATION]: false,
}
