
import PropTypes from 'prop-types'
import { CheckboxFieldIcon } from '@/components/Icons/CheckboxFieldIcon'
import { DateFieldIcon } from '@/components/Icons/DateFieldIcon'
import { EnumFieldIcon } from '@/components/Icons/EnumField'
import { KeyValuePairFieldIcon } from '@/components/Icons/KeyValuePairFieldIcon'
import { StringFieldIcon } from '@/components/Icons/StringFieldIcon'
import { TableFieldIcon } from '@/components/Icons/TableFieldIcon'
import {
  FieldType,
  RESOURCE_FIELD_TYPE,
  RESOURCE_FIELDS_TYPES,
} from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { fieldMetaShape } from '@/models/DocumentTypeFieldMeta'
import {
  FieldTypeIcon,
  FieldTypeTitle,
} from './FieldTypeCell.styles'

const FIELD_TYPE_TO_ICON = {
  [FieldType.CHECKMARK]: <CheckboxFieldIcon />,
  [FieldType.STRING]: <StringFieldIcon />,
  [FieldType.DICTIONARY]: <KeyValuePairFieldIcon />,
  [FieldType.TABLE]: <TableFieldIcon />,
  [FieldType.ENUM]: <EnumFieldIcon />,
  [FieldType.DATE]: <DateFieldIcon />,
}

const FieldTypeCell = ({
  fieldType,
  fieldMeta,
}) => {
  const renderContent = () => {
    if (fieldType === FieldType.LIST) {
      const value = RESOURCE_FIELDS_TYPES[fieldMeta.baseType]
      return (
        <>
          <FieldTypeIcon>
            {FIELD_TYPE_TO_ICON[fieldMeta.baseType]}
          </FieldTypeIcon>
          {localize(Localization.LIST_OF, { value })}
        </>
      )
    }

    return (
      <FieldTypeTitle>
        <FieldTypeIcon>
          {FIELD_TYPE_TO_ICON[fieldType]}
        </FieldTypeIcon>
        {RESOURCE_FIELD_TYPE[fieldType] || RESOURCE_FIELD_TYPE[FieldType.STRING]}
      </FieldTypeTitle>
    )
  }

  return (
    <FieldTypeTitle>
      {renderContent()}
    </FieldTypeTitle>
  )
}

FieldTypeCell.propTypes = {
  fieldType: PropTypes.oneOf(
    Object.values(FieldType),
  ).isRequired,
  fieldMeta: fieldMetaShape,
}

export {
  FieldTypeCell,
}
