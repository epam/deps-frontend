
import PropTypes from 'prop-types'
import { keyValuePairElementLayoutShape } from './KeyValuePairElementLayout'

class KeyValuePairLayout {
  constructor ({
    key,
    value,
    confidence,
    id,
  }) {
    this.id = id
    this.key = key
    this.value = value
    this.confidence = confidence
  }
}

const keyValuePairLayoutShape = PropTypes.shape({
  key: keyValuePairElementLayoutShape.isRequired,
  value: keyValuePairElementLayoutShape,
  confidence: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
})

export {
  KeyValuePairLayout,
  keyValuePairLayoutShape,
}
