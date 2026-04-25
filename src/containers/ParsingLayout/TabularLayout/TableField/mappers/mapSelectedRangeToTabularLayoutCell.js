
const mapSelectedRangeToTabularLayoutCell = (cells, range) => {
  const { from, to } = range
  const topRow = Math.min(from.row, to.row)
  const leftCol = Math.min(from.col, to.col)
  const lastRow = Math.max(from.row, to.row)
  const lastCol = Math.max(from.col, to.col)

  const cellsInRange = cells.filter((cell) => {
    const [columnIndex, rowIndex] = cell.relativePosition

    return (
      columnIndex >= leftCol &&
      rowIndex >= topRow &&
      columnIndex <= lastCol &&
      rowIndex <= lastRow
    )
  })

  return cellsInRange.map((cell) => cell.absolutePosition)
}

export {
  mapSelectedRangeToTabularLayoutCell,
}
