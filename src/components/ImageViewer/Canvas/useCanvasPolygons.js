
import { useCallback } from 'react'
import { Point } from '@/models/Point'
import { ENV } from '@/utils/env'
import { useCanvasPolygonFill } from './useCanvasPolygonFill'

const POLYGON_COLOR = 'rgb(255, 0, 0)'

const useCanvasPolygons = ({
  context,
  polygons,
  activePolygons,
  onAddActivePolygons,
  onClearActivePolygons,
}) => {
  const {
    fill,
  } = useCanvasPolygonFill({
    context,
    activePolygons,
    onAddActivePolygons,
    onClearActivePolygons,
  })

  const drawPolygons = useCallback((
    width,
    height,
  ) => {
    polygons.forEach((polygon) => {
      const resizedPoints = polygon.map(({ x, y }) => (
        new Point(
          x * width,
          y * height,
        )
      ))
      context.beginPath()
      context.strokeStyle = POLYGON_COLOR

      resizedPoints.forEach(({ x, y }, i) => {
        if (!i) {
          context.moveTo(x, y)
          return
        }

        context.lineTo(x, y)
      })

      if (ENV.FEATURE_FILL_CANVAS_POLYGONS) {
        fill(polygon)
      }

      context.closePath()
      context.stroke()
    })
  }, [
    context,
    polygons,
    fill,
  ])

  return {
    drawPolygons,
  }
}

export {
  useCanvasPolygons,
}
