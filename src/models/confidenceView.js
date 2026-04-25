
import PropTypes from 'prop-types'

const confidenceViewShape = PropTypes.shape({
  [PropTypes.string]: PropTypes.shape({
    all: PropTypes.bool,
    low: PropTypes.bool,
    medium: PropTypes.bool,
    high: PropTypes.bool,
    notApplicable: PropTypes.bool,
  }),
})

export { confidenceViewShape }
