
import PropTypes from 'prop-types'
import { pointShape } from '@/models/Point'

class KeyValuePairElementLayout {
  constructor (content, polygon) {
    this.content = content
    this.polygon = polygon
  }
}

const keyValuePairElementLayoutShape = PropTypes.shape({
  content: PropTypes.string.isRequired,
  polygon: PropTypes.arrayOf(
    pointShape.isRequired,
  ),
})

export {
  KeyValuePairElementLayout,
  keyValuePairElementLayoutShape,
}
