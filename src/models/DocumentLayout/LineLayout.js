
import PropTypes from 'prop-types'
import { pointShape } from '@/models/Point'

class LineLayout {
  constructor ({
    order,
    content,
    confidence,
    polygon,
  }) {
    this.order = order
    this.content = content
    this.confidence = confidence
    this.polygon = polygon
  }
}

const lineLayoutShape = PropTypes.shape({
  order: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  polygon: PropTypes.arrayOf(
    pointShape.isRequired,
  ),
  confidence: PropTypes.number,
})

export {
  LineLayout,
  lineLayoutShape,
}
