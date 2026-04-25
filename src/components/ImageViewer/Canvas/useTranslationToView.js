
import isEqual from 'lodash/isEqual'
import { useEffect } from 'react'
import { usePrevious } from '@/hooks/usePrevious'

const getTranslationCoords = ({
  maxCoord,
  minCoord,
  position,
  canvasBoundary,
  rotationAngle,
  negativeCoordAngles,
}) => {
  let newPosition = Math.abs(position)
  const delta = maxCoord - minCoord
  const padding = canvasBoundary - delta > 0 ? delta / 2 : 0
  const offsetFromMaxCoord = maxCoord - newPosition
  const offsetFromMinCoord = maxCoord - newPosition

  if (offsetFromMaxCoord < 0 || offsetFromMinCoord < 0) {
    newPosition = minCoord - Math.round(padding)
  }

  if (offsetFromMinCoord > canvasBoundary || offsetFromMaxCoord > canvasBoundary) {
    newPosition = maxCoord - canvasBoundary + Math.round(padding)
  }

  return negativeCoordAngles.includes(rotationAngle) ? -newPosition : newPosition
}

const useTranslationToView = ({
  polygons,
  canvasWidth,
  canvasHeight,
  rotationAngle,
  drawnImageSize,
  position,
  setPosition,
}) => {
  const prevPolygons = usePrevious(polygons)

  useEffect(() => {
    if (!polygons?.length || isEqual(polygons, prevPolygons)) {
      return
    }

    const translateCanvasToPolygon = () => {
      const [polygon] = polygons
      const { width: imageWidth, height: imageHeight } = drawnImageSize
      const [minX, minY, maxX, maxY] = [
        Math.min(...polygon.map((point) => point.x * imageWidth)),
        Math.min(...polygon.map((point) => point.y * imageHeight)),
        Math.max(...polygon.map((point) => point.x * imageWidth)),
        Math.max(...polygon.map((point) => point.y * imageHeight)),
      ]
      const isVertical = rotationAngle % 180 === 0

      const x = getTranslationCoords({
        minCoord: isVertical ? minX : minY,
        maxCoord: isVertical ? maxX : maxY,
        position: position.x,
        canvasBoundary: canvasWidth,
        rotationAngle,
        negativeCoordAngles: [0, -90, 270],
      })

      const y = getTranslationCoords({
        minCoord: isVertical ? minY : minX,
        maxCoord: isVertical ? maxY : maxX,
        position: position.y,
        canvasBoundary: canvasHeight,
        rotationAngle,
        negativeCoordAngles: [0, 90],
      })

      if (x !== position.x || y !== position.y) {
        setPosition({
          x,
          y,
        })
      }
    }

    translateCanvasToPolygon()
  }, [
    canvasWidth,
    canvasHeight,
    drawnImageSize,
    polygons,
    prevPolygons,
    position,
    rotationAngle,
    setPosition,
  ])
}

export {
  useTranslationToView,
}
