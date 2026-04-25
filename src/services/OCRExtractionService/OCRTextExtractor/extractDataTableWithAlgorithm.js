import { Cell } from '@/models/ExtractedData'
import { getOCRTextLines } from './getOCRTextLines'
import { getRectContent } from './getRectContent'

const getOCRContentFromCellCoords = (textLines, coordinates, guidelines) => {
  const { column, row, colspan, rowspan } = coordinates
  const { xGuidelines, yGuidelines } = guidelines

  const coords = {
    xMin: xGuidelines[column],
    xMax: xGuidelines[column + colspan],
    yMin: yGuidelines[row],
    yMax: yGuidelines[row + rowspan],
  }

  return getRectContent(textLines, coords)
}

const fillCellsWithOCRContent = (textLines, markupTable, cells) => (
  cells.map((cell) => {
    const cellContent = getOCRContentFromCellCoords(
      textLines,
      cell.coordinates,
      markupTable,
    )

    return new Cell(
      cell.coordinates.row,
      cell.coordinates.column,
      cellContent.content,
      cell.coordinates.rowspan,
      cell.coordinates.colspan,
      cell.coordinates.page,
      cellContent.confidence,
      cell.tableCoordinates,
      cell.sourceTableCoordinates,
      cell.sourceBboxCoordinates,
      cell.pk,
    )
  })
)

export const extractDataTableWithAlgorithm = async ({
  engine,
  blobName,
  markupTable,
  language,
  tableData,
}) => {
  const textLines = await getOCRTextLines(language, engine, blobName)
  const parsedCells = fillCellsWithOCRContent(textLines, markupTable, tableData.cells)

  return {
    ...tableData,
    cells: parsedCells,
  }
}
