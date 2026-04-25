
import has from 'lodash/has'
import PropTypes from 'prop-types'

class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  static KEY = {
    X: 'x',
    Y: 'y',
  }

  static isValid = (point) => (
    has(point, Point.KEY.X) &&
    has(point, Point.KEY.Y) &&
    Object.keys(point).every((k) => Object.values(Point.KEY).includes(k))
  )
}

const pointShape = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
})

export {
  Point,
  pointShape,
}
