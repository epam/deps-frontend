
import PropTypes from 'prop-types'
import { useState } from 'react'
import isRequiredIf from 'react-proptype-conditional-require'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { ProfileFieldCard } from '../ProfileFieldCard'
import {
  DraggableItem,
  List,
  ScrollingWrapper,
} from './FieldsList.styles'

const moveItem = (prevIndex, newIndex, array) => {
  const arrayCopy = [...array]
  const [item] = arrayCopy.splice(prevIndex, 1)
  arrayCopy.splice(newIndex, 0, item)
  return arrayCopy
}

const FieldsList = ({
  fields,
  isEditMode,
  onFieldToggle,
  profileFields,
  setProfileFields,
}) => {
  const [isDraggable, setIsDraggable] = useState(false)

  const enableDragging = () => {
    setIsDraggable(true)
  }

  const onFieldCardDrop = () => {
    setIsDraggable(false)
  }

  const onFieldCardMove = (draggedIndex, hoverIndex) => {
    const updatedProfileFields = moveItem(draggedIndex, hoverIndex, profileFields)
    setProfileFields(updatedProfileFields)
  }

  return (
    <ScrollingWrapper>
      <List>
        {
          fields.map(({ field, isInProfile }, index) => {
            return isInProfile && profileFields.length > 1 ? (
              <DraggableItem
                key={field.code}
                index={index}
                isDraggable={isDraggable}
                onDrop={onFieldCardDrop}
                onMove={onFieldCardMove}
              >
                <ProfileFieldCard
                  disabled={!isEditMode}
                  enableDragging={enableDragging}
                  field={field}
                  isInProfile={isInProfile}
                  onFieldToggle={onFieldToggle}
                />
              </DraggableItem>
            ) : (
              <ProfileFieldCard
                key={field.code}
                disabled={!isEditMode}
                field={field}
                isInProfile={isInProfile}
                onFieldToggle={onFieldToggle}
              />
            )
          })
        }
      </List>
    </ScrollingWrapper>
  )
}

FieldsList.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({
    field: documentTypeFieldShape.isRequired,
    isInProfile: PropTypes.bool.isRequired,
  })).isRequired,
  isEditMode: PropTypes.bool,
  onFieldToggle: PropTypes.func.isRequired,
  profileFields: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  setProfileFields: isRequiredIf(
    PropTypes.func,
    (props) => !!props.isEditMode,
  ),
}

export {
  FieldsList,
}
