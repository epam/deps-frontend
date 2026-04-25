
import PropTypes from 'prop-types'
import { CheckboxFieldIcon } from '@/components/Icons/CheckboxFieldIcon'
import { KeyValuePairFieldIcon } from '@/components/Icons/KeyValuePairFieldIcon'
import { MenuOutlinedIcon } from '@/components/Icons/MenuOutlinedIcon'
import { StringFieldIcon } from '@/components/Icons/StringFieldIcon'
import { LongText } from '@/components/LongText'
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
}

export const FieldCard = ({
  enableDragging,
  name,
  order,
  type,
}) => (
  <ListItem>
    {FIELD_TYPE_TO_ICON_MAPPER[type]}
    <ListItemMeta
      title={<LongText text={name} />}
    />
    <FieldIndex>
      {order + 1}
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
}
