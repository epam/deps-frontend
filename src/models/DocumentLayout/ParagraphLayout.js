
import PropTypes from 'prop-types'
import { pointShape } from '@/models/Point'
import { lineLayoutShape } from './LineLayout'

class ParagraphLayout {
  constructor ({
    id,
    order,
    content,
    confidence,
    role,
    polygon,
    lines,
  }) {
    this.id = id
    this.order = order
    this.content = content
    this.confidence = confidence
    this.role = role
    this.polygon = polygon
    this.lines = lines
  }
}

const paragraphLayoutShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  polygon: PropTypes.arrayOf(
    pointShape.isRequired,
  ),
  lines: PropTypes.arrayOf(
    lineLayoutShape.isRequired,
  ),
  confidence: PropTypes.number,
  role: PropTypes.string,
})

export {
  ParagraphLayout,
  paragraphLayoutShape,
}
