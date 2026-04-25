
import PropTypes from 'prop-types'

class CanvasImage {
  constructor ({
    image,
    x,
    y,
    width,
    height,
    onClick,
    onMouseEnter,
    onMouseLeave,
    offsetX,
    offsetY,
  }) {
    this.image = image
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.onClick = onClick
    this.onMouseEnter = onMouseEnter
    this.onMouseLeave = onMouseLeave
  }
}

const canvasImageShape = PropTypes.shape({
  image: PropTypes.instanceOf(HTMLImageElement).isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
})

export {
  CanvasImage,
  canvasImageShape,
}
