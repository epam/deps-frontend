
import PropTypes from 'prop-types'

const dateJsShape = PropTypes.shape({
  $D: PropTypes.number,
  $H: PropTypes.number,
  $L: PropTypes.string,
  $M: PropTypes.number,
  $W: PropTypes.number,
  $y: PropTypes.number,
})

export { dateJsShape }
