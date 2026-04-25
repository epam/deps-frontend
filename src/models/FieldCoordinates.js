
import has from 'lodash/has'
import PropTypes from 'prop-types'

class FieldCoordinates {
  constructor (page, x, y, w, h) {
    this.page = page
    this.x = +(x.toFixed(12))
    this.y = +(y.toFixed(12))
    this.w = +(w.toFixed(12))
    this.h = +(h.toFixed(12))
  }

  static isValid = (coordinates) => (
    has(coordinates, 'x') &&
    has(coordinates, 'page') &&
    has(coordinates, 'y') &&
    has(coordinates, 'w') &&
    has(coordinates, 'h')
  )
}

const fieldCoordinatesShape = PropTypes.shape({
  page: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
})

export {
  FieldCoordinates,
  fieldCoordinatesShape,
}
