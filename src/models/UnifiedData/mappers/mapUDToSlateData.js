
import { SLATE_ELEMENT_TYPE } from '@/containers/Slate/models'

const mapUDElementToSlateParagraph = (element) => {
  let counter = 0
  const RANGE_BETWEEN_WORDS = 2

  const increaseCounterBy = (value) => {
    counter += value
    return counter
  }

  return {
    id: element.id,
    type: SLATE_ELEMENT_TYPE.PARAGRAPH,
    children: element.wordboxes.map((wordbox) => {
      const { word: { content } } = wordbox

      return {
        text: content,
        charRange: {
          begin: !counter ? counter : increaseCounterBy(RANGE_BETWEEN_WORDS),
          end: increaseCounterBy(content.length - 1),
        },
      }
    }),
  }
}

const mapUDElementToSlateTable = (element) => ({
  id: element.id,
  type: SLATE_ELEMENT_TYPE.TABLE,
  children: Array(element.maxRow).fill().map((_, rowIndex) => {
    const rowCells = element.cells.filter((cell) => cell.coordinates.row === rowIndex)
    return mapUDCellsToSlateRow(rowCells, element.id)
  }),
})

const mapUDCellsToSlateRow = (cells, id) => ({
  type: SLATE_ELEMENT_TYPE.TABLE_ROW,
  children: cells.map((cell) => mapUDCellToSlateCell(cell, id)),
})

const mapUDCellToSlateCell = (cell, id) => ({
  tableId: id,
  type: SLATE_ELEMENT_TYPE.TABLE_CELL,
  children: [{
    text: cell.value?.content ?? '',
  }],
  attributes: {
    rowSpan: cell.coordinates.rowspan,
    colSpan: cell.coordinates.colspan,
  },
  coordinates: {
    row: cell.coordinates.row,
    column: cell.coordinates.column,
  },
})

const mapUDElementToSlateImage = (element) => ({
  type: SLATE_ELEMENT_TYPE.IMAGE,
  id: element.id,
  attributes: {
    width: element.width,
    height: element.height,
  },
  url: element.blobName,
  children: [{ text: '' }],
})

const mapUDToSlateData = (unifiedData) => unifiedData
  .map((element) => {
    if (element.maxRow) {
      return mapUDElementToSlateTable(element)
    }

    if (element.blobName) {
      return mapUDElementToSlateImage(element)
    }

    return mapUDElementToSlateParagraph(element)
  })

export {
  mapUDToSlateData,
}
