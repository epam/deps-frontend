
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { Checkbox } from '@/components/Checkbox'
import { FIELD_TYPE_TO_ICON_MAPPER } from '@/containers/OutputProfileByExtractor/fieldTypeToIconMapper'
import { FieldType, RESOURCE_FIELD_TYPE } from '@/enums/FieldType'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import {
  SelectorsWrapper,
  SelectorLabel,
  StyledText,
} from './BatchFieldsSelection.styles'

const TYPES = [
  FieldType.CHECKMARK,
  FieldType.DATE,
  FieldType.DICTIONARY,
  FieldType.ENUM,
  FieldType.STRING,
  FieldType.TABLE,
]

const BatchFieldsSelection = ({
  excludeFields,
  includeFields,
  isEditMode,
  fields,
}) => {
  const getFieldsByType = useCallback((fieldType) =>
    fields.filter(({ field }) => (
      field.fieldType === FieldType.LIST
        ? field.fieldMeta.baseType === fieldType
        : field.fieldType === fieldType
    )), [fields])

  const getCheckboxProps = useCallback((type) => {
    const fields = getFieldsByType(type)
    const isEmpty = fields.length === 0

    const selectedFields = fields.filter((field) => field.isInProfile)
    const isSelected = fields.length === selectedFields.length
    const isIndeterminate = selectedFields.length > 0 && selectedFields.length < fields.length

    const fieldsCodes = fields.map(({ field }) => field.code)
    const onChange = (checked) => {
      checked ? includeFields(fieldsCodes) : excludeFields(fieldsCodes)
    }

    return {
      disabled: isEmpty,
      indeterminate: isIndeterminate,
      checked: !isEmpty && isSelected,
      onChange,
    }
  }, [
    includeFields,
    excludeFields,
    getFieldsByType,
  ])

  return (
    <SelectorsWrapper>
      {
        isEditMode && (
          Object.values(TYPES).map((type) => {
            const checkboxProps = getCheckboxProps(type)

            return (
              <SelectorLabel
                key={type}
                disabled={checkboxProps.disabled}
                id={type}
              >
                {FIELD_TYPE_TO_ICON_MAPPER[type]()}
                <StyledText>{RESOURCE_FIELD_TYPE[type]}</StyledText>
                <Checkbox {...checkboxProps} />
              </SelectorLabel>
            )
          })
        )
      }
    </SelectorsWrapper>
  )
}

BatchFieldsSelection.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  excludeFields: PropTypes.func.isRequired,
  includeFields: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      field: documentTypeFieldShape.isRequired,
      isInProfile: PropTypes.bool.isRequired,
    }).isRequired,
  ),
}

export {
  BatchFieldsSelection,
}
