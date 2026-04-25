
import { Localization, localize } from '@/localization/i18n'

const OutputProfileType = {
  BY_LAYOUT: 'ByLayout',
  BY_EXTRACTOR: 'ByExtractor',
}

const RESOURCE_OUTPUT_PROFILE_TYPE = {
  [OutputProfileType.BY_LAYOUT]: localize(Localization.LAYOUT_PROFILE),
  [OutputProfileType.BY_EXTRACTOR]: localize(Localization.EXTRACTION_FIELDS_PROFILE),
}

export {
  OutputProfileType,
  RESOURCE_OUTPUT_PROFILE_TYPE,
}
