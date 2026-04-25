
import { RadioOption } from '@/components/Radio/RadioOption'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { Extractor } from './viewModels'

export const CALIBRATION_MODE = {
  BASE: 'base',
  ADVANCED: 'advanced',
}

export const CheckmarkOption = {
  [localize(Localization.TRUE)]: true,
  [localize(Localization.FALSE)]: false,
}

export const RadioGroupOptions = Object.entries(CheckmarkOption).map(([text, val]) => (
  new RadioOption({
    value: val,
    text,
  })),
)

export const DEFAULT_EXTRACTOR = new Extractor({
  id: 'default',
  customInstruction: localize(Localization.LLM_MODEL_CUSTOM_INSTRUCTION),
  groupingFactor: ENV.FEATURE_PROMPT_CALIBRATION_STUDIO_GROUPING_FACTOR,
  model: ENV.FEATURE_PROMPT_CALIBRATION_STUDIO_MODEL,
  name: localize(Localization.DEFAULT),
  temperature: ENV.FEATURE_PROMPT_CALIBRATION_STUDIO_TEMPERATURE,
  topP: ENV.FEATURE_PROMPT_CALIBRATION_STUDIO_TOP_P,
})
