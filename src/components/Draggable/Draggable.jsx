
import PropTypes from 'prop-types'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { childrenShape } from '@/utils/propTypes'
import { DraggableContainer } from './Draggable.styles'

const TYPE = 'Draggable'

class DraggableItem {
  constructor (type = TYPE, renderIndex) {
    this.type = type
    this.renderIndex = renderIndex
  }
}

const Draggable = ({
  isDraggable = true,
  onMove,
  type = TYPE,
  className,
  index,
  onDrop,
  onDragEnd,
  children,
}) => {
  const ref = useRef(null)

  const [
    {
      isDragging,
      canDrag,
    },
    connectDrag,
  ] = useDrag({
    canDrag: () => {
      return !!(onMove || onDrop || onDragEnd) && isDraggable
    },
    item: new DraggableItem(type, index),
    end: (item, monitor) => {
      if (onDragEnd) {
        onDragEnd(item, monitor)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
  }, [type, index, onMove, onDrop, onDragEnd, isDraggable])

  const [, connectDrop] = useDrop({
    accept: type,
    hover: (item, monitor) => {
      if (!ref.current) {
        return
      }
      if (item.renderIndex === index) {
        return
      }
      if (monitor.isOver() && monitor.canDrop()) {
        onMove && onMove(item.renderIndex, index)
        item.renderIndex = index
      }
    },
    drop: (item) => onDrop && onDrop(item, index),
  }, [ref.current, type, index, onDrop, onMove])

  connectDrag(ref)
  connectDrop(ref)

  return (
    <DraggableContainer
      ref={ref}
      canDrag={canDrag}
      className={className}
      isDragging={isDragging}
    >
      {children}
    </DraggableContainer>
  )
}

Draggable.propTypes = {
  onMove: PropTypes.func,
  className: PropTypes.string,
  index: PropTypes.number,
  type: PropTypes.string,
  children: childrenShape.isRequired,
  onDrop: PropTypes.func,
  onDragEnd: PropTypes.func,
  isDraggable: PropTypes.bool,
}

export {
  Draggable,
}
