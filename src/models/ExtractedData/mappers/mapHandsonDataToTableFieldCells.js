
import { Cell } from '@/models/ExtractedData'

const mapHandsonDataStringsToTableFieldCells = (tableData, mergedCells, page) => {
  const cells = []

  tableData.forEach((row, rowIdx) => {
    row.forEach((value, columnIdx) => {
      if (value === null) {
        return
      }
      const merge = mergedCells.find((m) => m.row === rowIdx && m.col === columnIdx)
      const rowspan = merge?.rowspan ?? 1
      const colspan = merge?.colspan ?? 1
      cells.push(
        {
          ...new Cell(
            rowIdx,
            columnIdx,
            value,
            rowspan,
            colspan,
            page,
          ),
        },
      )
    })
  })

  return cells
}

const mapHandsonDataObjectsToTableFieldCells = (tableData, mergedCells, page) => {
  const cells = []
  tableData.forEach((row, rowIdx) => {
    for (const [column, cell] of Object.entries(row)) {
      const merge = mergedCells.find((m) => m.row === rowIdx && m.col === +column)
      const rowspan = merge?.rowspan ?? 1
      const colspan = merge?.colspan ?? 1
      const confidence = cell.meta.confidence
      const tableCoordinates = cell.meta.tableCoordinates
      const sourceTableCoordinates = cell.meta.sourceTableCoordinates
      const sourceBboxCoordinates = cell.meta.sourceBboxCoordinates
      const value = cell.value
      const pk = cell.meta.pk
      cells.push(
        {
          ...new Cell(
            rowIdx,
            +column,
            value,
            rowspan,
            colspan,
            page,
            confidence,
            tableCoordinates,
            sourceTableCoordinates,
            sourceBboxCoordinates,
            pk,
          ),
        },
      )
    }
  })

  return cells
}

export {
  mapHandsonDataStringsToTableFieldCells,
  mapHandsonDataObjectsToTableFieldCells,
}
