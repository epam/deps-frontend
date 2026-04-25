
import { Rect } from '@/models/Rect'

const transposeRect = (rotation, rect) => {
  const { x, y, w, h } = rect
  let transposedY, transposedHeight, transposedX, transposedWidth

  switch (rotation) {
    case 0:
      return rect
    case 90:
    case -270:
      transposedY = 1 - x - w
      transposedHeight = w
      transposedX = y
      transposedWidth = h
      break
    case 180:
    case -180:
      transposedY = 1 - y - h
      transposedHeight = h
      transposedX = 1 - x - w
      transposedWidth = w
      break
    case 270:
    case -90:
      transposedY = x
      transposedHeight = w
      transposedX = 1 - y - h
      transposedWidth = h
      break
    default:
      break
  }

  return new Rect(
    transposedX,
    transposedY,
    transposedWidth,
    transposedHeight,
  )
}

const convertBytesToMegaBytes = (bytes) => bytes / (1024 * 1024)

export {
  transposeRect,
  convertBytesToMegaBytes,
}
