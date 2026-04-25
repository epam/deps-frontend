
import PropTypes from 'prop-types'

class GenAiField {
  constructor ({
    key,
    value,
    id,
  }) {
    this.key = key
    this.value = value
    this.id = id
  }
}

const genAiFieldShape = PropTypes.shape({
  key: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string.isRequired,
})

export {
  GenAiField,
  genAiFieldShape,
}
