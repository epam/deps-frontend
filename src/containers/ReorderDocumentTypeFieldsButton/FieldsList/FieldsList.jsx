
import PropTypes from 'prop-types'
import { useState } from 'react'
import { FieldType } from '@/enums/FieldType'
import { documentTypeExtraFieldShape } from '@/models/DocumentTypeExtraField'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { FieldCard } from '../FieldCard'
import {
  DraggableItem,
  List,
  ScrollingWrapper,
} from './FieldsList.styles'

const moveItem = (dragIndex, hoverIndex, data) => {
  const resultArr = [...data]
  const [item] = resultArr.splice(dragIndex, 1)
  resultArr.splice(hoverIndex, 0, item)
  return resultArr
}

const getFieldType = (field) => (
  field.fieldType === FieldType.LIST
    ? field.fieldMeta.baseType
    : (field.fieldType || field.type)
)

const FieldsList = ({
  fields,
  setFields,
  getFieldCategory,
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
      <List>
        {
          fields.map((field, index) => (
            <DraggableItem
              key={field.code}
              index={index}
              isDraggable={isDraggable}
              onDrop={onFieldCardDrop}
              onMove={onFieldCardMove}
            >
              <FieldCard
                category={getFieldCategory(field)}
                enableDragging={enableDragging}
                name={field.name}
                order={field.order}
                type={getFieldType(field)}
              />
            </DraggableItem>
          ))
        }
      </List>
    </ScrollingWrapper>
  )
}

FieldsList.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.oneOfType([
      documentTypeExtraFieldShape,
      documentTypeFieldShape,
    ])).isRequired,
  setFields: PropTypes.func.isRequired,
  getFieldCategory: PropTypes.func.isRequired,
}

export {
  FieldsList,
}
