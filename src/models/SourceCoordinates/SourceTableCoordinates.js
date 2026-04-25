
import PropTypes from 'prop-types'

class SourceCellCoordinate {
  constructor (row, column) {
    this.row = row
    this.column = column
  }
}

const sourceCellCoordinateShape = PropTypes.shape({
  row: PropTypes.number.isRequired,
  column: PropTypes.number.isRequired,
})

class SourceCellRange {
  constructor (begin, end) {
    this.begin = begin
    this.end = end
  }
}

const sourceCellRangeShape = PropTypes.shape({
  begin: sourceCellCoordinateShape.isRequired,
  end: sourceCellCoordinateShape,
})

class SourceTableCoordinates {
  constructor (sourceId, cellRanges = []) {
    this.sourceId = sourceId
    this.cellRanges = cellRanges
  }

  static isOneCoordinate = (sourceCoordinates) => (
    !sourceCoordinates.length ||
    (
      sourceCoordinates.length === 1 &&
      sourceCoordinates[0].cellRanges?.length === 1
    )
  )

  static isMultiCoordinates = (sourceCoordinates) => (
    sourceCoordinates.length > 1 ||
    sourceCoordinates[0].cellRanges?.length > 1
  )
}

const sourceTableCoordinatesShape = PropTypes.shape({
  sourceId: PropTypes.string.isRequired,
  cellRanges: PropTypes.arrayOf(
    sourceCellRangeShape.isRequired,
  ).isRequired,
})

export {
  SourceCellCoordinate,
  SourceCellRange,
  SourceTableCoordinates,
  sourceTableCoordinatesShape,
}
