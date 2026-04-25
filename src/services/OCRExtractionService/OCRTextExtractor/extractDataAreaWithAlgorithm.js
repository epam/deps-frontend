
import { getOCRTextLines } from './getOCRTextLines'
import { getRectContent } from './getRectContent'

export const extractDataAreaWithAlgorithm = async ({
  language,
  engine,
  blobName,
  labelCoords,
}) => {
  const { x, y, w, h } = labelCoords

  const textLines = await getOCRTextLines(
    language,
    engine,
    blobName,
  )

  const rectCoords = {
    yMin: y,
    yMax: y + h,
    xMin: x,
    xMax: x + w,
  }

  return getRectContent(textLines, rectCoords)
}
