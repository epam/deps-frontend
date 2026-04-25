import { Localization, localize } from '@/localization/i18n'

const KnownParsingFeature = {
  IMAGES: 'images',
  KEY_VALUE_PAIRS: 'kvps',
  TABLES: 'tables',
  TEXT: 'text',
}

const RESOURCE_PARSING_FEATURE = {
  [KnownParsingFeature.IMAGES]: localize(Localization.IMAGES),
  [KnownParsingFeature.KEY_VALUE_PAIRS]: localize(Localization.KEY_VALUE_PAIRS),
  [KnownParsingFeature.TABLES]: localize(Localization.TABLES),
  [KnownParsingFeature.TEXT]: localize(Localization.TEXT),
}

export {
  KnownParsingFeature,
  RESOURCE_PARSING_FEATURE,
}
