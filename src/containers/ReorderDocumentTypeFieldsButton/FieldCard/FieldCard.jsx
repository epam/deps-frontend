
import PropTypes from 'prop-types'
import { CheckboxFieldIcon } from '@/components/Icons/CheckboxFieldIcon'
import { DateFieldIcon } from '@/components/Icons/DateFieldIcon'
import { EnumFieldIcon } from '@/components/Icons/EnumField'
import { KeyValuePairFieldIcon } from '@/components/Icons/KeyValuePairFieldIcon'
import { MenuOutlinedIcon } from '@/components/Icons/MenuOutlinedIcon'
import { StringFieldIcon } from '@/components/Icons/StringFieldIcon'
import { TableFieldIcon } from '@/components/Icons/TableFieldIcon'
import { LongText } from '@/components/LongText'
import {
  DocumentTypeFieldCategory,
  RESOURCE_DOCUMENT_TYPE_FIELD_CATEGORY,
} from '@/enums/DocumentTypeFieldCategory'
import { FieldType } from '@/enums/FieldType'
import {
  ListItem,
  DragAndDropButton,
  ListItemMeta,
  FieldIndex,
} from './FieldCard.styles'

const FIELD_TYPE_TO_ICON_MAPPER = {
  [FieldType.CHECKMARK]: <CheckboxFieldIcon />,
  [FieldType.STRING]: <StringFieldIcon />,
  [FieldType.DICTIONARY]: <KeyValuePairFieldIcon />,
  [FieldType.TABLE]: <TableFieldIcon />,
  [FieldType.ENUM]: <EnumFieldIcon />,
  [FieldType.DATE]: <DateFieldIcon />,
}

const FieldCard = ({
  enableDragging,
  name,
  order,
  type,
  category,
}) => (
  <ListItem>
    {FIELD_TYPE_TO_ICON_MAPPER[type]}
    <ListItemMeta
      description={RESOURCE_DOCUMENT_TYPE_FIELD_CATEGORY[category]}
      title={<LongText text={name} />}
    />
    <FieldIndex>
      {order}
    </FieldIndex>
    <DragAndDropButton
      icon={<MenuOutlinedIcon />}
      onMouseDown={enableDragging}
    />
  </ListItem>
)

FieldCard.propTypes = {
  enableDragging: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  type: PropTypes.oneOf(
    Object.values(FieldType),
  ).isRequired,
  category: PropTypes.oneOf(
    Object.values(DocumentTypeFieldCategory),
  ).isRequired,
}

export {
  FieldCard,
}
