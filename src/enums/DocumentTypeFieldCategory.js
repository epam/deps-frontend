
import { Localization, localize } from '@/localization/i18n'

const DocumentTypeFieldCategory = {
  EXTRACTION: 'Extraction',
  EXTRA: 'Extra',
  GEN_AI: 'GenAi',
}

const RESOURCE_DOCUMENT_TYPE_FIELD_CATEGORY = {
  [DocumentTypeFieldCategory.EXTRACTION]: localize(Localization.EXTRACTION_FIELD),
  [DocumentTypeFieldCategory.EXTRA]: localize(Localization.EXTRA_FIELD),
  [DocumentTypeFieldCategory.GEN_AI]: localize(Localization.GEN_AI_DRIVEN_FIELD),
}

export {
  DocumentTypeFieldCategory,
  RESOURCE_DOCUMENT_TYPE_FIELD_CATEGORY,
}
