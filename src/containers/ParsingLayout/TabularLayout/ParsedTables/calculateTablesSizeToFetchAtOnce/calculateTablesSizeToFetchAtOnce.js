
const MAX_CELLS = 1_500
const MAX_COLS_TO_FETCH_AT_ONCE = 20

const calculateTablesSizeToFetchAtOnce = (tables, maxCells = MAX_CELLS) => {
  const tablesToFetch = tables.reduce((acc, { id, rowCount, columnCount }) => {
    const remainingCells = maxCells - acc.totalCells
    const tableCells = Math.min(rowCount * columnCount, remainingCells)

    if (tableCells) {
      acc.totalCells += tableCells
      acc.tables.push(id)
    }

    return acc
  }, {
    tables: [],
    totalCells: 0,
  })

  const avgCellsPerTable = maxCells / tablesToFetch.tables.length
  const avgCols = Math.ceil(Math.sqrt(avgCellsPerTable))
  const colsToFetch = Math.min(avgCols, MAX_COLS_TO_FETCH_AT_ONCE)
  const rowsToFetch = Math.ceil(avgCellsPerTable / colsToFetch)

  return {
    tables: tablesToFetch.tables,
    rows: rowsToFetch,
    cols: colsToFetch,
  }
}

export {
  calculateTablesSizeToFetchAtOnce,
}
