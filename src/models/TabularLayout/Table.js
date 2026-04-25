
import PropTypes from 'prop-types'
import { tableCellShape } from './TableCell'

class Table {
  constructor ({
    data,
    schema,
  }) {
    this.data = data
    this.schema = schema
  }
}

class TableSchema {
  constructor ({
    id,
    sheetId,
    rowCount,
    columnCount,
    placement,
  }) {
    this.id = id
    this.sheetId = sheetId
    this.rowCount = rowCount
    this.columnCount = columnCount
    this.placement = placement
  }
}

class TableCoordinate {
  constructor ({
    row,
    column,
  }) {
    this.row = row
    this.column = column
  }
}

const tableCoordinatesShape = PropTypes.shape({
  column: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
})

const tableSchemaShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  sheetId: PropTypes.string.isRequired,
  columnCount: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  placement: PropTypes.arrayOf(
    tableCoordinatesShape,
  ).isRequired,
})

const tableDataShape = PropTypes.arrayOf(
  tableCellShape.isRequired,
)

export {
  Table,
  TableSchema,
  TableCoordinate,
  tableDataShape,
  tableSchemaShape,
}
