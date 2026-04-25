
import { Localization, localize } from '@/localization/i18n'

export const ExtractorSettings = {
  MODEL: 'model',
  TEMPERATURE: 'temperature',
  GROUPING_FACTOR: 'groupingFactor',
  PAGE_SPAN: 'pageSpan',
  TOP_P: 'topP',
  CUSTOM_INSTRUCTION: 'customInstruction',
}

export const EXTRACTOR_SETTINGS_TO_LABEL = {
  [ExtractorSettings.MODEL]: localize(Localization.LLM_MODEL),
  [ExtractorSettings.TEMPERATURE]: localize(Localization.TEMPERATURE),
  [ExtractorSettings.GROUPING_FACTOR]: localize(Localization.GROUPING_FACTOR),
  [ExtractorSettings.PAGE_SPAN]: localize(Localization.PAGE_SPAN),
  [ExtractorSettings.TOP_P]: localize(Localization.TOP_P),
  [ExtractorSettings.CUSTOM_INSTRUCTION]: localize(Localization.CUSTOM_INSTRUCTION),
}
