
import { ENV } from '@/utils/env'
import { OCRGrid } from '../OCRGrid'

export const getRectContent = (textLines, coords) => {
  const { yMin, xMin, xMax, yMax } = coords

  const grid = new OCRGrid(textLines)
  grid.initGrid()

  const textBoxes = grid.findRectangle(
    yMin,
    yMax,
    xMin,
    xMax,
    ENV.FEATURE_OCR_INTERSECTION_ALGORITHM_THRESHOLD,
  ).flat()

  const { values, confidence } = textBoxes.reduce((
    acc,
    { text, confidence },
  ) => {
    acc.values.push(text)
    acc.confidence += confidence

    return acc
  }, {
    values: [],
    confidence: 0,
  })

  return {
    content: values.join(' '),
    confidence: confidence ? confidence / values.length : 0,
  }
}
