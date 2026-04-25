
import PropTypes from 'prop-types'

class MergedTableInfo {
  constructor ({
    pageNumber,
    tableId,
  }) {
    this.pageNumber = pageNumber
    this.tableId = tableId
  }
}

const mergedTableInfoShape = PropTypes.shape({
  pageNumber: PropTypes.number.isRequired,
  tableId: PropTypes.string.isRequired,
})

class MergedTables {
  constructor ({
    parsingType,
    tables,
  }) {
    this.parsingType = parsingType
    this.tables = tables
  }
}

const mergedTablesShape = PropTypes.shape({
  parsingType: PropTypes.string.isRequired,
  tables: PropTypes.arrayOf(mergedTableInfoShape).isRequired,
})

export {
  MergedTables,
  MergedTableInfo,
  mergedTablesShape,
}
