
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { TEST_ID } from '@/containers/GenAIDrivenFieldModal/constants'
import {
  ErrorMessage,
  Wrapper,
  DeleteButton,
  NameInput,
  Name,
  HiddenText,
} from './NodeItem.styles'

const MIN_INPUT_WIDTH = 10
const INPUT_PADDING = 8

const NodeItem = ({
  errorMessage,
  name,
  id,
  onClick,
  isActive,
  onDelete,
  onRename,
}) => {
  const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(name)
  const [inputWidth, setInputWidth] = useState(MIN_INPUT_WIDTH)

  const textWidthRef = useRef(null)

  useEffect(() => {
    if (tempName && textWidthRef.current) {
      const calculatedWidth = textWidthRef.current.offsetWidth + INPUT_PADDING
      setInputWidth(Math.max(calculatedWidth, MIN_INPUT_WIDTH))
    }
  }, [tempName])

  const shouldShowDelete = onDelete && isDeleteButtonVisible

  const showDeleteButton = () => setIsDeleteButtonVisible(true)

  const hideDeleteButton = () => setIsDeleteButtonVisible(false)

  const handleDeleteButtonClick = (e) => {
    e.stopPropagation()
    onDelete(id)
  }

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleInputChange = (e) => {
    setTempName(e.target.value)
  }

  const handleInputBlur = () => {
    setIsEditing(false)

    const normalizedName = tempName.trim()

    if (normalizedName && normalizedName !== name) {
      onRename(id, normalizedName)
      return
    }

    setTempName(name)
  }

  return (
    <Wrapper
      $isActive={isActive}
      data-testid={TEST_ID.NODE_ITEM}
      onClick={() => onClick(id)}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={showDeleteButton}
      onMouseLeave={hideDeleteButton}
    >
      <HiddenText ref={textWidthRef}>
        {tempName || ' '}
      </HiddenText>
      {
        isEditing
          ? (
            <NameInput
              $width={`${inputWidth}px`}
              autoFocus
              onBlur={handleInputBlur}
              onChange={handleInputChange}
              onPressEnter={handleInputBlur}
              value={tempName}
            />
          )
          : <Name text={name} />
      }
      {
        !!errorMessage && (
          <ErrorMessage>
            {errorMessage}
          </ErrorMessage>
        )
      }
      {
        shouldShowDelete && (
          <DeleteButton
            data-testid={TEST_ID.DELETE_NODE_BUTTON}
            icon={<TrashIcon />}
            onClick={handleDeleteButtonClick}
          />
        )
      }
    </Wrapper>
  )
}

NodeItem.propTypes = {
  errorMessage: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
  onRename: PropTypes.func.isRequired,
}

export {
  NodeItem,
}
