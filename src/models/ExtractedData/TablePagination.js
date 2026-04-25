
import PropTypes from 'prop-types'

const defaultChunkSize = 15

class TablePagination {
  constructor ({ listIndex, rowsChunk, rowsPerChunk }) {
    listIndex !== null && (this.listIndex = listIndex)
    rowsChunk && (this.rowsChunk = rowsChunk)
    rowsPerChunk && (this.rowsPerChunk = rowsPerChunk)
  }
}

const tablePaginationShape = PropTypes.shape({
  listIndex: PropTypes.number,
  rowsChunk: PropTypes.number,
  rowsPerChunk: PropTypes.number,
})

export {
  TablePagination,
  tablePaginationShape,
  defaultChunkSize,
}
