
import has from 'lodash/has'
import PropTypes from 'prop-types'

class Rect {
  constructor (x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  static isValid = (coordinates) => (
    has(coordinates, 'x') &&
    has(coordinates, 'y') &&
    has(coordinates, 'w') &&
    has(coordinates, 'h')
  )
}

const rectCoordsShape = PropTypes.shape({
  h: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  w: PropTypes.number.isRequired,
})

export {
  Rect,
  rectCoordsShape,
}
