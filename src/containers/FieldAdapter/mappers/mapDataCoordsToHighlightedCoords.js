
import { mapSourceTableCoordinatesToTableCoordinates } from '@/models/SourceCoordinates/mappers/mapSourceTableCoordinatesToTableCoordinates'

const mapCoordinatesToRectCoords = ({ page, ...coords }) => ({
  page,
  coordinates: [coords],
})

const mapRectCoordsToHighlightedCoords = (coordinates) => (
  Array.isArray(coordinates)
    ? coordinates.map((c) => mapCoordinatesToRectCoords(c))
    : [mapCoordinatesToRectCoords(coordinates)]
)

const mapSourceBboxCoordsToHighlightedCoords = (sourceCoordinates) => {
  if (Array.isArray(sourceCoordinates)) {
    return sourceCoordinates.map(({ sourceId, bboxes }) => ({
      sourceId,
      coordinates: bboxes,
    }))
  }

  return [{
    sourceId: sourceCoordinates.sourceId,
    coordinates: sourceCoordinates.bboxes,
  }]
}

const mapSourceTableCoordsToHighlightedCoords = (sourceCoordinates) => (
  sourceCoordinates.map(({ sourceId, cellRanges }) => ({
    sourceId,
    coordinates: cellRanges.map((r) => mapSourceTableCoordinatesToTableCoordinates(r)),
  }))
)

const mapTableCoordsToHighlightedCoords = (coordinates) => (
  coordinates.map(({ page, cellRange }) => ({
    page,
    coordinates: cellRange,
  }))
)

const mapSourceTextCoordsToHighlightedCoords = (sourceCoordinates) => (
  sourceCoordinates.map(({ sourceId, charRanges }) => ({
    sourceId,
    coordinates: charRanges,
  }))
)

export const mapDataCoordsToHighlightedCoords = (data) => {
  const {
    tableCoordinates,
    sourceBboxCoordinates,
    sourceTableCoordinates,
    coordinates,
    sourceTextCoordinates,
  } = data

  if (sourceBboxCoordinates) {
    return mapSourceBboxCoordsToHighlightedCoords(sourceBboxCoordinates)
  }

  if (sourceTableCoordinates) {
    return mapSourceTableCoordsToHighlightedCoords(sourceTableCoordinates)
  }

  if (sourceTextCoordinates) {
    return mapSourceTextCoordsToHighlightedCoords(sourceTextCoordinates)
  }

  if (tableCoordinates) {
    return mapTableCoordsToHighlightedCoords(tableCoordinates)
  }

  if (!coordinates) {
    return []
  }

  return mapRectCoordsToHighlightedCoords(coordinates)
}
