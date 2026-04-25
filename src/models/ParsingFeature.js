
import PropTypes from 'prop-types'

class ParsingFeature {
  constructor (code, name) {
    this.name = name
    this.code = code
  }
}

const parsingFeatureShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
})

export {
  ParsingFeature,
  parsingFeatureShape,
}
