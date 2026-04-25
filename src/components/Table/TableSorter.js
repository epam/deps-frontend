
class TableSorter {
  constructor ({
    order,
    field,
    columnKey,
  } = {}) {
    this.order = order
    this.field = field
    this.columnKey = columnKey
  }
}

const TableSortDirection = {
  ASCEND: 'ascend',
  DESCEND: 'descend',
}

export {
  TableSorter,
  TableSortDirection,
}
