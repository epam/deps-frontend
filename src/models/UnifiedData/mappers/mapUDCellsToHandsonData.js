
import { HTDataProps, HTMerge } from '@/components/HandsonTable'

const getEmptyRow = (columnsQuantity) => Array(columnsQuantity).fill(null)

const getMergeCells = (udCells) => udCells.reduce((acc, cell) => {
  if (cell.coordinates.rowspan !== 1 || cell.coordinates.colspan !== 1) {
    acc.push(
      new HTMerge(
        cell.coordinates.row,
        cell.coordinates.column,
        cell.coordinates.rowspan,
        cell.coordinates.colspan,
      ),
    )
  }
  return acc
}, [])

const mapUDCellsToHandsonData = (udCells, columnQuantity = 1) => {
  const [rowsQuantity, colQuantity] = udCells.reduce(
    ([rows, columns], cell) => [
      Math.max(rows, cell.coordinates.row + cell.coordinates.rowspan),
      Math.max(columns, cell.coordinates.column + cell.coordinates.colspan),
    ],
    [1, columnQuantity],
  )

  const emptyData = Array(rowsQuantity).fill(getEmptyRow(colQuantity))

  const data = udCells.reduce((acc, cell) => {
    const newRow = [...acc[cell.coordinates.row]]
    newRow[cell.coordinates.column] = cell?.value?.content ?? cell?.value
    acc.splice(cell.coordinates.row, 1, newRow)
    return acc
  }, emptyData)

  const mergeCells = getMergeCells(udCells)

  return new HTDataProps(data, mergeCells)
}

export {
  mapUDCellsToHandsonData,
}
