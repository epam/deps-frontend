
import { Rect } from '@/models/Rect'
import { mapSourceTableCoordinatesToTableCoordinates } from '@/models/SourceCoordinates/mappers'
import { TableCoordinates } from '../TableCoordinates'

class StringField {
  static getHighlightedFieldData = (documentFieldData, highlightedField) => {
    if (
      !documentFieldData?.coordinates &&
      !documentFieldData?.tableCoordinates &&
      !documentFieldData?.sourceBboxCoordinates &&
      !documentFieldData?.sourceTableCoordinates &&
      !documentFieldData?.sourceTextCoordinates
    ) {
      return null
    }

    if (documentFieldData?.sourceBboxCoordinates) {
      const coords = documentFieldData.sourceBboxCoordinates.reduce((acc, cur) => {
        acc.sourceId = cur.sourceId

        if (!acc.bboxes) {
          acc.bboxes = [...cur.bboxes]
        } else {
          acc.bboxes.push(...cur.bboxes)
        }
        return acc
      }, {})

      if (!coords) {
        return
      }

      const { sourceId, bboxes } = coords

      if (!bboxes) {
        return
      }

      const rectsToHighlight = bboxes.map(({ x, y, w, h }) => new Rect(x, y, w, h))

      return {
        sourceId,
        field: rectsToHighlight,
      }
    }

    if (documentFieldData?.sourceTableCoordinates) {
      const [coords] = documentFieldData.sourceTableCoordinates

      if (!coords) {
        return
      }

      const { sourceId, cellRanges: [cellRange] } = coords

      if (!cellRange) {
        return
      }

      const field = mapSourceTableCoordinatesToTableCoordinates(cellRange)

      return {
        sourceId,
        field: [field],
      }
    }

    if (documentFieldData?.coordinates?.x || documentFieldData?.coordinates?.y) {
      const { x, y, w, h, page } = documentFieldData.coordinates

      return {
        page,
        field: [new Rect(x, y, w, h)],
      }
    }

    if (documentFieldData?.coordinates?.length) {
      const coordinates = documentFieldData?.coordinates

      if (coordinates?.some((coord) => !coord.x || !coord.y)) {
        return undefined
      }

      return coordinates.reduce((acc, cur) => {
        const { x, y, w, h, page } = cur
        acc.page = page
        if (!acc.field) {
          acc.field = [new Rect(x, y, w, h)]
        } else {
          acc.field.push(new Rect(x, y, w, h))
        }
        return acc
      }, {})
    }

    if (documentFieldData?.tableCoordinates?.length) {
      const index = TableCoordinates.getTableCoordinatesIndex(documentFieldData?.tableCoordinates, highlightedField)

      return {
        page: documentFieldData.tableCoordinates[index].page,
        field: documentFieldData.tableCoordinates[index].cellRange,
      }
    }

    if (documentFieldData?.sourceTextCoordinates) {
      const [coords] = documentFieldData.sourceTextCoordinates

      if (!coords) {
        return
      }

      const { sourceId, charRanges } = coords

      if (!charRanges) {
        return
      }

      return {
        sourceId,
        field: charRanges,
      }
    }
  }
}

export { StringField }
