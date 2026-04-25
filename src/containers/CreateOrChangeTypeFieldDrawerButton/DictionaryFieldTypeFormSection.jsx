
import { useMemo } from 'react'
import { FormFieldType, FormItem } from '@/components/Form/ReactHookForm'
import { stringsToOptions } from '@/components/Select'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'

const SUPPORTED_FIELD_TYPES_KEY_VALUE_PAIR = [FieldType.STRING]
const FIELDS_CODE = {
  valueType: 'valueType',
  keyType: 'keyType',
}

const DictionaryFieldTypeFormSection = ({
  field,
}) => {
  const { fieldMeta } = field || {}
  const meta = fieldMeta?.baseTypeMeta || fieldMeta

  const fields = useMemo(() => ([
    {
      code: FIELDS_CODE.keyType,
      label: localize(Localization.KEY_TYPE_FIELD),
      defaultValue: meta?.keyType || FieldType.STRING,
      type: FormFieldType.ENUM,
      options: stringsToOptions(SUPPORTED_FIELD_TYPES_KEY_VALUE_PAIR),
      placeholder: localize(Localization.KEY_TYPE_FIELD_PLACEHOLDER),
    },
    {
      code: FIELDS_CODE.valueType,
      label: localize(Localization.VALUE_TYPE_FIELD),
      defaultValue: meta?.valueType || FieldType.STRING,
      type: FormFieldType.ENUM,
      options: stringsToOptions(SUPPORTED_FIELD_TYPES_KEY_VALUE_PAIR),
      placeholder: localize(Localization.VALUE_TYPE_FIELD_PLACEHOLDER),
    },
  ]), [
    meta?.keyType,
    meta?.valueType,
  ])

  return (
    fields.map(({ label, ...field }) => (
      <FormItem
        key={field.code}
        field={field}
        label={label}
      />
    ))
  )
}

DictionaryFieldTypeFormSection.propTypes = {
  field: documentTypeFieldShape,
}

export {
  DictionaryFieldTypeFormSection,
}
