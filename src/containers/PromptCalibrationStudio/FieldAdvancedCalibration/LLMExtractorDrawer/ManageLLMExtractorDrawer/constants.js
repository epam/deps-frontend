
import { Localization, localize } from '@/localization/i18n'

export const FIELDS_CODE = {
  NAME: 'name',
  MODEL: 'model',
  GROUPING_FACTOR: 'groupingFactor',
  PAGE_SPAN: 'pageSpan',
  TEMPERATURE: 'temperature',
  TOP_P: 'topP',
  CUSTOM_INSTRUCTION: 'customInstruction',
}

export const MIN_GROUPING_FACTOR_VALUE = 1
export const DEFAULT_GROUPING_FACTOR_VALUE = 5

export const MIN_TEMPERATURE_VALUE = 0
export const MAX_TEMPERATURE_VALUE = 1
export const TEMPERATURE_VALUE_STEP = 0.05
export const DEFAULT_TEMPERATURE_VALUE = 0
export const TEMPERATURE_VALUE_PRECISION = 2

export const MIN_TOP_P_VALUE = 0
export const MAX_TOP_P_VALUE = 1
export const TOP_P_VALUE_STEP = 0.05
export const DEFAULT_TOP_P_VALUE = 1
export const TOP_P_VALUE_PRECISION = 2

export const TemperatureFieldSettings = {
  min: MIN_TEMPERATURE_VALUE,
  max: MAX_TEMPERATURE_VALUE,
  step: TEMPERATURE_VALUE_STEP,
  precision: TEMPERATURE_VALUE_PRECISION,
  dots: true,
}

export const TopPFieldSettings = {
  min: MIN_TOP_P_VALUE,
  max: MAX_TOP_P_VALUE,
  step: TOP_P_VALUE_STEP,
  precision: TOP_P_VALUE_PRECISION,
  dots: true,
}

export const DefaultValues = {
  [FIELDS_CODE.NAME]: '',
  [FIELDS_CODE.MODEL]: '',
  [FIELDS_CODE.GROUPING_FACTOR]: DEFAULT_GROUPING_FACTOR_VALUE,
  [FIELDS_CODE.TEMPERATURE]: DEFAULT_TEMPERATURE_VALUE,
  [FIELDS_CODE.TOP_P]: DEFAULT_TOP_P_VALUE,
  [FIELDS_CODE.PAGE_SPAN]: null,
  [FIELDS_CODE.CUSTOM_INSTRUCTION]: localize(Localization.LLM_MODEL_CUSTOM_INSTRUCTION),
}
