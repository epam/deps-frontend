
import PropTypes from 'prop-types'

class SourceCharRange {
  constructor (begin, end) {
    this.begin = begin
    this.end = end
  }
}

class SourceTextCoordinates {
  constructor (sourceId, charRanges) {
    this.sourceId = sourceId
    this.charRanges = charRanges
  }

  static isOneCoordinate = (sourceCoordinates) => (
    sourceCoordinates.length <= 1
  )

  static isMultiCoordinates = (sourceCoordinates) => (
    sourceCoordinates.length > 1
  )

  static isInRange = (range1, range2) => {
    const { begin: begin1, end: end1 } = range1
    const { begin: begin2, end: end2 } = range2

    return begin1 <= begin2 && end1 >= end2
  }
}

const sourceCharRangeShape = PropTypes.shape({
  begin: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
})

const sourceTextCoordinatesShape = PropTypes.shape({
  sourceId: PropTypes.string.isRequired,
  charRanges: PropTypes.arrayOf(sourceCharRangeShape).isRequired,
})

export {
  SourceTextCoordinates,
  SourceCharRange,
  sourceTextCoordinatesShape,
  sourceCharRangeShape,
}
