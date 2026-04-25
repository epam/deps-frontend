
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { FormItem } from '@/components/Form/ReactHookForm'
import { RequiredValidator } from '@/components/Form/Validators'
import { TagsInput } from '@/components/TagsInput'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { DictionaryFieldTypeFormSection } from './DictionaryFieldTypeFormSection'

const BASE_TYPE_ENUM_FIELD_CODE = 'baseEnum'

const ListFieldTypeFormSection = ({
  field,
  baseType,
}) => {
  const baseTypeEnumField = useMemo(() => [
    {
      code: BASE_TYPE_ENUM_FIELD_CODE,
      label: localize(Localization.ENUM),
      defaultValue: field?.fieldMeta?.baseTypeMeta?.values,
      rules: {
        ...new RequiredValidator(),
      },
      render: (props) => (
        <TagsInput
          placeholder={localize(Localization.BASE_ENUM_PLACEHOLDER)}
          {...props}
        />
      ),
    },
  ], [field?.fieldMeta?.baseTypeMeta?.values])

  const fields = useMemo(() => ([
    ...(baseType === FieldType.ENUM ? baseTypeEnumField : []),
  ]), [
    baseType,
    baseTypeEnumField,
  ])

  return (
    <>
      {
        fields.map(({ label, ...field }) => (
          <FormItem
            key={field.code}
            field={field}
            label={label}
          />
        ))
      }
      {
        baseType === FieldType.DICTIONARY && (
          <DictionaryFieldTypeFormSection field={field} />
        )
      }
    </>
  )
}

ListFieldTypeFormSection.propTypes = {
  field: documentTypeFieldShape,
  baseType: PropTypes.string,
}

export {
  ListFieldTypeFormSection,
}
