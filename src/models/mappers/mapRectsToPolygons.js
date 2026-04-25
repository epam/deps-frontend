
import { Point } from '@/models/Point'
import { Rect } from '@/models/Rect'

const mapRectToPolygon = ({ x, y, h, w }) => {
  const topLeft = new Point(x, y)

  const topRight = new Point(x + w, y)

  const bottomLeft = new Point(x, y + h)

  const bottomRight = new Point(topRight.x, bottomLeft.y)

  return [topLeft, topRight, bottomRight, bottomLeft]
}

const mapRectsToPolygons = (rectCoords) => (
  rectCoords.map((rect) => {
    if (!Rect.isValid(rect)) {
      throw new Error(`${JSON.stringify(rect)} is not a valid Rect`)
    }
    return mapRectToPolygon(rect)
  })
)

export { mapRectsToPolygons }
