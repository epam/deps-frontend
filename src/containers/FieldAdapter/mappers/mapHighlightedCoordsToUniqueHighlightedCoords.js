
import cloneDeep from 'lodash/cloneDeep'

export const mapHighlightedCoordsToUniqueHighlightedCoords = (coordinates) => {
  const coords = cloneDeep(coordinates)
  const uniqueCoords = {}

  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i]
    const key = coord.sourceId || coord.page

    if (uniqueCoords[key]) {
      uniqueCoords[key].coordinates.push(...coord.coordinates)
    } else {
      uniqueCoords[key] = coord
    }
  }

  return Object.values(uniqueCoords)
}
