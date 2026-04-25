
import PropTypes from 'prop-types'
import { useState } from 'react'
import { fieldShape } from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldCard } from '../FieldCard'
import {
  DraggableItem,
  StyledList,
  ScrollingWrapper,
} from './FieldsList.styles'

const moveItem = (dragIndex, hoverIndex, data) => {
  const resultArr = [...data]
  const [item] = resultArr.splice(dragIndex, 1)
  resultArr.splice(hoverIndex, 0, item)
  return resultArr
}

export const FieldsList = ({
  fields,
  setFields,
}) => {
  const [isDraggable, setIsDraggable] = useState(false)

  const enableDragging = () => {
    setIsDraggable(true)
  }

  const onFieldCardDrop = () => {
    setIsDraggable(false)
  }

  const onFieldCardMove = (draggedIndex, hoverIndex) => {
    const reorderedFields = moveItem(draggedIndex, hoverIndex, fields)
    setFields(reorderedFields)
  }

  return (
    <ScrollingWrapper>
      <StyledList>
        {
          fields.map((field, index) => (
            <DraggableItem
              key={field.id}
              index={index}
              isDraggable={isDraggable}
              onDrop={onFieldCardDrop}
              onMove={onFieldCardMove}
            >
              <FieldCard
                enableDragging={enableDragging}
                name={field.name}
                order={field.order}
                type={field.fieldType}
              />
            </DraggableItem>
          ))
        }
      </StyledList>
    </ScrollingWrapper>
  )
}

FieldsList.propTypes = {
  fields: PropTypes.arrayOf(fieldShape).isRequired,
  setFields: PropTypes.func.isRequired,
}
