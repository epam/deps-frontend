
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'
import { NOT_APPLICABLE_CONFIDENCE_LEVEL } from '@/constants/confidence'
import { Rect, rectCoordsShape } from '@/models/Rect'
import {
  sourceBboxCoordinatesShape,
  sourceTableCoordinatesShape,
  SourceBboxCoordinates,
} from '@/models/SourceCoordinates'
import { mapSourceTableCoordinatesToTableCoordinates } from '@/models/SourceCoordinates/mappers'
import { UnifiedData } from '@/models/UnifiedData'
import { tableCoordinatesShape, TableCoordinates } from '../TableCoordinates'

class Cell {
  constructor (
    row,
    column,
    value = '',
    rowspan = 1,
    colspan = 1,
    page,
    confidence = NOT_APPLICABLE_CONFIDENCE_LEVEL,
    tableCoordinates,
    sourceTableCoordinates,
    sourceBboxCoordinates,
    pk,
  ) {
    this.coordinates = {
      row,
      column,
      rowspan,
      colspan,
      page,
    }
    this.value = value
    this.confidence = confidence
    this.tableCoordinates = tableCoordinates
    this.sourceTableCoordinates = sourceTableCoordinates
    this.sourceBboxCoordinates = sourceBboxCoordinates
    this.pk = pk
  }
}

const cellShape = PropTypes.shape({
  coordinates: PropTypes.shape({
    row: PropTypes.number.isRequired,
    column: PropTypes.number.isRequired,
    rowspan: PropTypes.number.isRequired,
    colspan: PropTypes.number.isRequired,
    page: PropTypes.number,
  }),
  sourceBboxCoordinates: PropTypes.arrayOf(sourceBboxCoordinatesShape),
  sourceTableCoordinates: PropTypes.arrayOf(sourceTableCoordinatesShape),
  tableCoordinates: PropTypes.arrayOf(tableCoordinatesShape),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  confidence: PropTypes.number,
  pk: PropTypes.string,
})

class TableData {
  constructor (
    page = null,
    rows = [],
    columns = [],
    cells = [],
    coordinates = null,
    modifiedBy,
    tableCoordinates = null,
    index,
    sourceTableCoordinates = null,
    sourceBboxCoordinates = null,
    paginatedRows = null,
    meta = null,
    setIndex = null,
    id,
  ) {
    this.rows = rows
    this.columns = columns
    this.cells = cells
    this.coordinates = coordinates && {
      ...coordinates,
      page,
    }
    this.tableCoordinates = tableCoordinates
    this.sourceTableCoordinates = sourceTableCoordinates
    this.sourceBboxCoordinates = sourceBboxCoordinates
    modifiedBy && (this.modifiedBy = modifiedBy)
    index !== undefined && (this.index = index)
    this.meta = meta
    this.paginatedRows = paginatedRows
    this.setIndex = setIndex
    id && (this.id = id)
  }

  static isValid = (tableData) => (
    tableData != null &&
    has(tableData, 'rows') &&
    has(tableData, 'columns') &&
    has(tableData, 'cells') &&
    (
      tableData.sourceBboxCoordinates !== null ||
      tableData.coordinates !== null
    )
  )

  static isEmpty = (tableData) => (
    !tableData.rows.length &&
    !tableData.cells.length &&
    !tableData.columns.length &&
    tableData.coordinates === null &&
    tableData.modifiedBy === undefined &&
    tableData.tableCoordinates === null &&
    tableData.index === undefined &&
    tableData.sourceBboxCoordinates === null &&
    tableData.sourceTableCoordinates === null &&
    tableData.paginatedRows === null &&
    tableData.meta === null &&
    tableData.setIndex === null
  )
}

const tableDataShape = PropTypes.shape({
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      y: PropTypes.number.isRequired,
    }),
  ).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
    }),
  ).isRequired,
  cells: PropTypes.arrayOf(cellShape).isRequired,
  coordinates: isRequiredIf(
    PropTypes.shape({
      ...rectCoordsShape,
      page: PropTypes.number,
    }),
    (props) => props.sourceBboxCoordinates === null,
  ),
  sourceBboxCoordinates: isRequiredIf(
    PropTypes.oneOfType([
      sourceBboxCoordinatesShape,
      PropTypes.arrayOf(sourceBboxCoordinatesShape),
    ]),
    (props) => props.coordinates === null,
  ),
  sourceTableCoordinates: PropTypes.arrayOf(sourceTableCoordinatesShape),
  tableCoordinates: PropTypes.arrayOf(tableCoordinatesShape),
  modifiedBy: PropTypes.string,
  meta: PropTypes.shape({
    rowsChunk: PropTypes.number,
    listIndex: PropTypes.number,
    chunksTotal: PropTypes.number,
    rowsTotal: PropTypes.number,
  }),
  paginatedRows: PropTypes.arrayOf(
    PropTypes.shape({
      y: PropTypes.number.isRequired,
    }),
  ),
  setIndex: PropTypes.number,
})

class TableField {
  static isValid = (edField) => (
    has(edField, 'fieldPk') &&
    has(edField, 'data')
  )

  static getCoordsFromMarkup = (markupTable) => {
    const { xGuidelines, yGuidelines } = markupTable

    const [left, right] = [xGuidelines[0], xGuidelines[xGuidelines.length - 1]]
    const [top, bottom] = [yGuidelines[0], yGuidelines[yGuidelines.length - 1]]

    const x = left
    const y = top
    const w = right - left
    const h = bottom - top

    return new Rect(x, y, w, h)
  }

  static isSquashedCell = (cm, cell) => (
    TableField.includesRow(cm, cell.coordinates.row) &&
    TableField.includesColumn(cm, cell.coordinates.column)
  )

  static includesRow = (cm, row) => (
    cm.row <= row && row < cm.row + cm.rowspan
  )

  static includesColumn = (cm, column) => (
    cm.column <= column && column < cm.column + cm.colspan
  )

  static getTableFieldCellsFromMarkupTable = (markupTable, page, unifiedData) => {
    const sourceId = UnifiedData.getBboxSourceIdByPage(unifiedData, page)
    const rows = markupTable.yGuidelines.length - 1
    const columns = markupTable.xGuidelines.length - 1
    const cellsQuantity = rows * columns

    const blankCells = Array(cellsQuantity).fill(new Cell())

    let row = 0
    let column = 0

    let cells = blankCells.map((c) => {
      const cell = {
        ...c,
        coordinates: {
          ...c.coordinates,
        },
      }
      cell.coordinates.row = row
      cell.coordinates.column = column
      cell.coordinates.page = page

      if (column + 1 >= columns) {
        row += 1
      }

      column = column + 1 >= columns ? 0 : column + 1
      return cell
    })

    if (markupTable.merges.length) {
      cells = cells.reduce((acc, c) => {
        const cell = {
          ...c,
          coordinates: {
            ...c.coordinates,
          },
        }
        const mergeCell = markupTable.merges.find((m) => m.row === cell.coordinates.row && m.column === cell.coordinates.column)
        if (mergeCell) {
          cell.coordinates.rowspan = mergeCell.rowspan
          cell.coordinates.colspan = mergeCell.colspan
          return [...acc, cell]
        }

        const isSquashedCell = markupTable.merges.some((m) => TableField.isSquashedCell(m, cell))

        if (isSquashedCell) {
          return acc
        }

        return [...acc, cell]
      }, [])
    }

    if (markupTable.values.length) {
      cells = cells.map((c) => {
        const cell = {
          ...c,
          coordinates: {
            ...c.coordinates,
          },
        }
        const cellWithValue = markupTable.values.find((v) => v.row === cell.coordinates.row && v.column === cell.coordinates.column)
        if (cellWithValue) {
          cell.value = cellWithValue.value
          cell.confidence = cellWithValue.confidence
        }

        return cell
      }, [])
    }

    if (sourceId) {
      cells = cells.map((c) => {
        const { column, row, colspan, rowspan } = c.coordinates
        const cellX = markupTable.xGuidelines[column]
        const cellY = markupTable.yGuidelines[row]
        const cellW = markupTable.xGuidelines[column + colspan] - cellX
        const cellH = markupTable.yGuidelines[row + rowspan] - cellY

        const cell = {
          ...c,
          sourceBboxCoordinates: [
            new SourceBboxCoordinates(
              sourceId,
              page,
              [
                new Rect(
                  cellX,
                  cellY,
                  cellW,
                  cellH,
                ),
              ],
            ),
          ],
        }

        return cell
      }, [])
    }

    return cells
  }

  static getRows = (yGuidelines, tableCoords) => {
    const rows = yGuidelines.map((ygl) => ({ y: +((ygl - tableCoords.y) / tableCoords.h).toFixed(12) }))
    rows.length = rows.length - 1
    return rows
  }

  static getColumns = (xGuidelines, tableCoords) => {
    const columns = xGuidelines.map((xgl) => ({ x: +((xgl - tableCoords.x) / tableCoords.w).toFixed(12) }))
    columns.length = columns.length - 1
    return columns
  }

  static getCellsByRange = (tableField, range) => {
    const { from, to } = range
    const topRow = Math.min(from.row, to.row)
    const leftCol = Math.min(from.col, to.col)
    const lastRow = Math.max(from.row, to.row)
    const lastCol = Math.max(from.col, to.col)

    const cells = tableField.data.cells.filter((cell) => {
      const { column, row } = cell.coordinates
      return column >= leftCol && row >= topRow && column <= lastCol && row <= lastRow
    })

    return cells
  }

  static getFirstCellWithCoords = (range, tableField) => {
    const cells = TableField.getCellsByRange(tableField, range)
    const [firstCell] = cells.filter((c) => (
      !isEmpty(c.sourceBboxCoordinates) ||
      !isEmpty(c.sourceTableCoordinates) ||
      !isEmpty(c.tableCoordinates)
    ))
    return firstCell
  }

  static getCoordsBounds = (range, tableField, page) => {
    const { from, to } = range
    const topRow = Math.min(from.row, to.row)
    const leftCol = Math.min(from.col, to.col)
    const lastRow = Math.max(from.row, to.row) + 1
    const lastCol = Math.max(from.col, to.col) + 1
    const { y: fromY } = tableField.data?.rows[topRow]
    const { x: fromX } = tableField.data?.columns[leftCol]
    const { y: toY } = tableField.data?.rows[lastRow] ?? { y: 1 }
    const { x: toX } = tableField.data?.columns[lastCol] ?? { x: 1 }

    const { coordinates } = tableField.data

    let coordinate

    if (coordinates.length) {
      const coord = coordinates.find((c) => c.page === page)
      coordinate = coord ?? coordinates[0]
    } else {
      coordinate = coordinates
    }

    const topCoord = coordinate?.y + coordinate?.h * fromY
    const leftCoord = coordinate?.x + coordinate?.w * fromX

    const w = (toX - fromX) * coordinate?.w
    const h = (toY - fromY) * coordinate?.h

    return [new Rect(leftCoord, topCoord, w, h)]
  }

  static getCellRangesFromHighlightedCells = (tableField, range, activePage) => {
    if (
      !tableField.data?.coordinates &&
      !TableCoordinates.hasCoordsInCells(tableField.data.cells)
    ) {
      return null
    }

    const cells = TableField.getCellsByRange(tableField, range)
    const firstCell = TableField.getFirstCellWithCoords(range, tableField)

    if (firstCell?.sourceBboxCoordinates?.length) {
      const [initCoords] = firstCell.sourceBboxCoordinates
      const cellsOnInitPage = cells.reduce((acc, cell) => {
        const coords = cell.sourceBboxCoordinates?.flat().find((c) => c.sourceId === initCoords?.sourceId)
        if (coords) {
          acc.push(...coords.bboxes)
        }
        return acc
      }, [])

      return {
        sourceId: initCoords?.sourceId,
        field: cellsOnInitPage,
      }
    }

    if (firstCell?.sourceTableCoordinates?.length) {
      const [initCoords] = firstCell.sourceTableCoordinates
      const cellsOnInitPage = cells.reduce((acc, cell) => {
        const coords = cell.sourceTableCoordinates?.flat().find((c) => c.sourceId === initCoords?.sourceId)
        if (coords) {
          const validCoords = coords.cellRanges.map((r) => (mapSourceTableCoordinatesToTableCoordinates(r)))
          acc.push(...validCoords)
        }
        return acc
      }, [])

      return {
        sourceId: initCoords?.sourceId,
        field: cellsOnInitPage,
      }
    }

    if (firstCell?.tableCoordinates?.length) {
      const [initCoords] = firstCell.tableCoordinates
      const cellsOnInitPage = cells.reduce((acc, cell) => {
        const coords = cell.tableCoordinates?.find((c) => c.page === initCoords?.page)
        if (coords) {
          acc.push(...coords.cellRange)
        }
        return acc
      }, [])

      return {
        page: initCoords?.page,
        field: cellsOnInitPage,
      }
    }

    if (tableField.data?.coordinates) {
      const { from, to } = range
      const topRow = Math.min(from.row, to.row)
      const leftCol = Math.min(from.col, to.col)
      const lastRow = Math.max(from.row, to.row) + 1
      const lastCol = Math.max(from.col, to.col) + 1
      const { y: fromY } = tableField.data?.rows[topRow]
      const { x: fromX } = tableField.data?.columns[leftCol]
      const { y: toY } = tableField.data?.rows[lastRow] ?? { y: 1 }
      const { x: toX } = tableField.data?.columns[lastCol] ?? { x: 1 }

      const { coordinates } = tableField.data

      let coordinate

      if (coordinates.length) {
        const coord = coordinates.find((c) => c.page === activePage)
        coordinate = coord ?? coordinates[0]
      } else {
        coordinate = coordinates
      }

      const topCoord = coordinate?.y + coordinate?.h * fromY
      const leftCoord = coordinate?.x + coordinate?.w * fromX

      const w = (toX - fromX) * coordinate?.w
      const h = (toY - fromY) * coordinate?.h

      return {
        page: coordinate?.page || activePage,
        field: [new Rect(leftCoord, topCoord, w, h)],
      }
    }
  }

  static isCellCoordsFromOnePage = (cell) => (
    (
      !cell?.sourceTableCoordinates &&
      !cell?.sourceBboxCoordinates &&
      !cell?.tableCoordinates
    ) ||
    (
      cell?.sourceTableCoordinates &&
      (
        cell?.sourceTableCoordinates?.every((coord, _, self) => (
          coord.sourceId === self[0].sourceId
        ))
      )
    ) ||
    (
      cell?.sourceBboxCoordinates &&
      (
        cell?.sourceBboxCoordinates?.every((coord, _, self) => (
          coord.sourceId === self[0].sourceId
        ))
      )
    ) ||
    (
      (
        !cell?.sourceTableCoordinates &&
        cell?.tableCoordinates
      ) &&
      (
        cell?.tableCoordinates?.every((coord, _, self) => (
          coord.page === self[0].page
        ))
      )
    )
  )
}

export {
  Cell,
  cellShape,
  TableField,
  TableData,
  tableDataShape,
}
