
import { FieldType } from '@/enums/FieldType'
import { MULTIPLICITY } from '../viewModels'

export const FIELD_FORM_CODE = {
  NAME: 'name',
  FIELD_TYPE: 'fieldType',
  MULTIPLICITY: 'multiplicity',
  ALIASES: 'aliases',
  READ_ONLY: 'readOnly',
  CONFIDENTIAL: 'confidential',
  DISPLAY_CHAR_LIMIT: 'displayCharLimit',
  REQUIRED: 'required',
}

export const DefaultFormValues = {
  [FIELD_FORM_CODE.NAME]: '',
  [FIELD_FORM_CODE.FIELD_TYPE]: FieldType.STRING,
  [FIELD_FORM_CODE.MULTIPLICITY]: MULTIPLICITY.SINGLE,
  [FIELD_FORM_CODE.ALIASES]: false,
  [FIELD_FORM_CODE.READ_ONLY]: false,
  [FIELD_FORM_CODE.CONFIDENTIAL]: false,
  [FIELD_FORM_CODE.DISPLAY_CHAR_LIMIT]: 10,
  [FIELD_FORM_CODE.REQUIRED]: false,
}
