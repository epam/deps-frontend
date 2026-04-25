
import { HTDataProps, HTMerge } from '@/components/HandsonTable'

const getEmptyRow = (columnsQuantity) => Array(columnsQuantity).fill(null)

const getMergeCells = (cells) => cells.reduce((acc, cell) => {
  if (cell.rowSpan !== 1 || cell.columnSpan !== 1) {
    acc.push(
      new HTMerge(
        cell.rowIndex,
        cell.columnIndex,
        cell.rowSpan,
        cell.columnSpan,
      ),
    )
  }
  return acc
}, [])

const mapTableLayoutCellsToHandsonDataStrings = ({ cells, columnCount, rowCount }) => {
  const emptyData = Array(rowCount).fill(getEmptyRow(columnCount))

  const data = cells.reduce((acc, cell) => {
    const newRow = [...acc[cell.rowIndex]]
    newRow[cell.columnIndex] = cell?.content
    acc.splice(cell.rowIndex, 1, newRow)
    return acc
  }, emptyData)

  const mergeCells = getMergeCells(cells)

  return new HTDataProps(data, mergeCells)
}

export {
  mapTableLayoutCellsToHandsonDataStrings,
}
