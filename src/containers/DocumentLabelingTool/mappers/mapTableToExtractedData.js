
import isEqual from 'lodash/isEqual'
import { documentsApi } from '@/api/documentsApi'
import { Document } from '@/models/Document'
import { TableField, TableData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import {
  SourceBboxCoordinates,
} from '@/models/SourceCoordinates'
import { UnifiedData } from '@/models/UnifiedData'
import { extractDataTableWithAlgorithm } from '@/services/OCRExtractionService'
import { ENV } from '@/utils/env'
import { getFieldId } from './getFieldId'

const getTableEd = async ({
  engine,
  blobName,
  markupTable,
  language,
  tableData,
}) => {
  let tableEd

  if (ENV.FEATURE_OCR_INTERSECTION_ALGORITHM) {
    tableEd = await extractDataTableWithAlgorithm({
      engine,
      blobName,
      markupTable,
      language,
      tableData,
    })
  } else {
    tableEd = await documentsApi.extractTableData(
      tableData,
      blobName,
      engine,
      language,
    )
  }

  return tableEd
}

const mapLtTableToEdTableData = (
  markupTable,
  page,
  unifiedData,
  fieldId,
) => {
  const coordinates = TableField.getCoordsFromMarkup(markupTable)
  const rows = TableField.getRows(markupTable.yGuidelines, coordinates)
  const columns = TableField.getColumns(markupTable.xGuidelines, coordinates)
  const cells = TableField.getTableFieldCellsFromMarkupTable(markupTable, page, unifiedData)
  const setIndex = markupTable.meta?.setIndex
  const sourceId = UnifiedData.getBboxSourceIdByPage(unifiedData, page)
  const sourceBboxCoordinates = new SourceBboxCoordinates(
    sourceId,
    page,
    [
      coordinates,
    ],
  )

  return new TableData(
    page,
    rows,
    columns,
    cells,
    coordinates,
    undefined,
    null,
    undefined,
    null,
    sourceBboxCoordinates,
    null,
    null,
    setIndex,
    fieldId,
  )
}

const mapTableToExtractedData = async ({
  markupToProcess,
  processingDocuments,
  language,
  engine,
  withoutExtraction,
  unifiedData,
  edField,
}) => {
  const extractedData = []

  for await (const [page, table] of markupToProcess) {
    const tableData = mapLtTableToEdTableData(
      table,
      +page,
      unifiedData,
      getFieldId(edField, table.index),
    )
    let tableDataToSave = tableData

    if (withoutExtraction) {
      extractedData.push(tableDataToSave)
      // eslint-disable-next-line no-continue
      continue
    }

    const metaCoords = table.meta.coordinates

    const prevCoords = metaCoords && new FieldCoordinates(
      +metaCoords.page,
      metaCoords.x,
      metaCoords.y,
      metaCoords.w,
      metaCoords.h,
    )

    const currentCoords = new FieldCoordinates(
      +tableData.coordinates.page,
      tableData.coordinates.x,
      tableData.coordinates.y,
      tableData.coordinates.w,
      tableData.coordinates.h,
    )

    if (
      !isEqual(currentCoords, prevCoords) ||
      tableData.cells.length !== table.meta.cells?.length ||
      (
        !isEqual(tableData.columns, table.meta.columns) ||
        !isEqual(tableData.rows, table.meta.rows)
      )
    ) {
      try {
        const blobName = Document.getBlobNameByPage({ unifiedData }, page) ?? processingDocuments[page]?.blobName

        tableDataToSave = await getTableEd({
          engine,
          blobName,
          markupTable: table,
          language,
          tableData,
        })
      } catch {
        tableDataToSave = tableData
      }
    }
    extractedData.push(tableDataToSave)
  }

  return extractedData
}

export {
  mapLtTableToEdTableData,
  mapTableToExtractedData,
}
