
import { Localization, localize } from '@/localization/i18n'

export const FileReferenceType = {
  BATCH: 'batch',
  DOCUMENT: 'document',
}

export const REFERENCE_TYPE_LOCALIZATION = {
  [FileReferenceType.BATCH]: localize(Localization.BATCH),
  [FileReferenceType.DOCUMENT]: localize(Localization.DOCUMENT),
}
