
import PropTypes from 'prop-types'

class TableCell {
  constructor ({
    id,
    tableId,
    content,
    absolutePosition,
    relativePosition,
    dataType,
    merge,
    alignment,
    borders,
    comment,
    style,
  }) {
    this.id = id
    this.tableId = tableId
    this.content = content
    this.absolutePosition = absolutePosition
    this.relativePosition = relativePosition
    this.dataType = dataType
    this.merge = merge
    this.alignment = alignment
    this.borders = borders
    this.comment = comment
    this.style = style
  }
}

class TableCellMerge {
  constructor ({
    rowSpan,
    columnSpan,
  }) {
    this.rowSpan = rowSpan
    this.columnSpan = columnSpan
  }
}

const alignmentShape = PropTypes.shape({
  horizontal: PropTypes.string,
  vertical: PropTypes.string,
  rotation: PropTypes.number,
})

const bordersShape = PropTypes.shape({
  top: PropTypes.string,
  bottom: PropTypes.string,
  left: PropTypes.string,
  right: PropTypes.string,
})

const mergeShape = PropTypes.shape({
  rowSpan: PropTypes.number.isRequired,
  columnSpan: PropTypes.number.isRequired,
})

const commentShape = PropTypes.shape({
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
})

const styleShape = PropTypes.shape({
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  hyperlink: PropTypes.bool,
  bold: PropTypes.bool,
  italic: PropTypes.bool,
  fontName: PropTypes.string,
  fontSize: PropTypes.string,
  underlined: PropTypes.bool,
  strikethrough: PropTypes.bool,
})

const tableCellShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  tableId: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  absolutePosition: PropTypes.arrayOf(
    PropTypes.number,
  ).isRequired,
  relativePosition: PropTypes.arrayOf(
    PropTypes.number,
  ).isRequired,
  dataType: PropTypes.string,
  merge: mergeShape,
  alignment: alignmentShape,
  borders: bordersShape,
  comment: commentShape,
  style: styleShape,
})

export {
  TableCell,
  TableCellMerge,
  tableCellShape,
}
