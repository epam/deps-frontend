
import PropTypes from 'prop-types'
import { Resizable } from 're-resizable'
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import Draggable from 'react-draggable'
import { childrenShape } from '@/utils/propTypes'
import {
  Modal,
  ModalHeader,
  ModalContent,
  DraggableGlobalStyles,
} from './DraggableModal.styles'
import { useModalResize } from './useModalResize'

const HEADER_SAFE_MARGIN = 40

const DraggableModal = ({
  children,
  isModalVisible,
  renderTrigger,
  toggleModal,
  renderHeaderContent,
  className,
  storageKey,
}) => {
  const [isModalDraggable, setIsModalDraggable] = useState(false)

  const draggleRef = useRef(null)

  const {
    isResizing,
    size,
    position,
    updatePosition,
    resizableProps,
  } = useModalResize(isModalVisible, { storageKey })

  const onDragStop = useCallback((_, data) => {
    updatePosition({
      x: data.x,
      y: data.y,
    })
  }, [updatePosition])

  const enableDraggable = useCallback(() => {
    if (!isResizing) {
      setIsModalDraggable(true)
    }
  }, [isResizing])

  const disableDraggable = useCallback(() => {
    setIsModalDraggable(false)
  }, [])

  const modalBounds = useMemo(() => {
    const { clientWidth, clientHeight } = window.document.documentElement
    return {
      left: 0,
      top: 0,
      right: clientWidth - size.width,
      bottom: clientHeight - HEADER_SAFE_MARGIN,
    }
  }, [size.width])

  const DraggableModalContent = useMemo(() => (
    <Draggable
      bounds={modalBounds}
      disabled={!isModalDraggable || isResizing}
      onStop={onDragStop}
      position={position}
    >
      <Modal
        ref={draggleRef}
        className={className}
      >
        <Resizable {...resizableProps}>
          <ModalContent>
            <ModalHeader
              $isDraggable={isModalDraggable}
              onMouseOut={disableDraggable}
              onMouseOver={enableDraggable}
            >
              {renderHeaderContent()}
            </ModalHeader>
            {children}
          </ModalContent>
        </Resizable>
      </Modal>
    </Draggable>
  ), [
    children,
    className,
    modalBounds,
    isModalDraggable,
    isResizing,
    disableDraggable,
    enableDraggable,
    renderHeaderContent,
    onDragStop,
    resizableProps,
    position,
  ])

  return (
    <>
      <DraggableGlobalStyles />
      {
        renderTrigger?.({
          disabled: isModalVisible,
          onClick: toggleModal,
        })
      }
      {
        isModalVisible && (
          createPortal(
            DraggableModalContent,
            document.body,
          )
        )
      }
    </>
  )
}

DraggableModal.propTypes = {
  children: childrenShape.isRequired,
  className: PropTypes.string,
  isModalVisible: PropTypes.bool.isRequired,
  renderTrigger: PropTypes.func,
  toggleModal: PropTypes.func,
  renderHeaderContent: PropTypes.func.isRequired,
  storageKey: PropTypes.string,
}

export {
  DraggableModal,
}
