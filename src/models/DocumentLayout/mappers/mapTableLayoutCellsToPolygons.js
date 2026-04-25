
const mapTableLayoutCellsToPolygons = (cells, range) => {
  const { from, to } = range
  const topRow = Math.min(from.row, to.row)
  const leftCol = Math.min(from.col, to.col)
  const lastRow = Math.max(from.row, to.row)
  const lastCol = Math.max(from.col, to.col)

  const cellsInRange = cells.filter((cell) => {
    const { columnIndex, rowIndex } = cell

    return (
      columnIndex >= leftCol &&
      rowIndex >= topRow &&
      columnIndex <= lastCol &&
      rowIndex <= lastRow
    )
  })

  const [{ page }] = cellsInRange

  const coords = cellsInRange
    .filter((cell) => cell.page === page)
    .map((cell) => cell.polygon)

  return {
    coords,
    page,
  }
}

export {
  mapTableLayoutCellsToPolygons,
}
