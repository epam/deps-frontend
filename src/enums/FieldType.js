import { localize, Localization } from '@/localization/i18n'

const FieldType = {
  STRING: 'string',
  ENUM: 'enum',
  CHECKMARK: 'checkmark',
  LIST: 'list',
  DICTIONARY: 'dict',
  TABLE: 'table',
  DATE: 'date',
}

const RESOURCE_FIELD_TYPE = {
  [FieldType.STRING]: localize(Localization.STRING),
  [FieldType.ENUM]: localize(Localization.ENUM),
  [FieldType.CHECKMARK]: localize(Localization.CHECKMARK),
  [FieldType.LIST]: localize(Localization.LIST),
  [FieldType.DICTIONARY]: localize(Localization.KEY_VALUE_PAIR),
  [FieldType.TABLE]: localize(Localization.TABLE),
  [FieldType.DATE]: localize(Localization.DATE),
}

const RESOURCE_FIELDS_TYPES = {
  [FieldType.CHECKMARK]: localize(Localization.CHECKMARKS),
  [FieldType.STRING]: localize(Localization.STRINGS),
  [FieldType.DICTIONARY]: localize(Localization.KEY_VALUE_PAIRS),
  [FieldType.TABLE]: localize(Localization.TABLES),
  [FieldType.ENUM]: localize(Localization.ENUMS),
  [FieldType.DATE]: localize(Localization.DATES),
}

export {
  FieldType,
  RESOURCE_FIELD_TYPE,
  RESOURCE_FIELDS_TYPES,
}
