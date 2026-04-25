
import PropTypes from 'prop-types'
import { pointShape } from '@/models/Point'

class TableCellLayout {
  constructor ({
    content,
    kind,
    columnIndex,
    columnSpan,
    rowIndex,
    rowSpan,
    polygon,
    page,
    initialPosition,
  }) {
    this.content = content
    this.kind = kind
    this.columnIndex = columnIndex
    this.columnSpan = columnSpan
    this.rowIndex = rowIndex
    this.rowSpan = rowSpan
    this.polygon = polygon
    page && (this.page = page)
    initialPosition && (this.initialPosition = initialPosition)
  }

  static unmergeCells = (cells) => cells.flatMap((cell) => {
    const {
      content,
      rowIndex,
      columnIndex,
      rowSpan = 1,
      columnSpan = 1,
      ...rest
    } = cell

    return Array.from({ length: rowSpan * columnSpan }, (_, i) => {
      const rowOffset = Math.floor(i / columnSpan)
      const colOffset = i % columnSpan
      const isTopLeft = rowOffset === 0 && colOffset === 0

      return {
        ...rest,
        content: isTopLeft ? content : '',
        rowIndex: rowIndex + rowOffset,
        columnIndex: columnIndex + colOffset,
        rowSpan: 1,
        columnSpan: 1,
      }
    })
  })
}

const tableCellLayoutShape = PropTypes.shape({
  content: PropTypes.string.isRequired,
  columnIndex: PropTypes.number.isRequired,
  columnSpan: PropTypes.number.isRequired,
  page: PropTypes.number,
  rowIndex: PropTypes.number.isRequired,
  initialPosition: PropTypes.shape({
    pageId: PropTypes.string.isRequired,
    columnIndex: PropTypes.number.isRequired,
    rowIndex: PropTypes.number.isRequired,
    tableId: PropTypes.string.isRequired,
  }),
  rowSpan: PropTypes.number.isRequired,
  polygon: PropTypes.arrayOf(
    pointShape.isRequired,
  ),
  kind: PropTypes.string,
})

export {
  TableCellLayout,
  tableCellLayoutShape,
}
