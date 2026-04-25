import { localize, Localization } from '@/localization/i18n'

const ExtractionType = {
  ML: 'ml',
  TEMPLATE: 'template',
  PULLABLE_ML: 'pullable_ml',
  PLUGIN: 'plugin',
  PROTOTYPE: 'prototype',
  AI_PROMPTED: 'non',
  CUSTOM_MODEL: 'custom_model',
  AZURE_CLOUD_EXTRACTOR: 'azure_cloud_extractor',
}

const RESOURCE_EXTRACTION_TYPE = {
  [ExtractionType.ML]: localize(Localization.CUSTOM_MODEL),
  [ExtractionType.TEMPLATE]: localize(Localization.TEMPLATE),
  [ExtractionType.PULLABLE_ML]: localize(Localization.CUSTOM_MODEL),
  [ExtractionType.PLUGIN]: localize(Localization.CUSTOM_MODEL),
  [ExtractionType.PROTOTYPE]: localize(Localization.PROTOTYPE),
  [ExtractionType.AI_PROMPTED]: localize(Localization.AI_PROMPTED),
  [ExtractionType.CUSTOM_MODEL]: localize(Localization.CUSTOM_MODEL),
  [ExtractionType.AZURE_CLOUD_EXTRACTOR]: localize(Localization.AZURE_CLOUD_NATIVE_EXTRACTOR),
}

export {
  ExtractionType,
  RESOURCE_EXTRACTION_TYPE,
}
