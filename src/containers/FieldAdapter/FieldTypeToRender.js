
import { FieldType } from '@/enums/FieldType'
import { CheckmarkEdField } from './CheckmarkEdField'
import { DateEdField } from './DateEdField'
import { EnumEdField } from './EnumEdField'
import { KeyValuePairEdField } from './KeyValuePairEdField/KeyValuePairEdField'
import { ListEdField } from './ListEdField'
import { StringEdField } from './StringEdField'
import { TableEdField } from './TableEdField/TableEdField'

const FieldTypeToRender = {
  [FieldType.ENUM]: EnumEdField,
  [FieldType.CHECKMARK]: CheckmarkEdField,
  [FieldType.STRING]: StringEdField,
  [FieldType.DICTIONARY]: KeyValuePairEdField,
  [FieldType.LIST]: ListEdField,
  [FieldType.TABLE]: TableEdField,
  [FieldType.DATE]: DateEdField,
}

const mapFieldTypeToRender = (fieldType) => FieldTypeToRender[fieldType] ?? StringEdField

export {
  mapFieldTypeToRender,
}
