
import {
  HTCell,
  HTDataProps,
  HTMerge,
} from '@/components/HandsonTable'

const getEmptyRow = (columnsQuantity) => Array(columnsQuantity).fill(null)

const getMergeCells = (tableFieldData) => tableFieldData.cells.reduce((acc, cell) => {
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

const mapTableFieldToHandsonDataStrings = (tableFieldData, columnQuantity = 1) => {
  const [rowsQuantity, colQuantity] = tableFieldData.cells.reduce(
    ([rows, columns], cell) => [
      Math.max(rows, cell.coordinates.row + cell.coordinates.rowspan),
      Math.max(columns, cell.coordinates.column + cell.coordinates.colspan),
    ],
    [1, columnQuantity],
  )

  const emptyData = Array(rowsQuantity).fill(getEmptyRow(colQuantity))

  const data = tableFieldData.cells.reduce((acc, cell) => {
    const newRow = [...acc[cell.coordinates.row]]
    newRow[cell.coordinates.column] = cell?.value?.content ?? cell?.value
    acc.splice(cell.coordinates.row, 1, newRow)
    return acc
  }, emptyData)

  const mergeCells = getMergeCells(tableFieldData)

  return new HTDataProps(data, mergeCells)
}

const mapTableFieldToHandsonDataObjects = (tableFieldData, predefinedColumns = []) => {
  const data = []
  const mergeCells = []
  const setOfColumns = new Set(predefinedColumns)

  for (const cell of tableFieldData.cells) {
    if (!data?.[cell.coordinates.row]) {
      data[cell.coordinates.row] = {}
    }

    setOfColumns.add(cell.coordinates.column)

    const row = data[cell.coordinates.row]
    row[cell.coordinates.column] = new HTCell(
      cell.value,
      {
        confidence: cell.confidence,
        tableCoordinates: cell.tableCoordinates,
        sourceTableCoordinates: cell.sourceTableCoordinates,
        sourceBboxCoordinates: cell.sourceBboxCoordinates,
        pk: cell.pk,
      },
    )

    if (cell.coordinates.rowspan !== 1 || cell.coordinates.colspan !== 1) {
      mergeCells.push(
        new HTMerge(
          cell.coordinates.row,
          cell.coordinates.column,
          cell.coordinates.rowspan,
          cell.coordinates.colspan,
        ),
      )
    }
  }

  const columns = [...setOfColumns].sort((a, b) => a - b).map((c) => ({ data: `${c}.value` }))
  const filteredFalsyData = data.filter((d) => d)
  return new HTDataProps(filteredFalsyData, mergeCells, columns)
}

export {
  mapTableFieldToHandsonDataStrings,
  mapTableFieldToHandsonDataObjects,
}
