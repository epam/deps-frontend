
import PropTypes from 'prop-types'
import { pointShape } from '@/models/Point'
import { tableCellLayoutShape } from './TableCellLayout'

class TableLayout {
  constructor ({
    id,
    order,
    cells,
    confidence,
    columnCount,
    rowCount,
    polygon,
  }) {
    this.id = id
    this.order = order
    this.cells = cells
    this.confidence = confidence
    this.columnCount = columnCount
    this.rowCount = rowCount
    this.polygon = polygon
  }
}

const tableLayoutShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  cells: PropTypes.arrayOf(
    tableCellLayoutShape.isRequired,
  ),
  columnCount: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  polygon: PropTypes.arrayOf(
    pointShape.isRequired,
  ),
  confidence: PropTypes.number,
})

export {
  TableLayout,
  tableLayoutShape,
}
