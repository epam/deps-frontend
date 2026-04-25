
import PropTypes from 'prop-types'
import { pointShape } from '@/models/Point'
import { theme } from '@/theme/theme.default'

const DEFAULT_STROKE_WIDTH = 1

class CanvasLine {
  constructor ({
    coords,
    stroke = theme.color.red,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onWheel,
    strokeWidth = DEFAULT_STROKE_WIDTH,
    dash,
    closed,
  }) {
    this.coords = coords
    this.stroke = stroke
    this.onClick = onClick
    this.onMouseEnter = onMouseEnter
    this.onMouseLeave = onMouseLeave
    this.onWheel = onWheel
    this.onMouseMove = onMouseMove
    this.strokeWidth = strokeWidth
    this.closed = closed
    this.dash = dash
  }
}

const canvasLineShape = PropTypes.shape({
  coords: PropTypes.arrayOf(pointShape).isRequired,
  closed: PropTypes.bool,
  dash: PropTypes.arrayOf(PropTypes.number),
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
})

export {
  CanvasLine,
  canvasLineShape,
}
