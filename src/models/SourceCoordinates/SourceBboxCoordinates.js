
import PropTypes from 'prop-types'
import { rectCoordsShape } from '@/models/Rect'

class SourceBboxCoordinates {
  constructor (sourceId, page, bboxes = []) {
    this.sourceId = sourceId
    this.page = page
    this.bboxes = bboxes
  }

  static isOneCoordinate = (sourceCoordinates) => {
    if (!Array.isArray(sourceCoordinates)) {
      return true
    }

    return !sourceCoordinates.length ||
    (
      sourceCoordinates.length === 1 &&
      sourceCoordinates[0].bboxes?.length === 1
    )
  }

  static isMultiCoordinates = (sourceCoordinates) => (
    sourceCoordinates.length > 1 ||
    sourceCoordinates.some((coord) => coord.bboxes?.length > 1)
  )

  static areCoordinatesFromSingleSource = (sourceCoordinates) => {
    if (!Array.isArray(sourceCoordinates)) {
      return true
    }

    const id = sourceCoordinates[0].sourceId

    return sourceCoordinates.every((coord) => coord.sourceId === id)
  }
}

const sourceBboxCoordinatesShape = PropTypes.shape({
  sourceId: PropTypes.string.isRequired,
  bboxes: PropTypes.arrayOf(
    rectCoordsShape.isRequired,
  ).isRequired,
  page: PropTypes.number,
})

export {
  SourceBboxCoordinates,
  sourceBboxCoordinatesShape,
}
