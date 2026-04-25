
import { Markup, PageMarkup } from 'labeling-tool/lib/models/Markup'
import {
  CellsMerge,
  CellValue,
  Table,
} from 'labeling-tool/lib/models/Table'
import { v4 as uuidv4 } from 'uuid'
import { Document } from '@/models/Document'
import { TableData } from '@/models/ExtractedData'

const mapTableToMarkup = (tableData, fieldCode, unifiedData, index, uid = uuidv4()) => {
  if (!TableData.isValid(tableData)) {
    return null
  }

  const tableW = tableData.sourceBboxCoordinates?.bboxes?.[0]?.w ?? tableData.coordinates.w
  const tableX = tableData.sourceBboxCoordinates?.bboxes?.[0]?.x ?? tableData.coordinates.x
  const tableY = tableData.sourceBboxCoordinates?.bboxes?.[0]?.y ?? tableData.coordinates.y
  const tableH = tableData.sourceBboxCoordinates?.bboxes?.[0]?.h ?? tableData.coordinates.h

  const xGuidelines = [
    ...tableData.columns.map((column) => column.x * tableW + tableX),
    tableX + tableW,
  ]
  const yGuidelines = [
    ...tableData.rows.map((row) => row.y * tableH + tableY),
    tableY + tableH,
  ]

  const merges = tableData.cells
    .filter((c) => CellsMerge.isValid(c.coordinates))
    .map((cell) => new CellsMerge(cell.coordinates.row, cell.coordinates.column, cell.coordinates.colspan, cell.coordinates.rowspan))

  const values = tableData.cells.map((c) => new CellValue(c.coordinates.row, c.coordinates.column, c.value, c.confidence))
  const table = new Table(xGuidelines, yGuidelines, merges, values, tableData, fieldCode, index, uid)
  const pageMarkup = new PageMarkup(null, table)

  const markupPage = tableData.sourceBboxCoordinates?.sourceId
    ? Document.getPageBySourceId(
      { unifiedData },
      tableData.sourceBboxCoordinates.sourceId,
    )
    : tableData.coordinates.page

  const markup = new Markup(
    new Map([
      [
        markupPage,
        pageMarkup,
      ],
    ]),
  )
  return markup
}

export {
  mapTableToMarkup,
}
