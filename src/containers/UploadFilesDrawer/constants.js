
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'

export const DRAWER_WIDTH_DEFAULT = '60%'

export const FIELD_FORM_CODE = {
  ENGINE: 'engine',
  PARSING_FEATURES: 'parsingFeatures',
  FILES: 'files',
  LABELS: 'labels',
}

export const DefaultFormValues = {
  [FIELD_FORM_CODE.LABELS]: [],
  [FIELD_FORM_CODE.PARSING_FEATURES]: [KnownParsingFeature.TEXT],
  [FIELD_FORM_CODE.ENGINE]: null,
}
