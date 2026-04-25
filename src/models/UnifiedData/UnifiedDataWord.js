
import PropTypes from 'prop-types'
import { Rect, rectCoordsShape } from '@/models/Rect'

class UnifiedDataWordContent {
  constructor (content, confidence) {
    this.content = content
    this.confidence = confidence
  }
}

const unifiedDataWordContentShape = PropTypes.shape({
  content: PropTypes.string.isRequired,
  confidence: PropTypes.number.isRequired,
})

class UnifiedDataWord {
  constructor ({ content, confidence, x, y, w, h }) {
    if (!x || !y || !w || !h) {
      this.bbox = null
    } else {
      this.bbox = new Rect(x, y, w, h)
    }
    this.word = new UnifiedDataWordContent(content, confidence)
  }
}

const unifiedDataWordShape = PropTypes.shape({
  bbox: rectCoordsShape,
  word: unifiedDataWordContentShape.isRequired,
})

export {
  UnifiedDataWord,
  unifiedDataWordShape,
}
