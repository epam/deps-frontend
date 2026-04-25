
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'
import { ExtractedDataCoordsType } from '@/enums/ExtractedDataCoordsType'
import { Rect } from '@/models/Rect'
import { mapSourceTableCoordinatesToTableCoordinates } from '@/models/SourceCoordinates/mappers'
import { TableCoordinates } from '../TableCoordinates'
import { ExtractedDataField } from './ExtractedDataField'

class DictField {
  static getHighlightedFieldData = (dictFieldData, highlightedField) => {
    if (
      !dictFieldData ||
      isEmpty(dictFieldData) ||
      !has(dictFieldData, 'key') ||
      !has(dictFieldData, 'value') ||
      (
        !has(dictFieldData.key, ExtractedDataCoordsType.COORDINATES) &&
        !has(dictFieldData.key, ExtractedDataCoordsType.TABLE_COORDINATES) &&
        !has(dictFieldData.key, ExtractedDataCoordsType.SOURCE_TABLE_COORDINATES) &&
        !has(dictFieldData.key, ExtractedDataCoordsType.SOURCE_BBOX_COORDINATES)
      ) ||
      (
        !has(dictFieldData.value, ExtractedDataCoordsType.COORDINATES) &&
        !has(dictFieldData.value, ExtractedDataCoordsType.TABLE_COORDINATES) &&
        !has(dictFieldData.value, ExtractedDataCoordsType.SOURCE_TABLE_COORDINATES) &&
        !has(dictFieldData.value, ExtractedDataCoordsType.SOURCE_BBOX_COORDINATES)
      )
    ) {
      return null
    }

    if (dictFieldData.key?.sourceBboxCoordinates || dictFieldData.value?.sourceBboxCoordinates) {
      const sourceId = (
        dictFieldData.key?.sourceBboxCoordinates?.[0]?.sourceId ??
        dictFieldData.value?.sourceBboxCoordinates?.[0]?.sourceId
      )

      const coordinatesOnActivePage = Object.values(dictFieldData).reduce(
        (a, fieldData) => {
          const coordsOnActivePage = fieldData.sourceBboxCoordinates?.find((p) => p.sourceId === sourceId)

          if (!coordsOnActivePage) {
            return a
          }

          coordsOnActivePage.bboxes?.forEach((coord) => {
            a.push(new Rect(
              coord.x,
              coord.y,
              coord.w,
              coord.h,
            ))
          })

          return a
        }, [],
      )
      return coordinatesOnActivePage.length ? {
        sourceId,
        field: coordinatesOnActivePage.flat(),
      } : null
    }

    if (dictFieldData.key?.sourceTableCoordinates || dictFieldData.value?.sourceTableCoordinates) {
      const sourceId = (
        dictFieldData.key?.sourceTableCoordinates?.[0]?.sourceId ??
        dictFieldData.value?.sourceTableCoordinates?.[0]?.sourceId
      )

      const coordinatesOnActivePage = Object.values(dictFieldData).reduce(
        (a, fieldData) => {
          const coordsOnActivePage = fieldData.sourceTableCoordinates?.find((p) => p.sourceId === sourceId)

          if (!coordsOnActivePage) {
            return a
          }

          coordsOnActivePage.cellRanges?.forEach((coord) => {
            const correctCoord = mapSourceTableCoordinatesToTableCoordinates(coord)
            a.push(correctCoord)
          })

          return a
        }, [],
      )
      return coordinatesOnActivePage.length ? {
        sourceId,
        field: coordinatesOnActivePage.flat(),
      } : null
    }

    if (dictFieldData.key?.coordinates || dictFieldData.value?.coordinates) {
      const page = ExtractedDataField
        .getPages(dictFieldData)
        .reduce((min, page) => !isNaN(page)
          ? Math.min(min, page)
          : min
        , Infinity)

      const coordinatesOnActivePage = Object.values(dictFieldData).reduce(
        (a, fieldData) => {
          const { coordinates } = fieldData
          const [correctCoords] = coordinates?.length ? coordinates : [coordinates]

          correctCoords?.page === page && a.push(new Rect(
            correctCoords.x,
            correctCoords.y,
            correctCoords.w,
            correctCoords.h,
          ))
          return a
        }, [],
      )
      return coordinatesOnActivePage.length ? {
        page,
        field: coordinatesOnActivePage.flat(),
      } : null
    }
    if (dictFieldData.key?.tableCoordinates?.length || dictFieldData.value?.tableCoordinates?.length) {
      const values = []
      if (dictFieldData.key?.tableCoordinates?.length) {
        values.push(...dictFieldData.key.tableCoordinates)
      }
      if (dictFieldData.value?.tableCoordinates?.length) {
        values.push(...dictFieldData.value.tableCoordinates)
      }
      const index = TableCoordinates.getTableCoordinatesIndex(values, highlightedField)
      return {
        page: values[index].page,
        field: values[index].cellRange,
      }
    }
  }
}

export { DictField }
