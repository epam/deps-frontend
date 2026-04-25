
import { HTDataProps, HTMerge } from '@/components/HandsonTable'

const createEmptyTable = (rows, columns) => {
  return Array(rows).fill(null).map(() => Array(columns).fill(null))
}

const calculateTableDimensions = (cells) => {
  let maxRow = 0
  let maxColumn = 0

  cells.forEach((cell) => {
    const [column, row] = cell.relativePosition
    const rowSpan = cell.merge?.rowSpan || 1
    const columnSpan = cell.merge?.columnSpan || 1

    maxRow = Math.max(maxRow, row + rowSpan)
    maxColumn = Math.max(maxColumn, column + columnSpan)
  })

  return [maxRow, maxColumn]
}

const mapTabularLayoutCellsToHandsonTableData = (tableData) => {
  if (!tableData || !Array.isArray(tableData)) {
    return new HTDataProps([], [])
  }

  const [rowCount, columnCount] = calculateTableDimensions(tableData)
  const data = createEmptyTable(rowCount, columnCount)
  const mergeCells = []

  const sortedCells = [...tableData].sort((a, b) => {
    const [aCol, aRow] = a.relativePosition
    const [bCol, bRow] = b.relativePosition
    if (aRow !== bRow) return aRow - bRow
    return aCol - bCol
  })

  sortedCells.forEach((cell) => {
    const [column, row] = cell.relativePosition

    data[row][column] = cell.content || ''

    if (cell.merge) {
      const { rowSpan, columnSpan } = cell.merge

      mergeCells.push(
        new HTMerge(row, column, rowSpan, columnSpan),
      )
    }
  })

  return new HTDataProps(data, mergeCells)
}

export {
  mapTabularLayoutCellsToHandsonTableData,
}
