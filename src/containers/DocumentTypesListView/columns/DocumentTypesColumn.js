import { localize, Localization } from '@/localization/i18n'

const DocumentTypesColumnKey = {
  NAME: 'name',
  ENGINE: 'engine',
  LANGUAGE: 'language',
  CREATED_AT: 'createdAt',
  ACTIONS: 'actions',
}

const RESOURCE_DOCUMENT_TYPES_COLUMN = {
  [DocumentTypesColumnKey.NAME]: localize(Localization.NAME),
  [DocumentTypesColumnKey.CREATED_AT]: localize(Localization.CREATION_DATE),
  [DocumentTypesColumnKey.ENGINE]: localize(Localization.ENGINE),
  [DocumentTypesColumnKey.LANGUAGE]: localize(Localization.LANGUAGE),
}

export {
  DocumentTypesColumnKey,
  RESOURCE_DOCUMENT_TYPES_COLUMN,
}
