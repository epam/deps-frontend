
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'
import { AlternativeArrowsIcon } from '@/components/Icons/AlternativeArrowsIcon'
import { OpenedEyeIcon } from '@/components/Icons/OpenedEyeIcon'
import { SlashedEyeIcon } from '@/components/Icons/SlashedEyeIcon'
import { FIELD_TYPE_TO_ICON_MAPPER } from '@/containers/OutputProfileByExtractor/fieldTypeToIconMapper'
import { FieldType } from '@/enums/FieldType'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import {
  DescriptionText,
  ListItem,
  ListMeta,
  IconButton,
  IconWrapper,
  DragNDropButton,
} from './ProfileFieldCard.styles'

const DESCRIPTION_MAX_ROWS = 1

const renderFieldIcon = (field) => {
  const fieldType = (
    field.fieldType === FieldType.LIST
      ? field.fieldMeta.baseType
      : field.fieldType
  )

  return FIELD_TYPE_TO_ICON_MAPPER[fieldType]()
}

const renderEyeIcon = (isInProfile) => (
  <IconWrapper isInProfile={isInProfile}>
    {isInProfile ? <OpenedEyeIcon /> : <SlashedEyeIcon />}
  </IconWrapper>
)

const ProfileFieldCard = ({
  className,
  disabled,
  enableDragging,
  field,
  isInProfile,
  onFieldToggle,
}) => (
  <ListItem className={className}>
    {renderFieldIcon(field)}
    <ListMeta
      title={
        (
          <DescriptionText
            rows={DESCRIPTION_MAX_ROWS}
            tooltip={true}
          >
            {field.name}
          </DescriptionText>
        )
      }
    />
    {
      enableDragging && !disabled && (
        <DragNDropButton
          disabled={disabled}
          icon={<AlternativeArrowsIcon />}
          onMouseDown={enableDragging}
        />
      )
    }
    <IconButton
      disabled={disabled}
      icon={renderEyeIcon(isInProfile)}
      onClick={() => onFieldToggle(field.code)}
    />
  </ListItem>
)

ProfileFieldCard.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  enableDragging: PropTypes.func,
  field: documentTypeFieldShape.isRequired,
  isInProfile: PropTypes.bool.isRequired,
  onFieldToggle: isRequiredIf(
    PropTypes.func,
    (props) => !props.disabled,
  ),
}

export {
  ProfileFieldCard,
}
