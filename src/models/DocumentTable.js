
import PropTypes from 'prop-types'
class DocumentTable {
  static getCellCoordinatesByRange = (sourceData, range) => {
    const { from, to } = range
    const topRow = Math.min(from.row, to.row)
    const leftCol = Math.min(from.col, to.col)
    const lastRow = Math.max(from.row, to.row)
    const lastCol = Math.max(from.col, to.col)

    return sourceData.cells.filter((cell) => {
      const { column, row } = cell.coordinates
      return column >= leftCol && row >= topRow && column <= lastCol && row <= lastRow
    }).map(({ coordinates }) => [coordinates.row, coordinates.column])
  }
}

const cellShape = PropTypes.shape({
  coordinates: PropTypes.shape({
    row: PropTypes.number.isRequired,
    column: PropTypes.number.isRequired,
    rowspan: PropTypes.number.isRequired,
    colspan: PropTypes.number.isRequired,
  }),
  value: PropTypes.shape({
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    confidence: PropTypes.number.isRequired,
  }),
})

const documentTableShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      y: PropTypes.number.isRequired,
    }),
  ).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
    }),
  ).isRequired,
  cells: PropTypes.arrayOf(cellShape).isRequired,
  coordinates: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    w: PropTypes.number,
    h: PropTypes.number,
    page: PropTypes.number,
  }),
})

export {
  DocumentTable,
  documentTableShape,
}
