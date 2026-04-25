
import { ReviewPolicy } from '@/enums/ReviewPolicy'

export const WORKFLOW_FORM_FIELD_CODES = {
  NEEDS_EXTRACTION: 'needsExtraction',
  NEEDS_REVIEW: 'needsReview',
  NEEDS_VALIDATION: 'needsValidation',
}

export const DEFAULT_FORM_VALUES = {
  [WORKFLOW_FORM_FIELD_CODES.NEEDS_EXTRACTION]: true,
  [WORKFLOW_FORM_FIELD_CODES.NEEDS_REVIEW]: ReviewPolicy.ALWAYS_REVIEW,
  [WORKFLOW_FORM_FIELD_CODES.NEEDS_VALIDATION]: false,
}
