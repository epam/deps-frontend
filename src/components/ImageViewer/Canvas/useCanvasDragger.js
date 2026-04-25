
import {
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { Cursor } from '@/enums/Cursor'

const initialCanvasPosition = {
  x: 0,
  y: 0,
}

const useCanvasDragger = ({
  context,
  canvasWidth,
  canvasHeight,
  drawnImageSize,
  rotationAngle,
  setPosition,
  isScaleToPointEnabled,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [prevPosition, setPrevPosition] = useState(initialCanvasPosition)
  const { width: drawnImageWidth, height: drawnImageHeight } = drawnImageSize

  const getTransformedPoint = useCallback((x, y) => {
    const originalPoint = new DOMPoint(x, y)
    return context.getTransform().invertSelf().transformPoint(originalPoint)
  }, [context])

  const dragCursor = useMemo(() => (
    isDragging ? Cursor.GRABBING : Cursor.GRAB
  ), [isDragging])

  const updatePrevPosition = useCallback((e) => {
    const { clientX, clientY } = e
    const { x: transformedX, y: transformedY } = getTransformedPoint(clientX, clientY)

    setPrevPosition({
      x: isScaleToPointEnabled ? transformedX : clientX,
      y: isScaleToPointEnabled ? transformedY : clientY,
    })
  }, [
    getTransformedPoint,
    isScaleToPointEnabled,
  ])

  const getBoundedPosition = useCallback(({ x, y }) => {
    const isVertical = rotationAngle % 180 === 0
    const width = isVertical ? drawnImageWidth : drawnImageHeight
    const height = isVertical ? drawnImageHeight : drawnImageWidth

    const isFitHorizontally = width <= canvasWidth
    const isFitVertically = height <= canvasHeight

    let xMin = 0
    let xMax = canvasWidth - width
    let yMin = 0
    let yMax = canvasHeight - height

    switch (rotationAngle) {
      case 90:
      case -270:
        xMin = -xMax
        xMax = 0
        break
      case 180:
      case -180:
        xMin = -xMax
        xMax = 0
        yMin = -yMax
        yMax = 0
        break
      case 270:
      case -90:
        yMin = -yMax
        yMax = 0
        break
      default:
        break
    }

    if (!isFitHorizontally) {
      [xMin, xMax] = [xMax, xMin]
    }

    if (!isFitVertically) {
      [yMin, yMax] = [yMax, yMin]
    }

    return {
      x: Math.max(xMin, Math.min(x, xMax)),
      y: Math.max(yMin, Math.min(y, yMax)),
    }
  }, [
    drawnImageWidth,
    canvasWidth,
    canvasHeight,
    drawnImageHeight,
    rotationAngle,
  ])

  const onMouseMove = useCallback((e) => {
    if (!isDragging) {
      return
    }

    const { clientX, clientY } = e
    const { x: transformedX, y: transformedY } = getTransformedPoint(clientX, clientY)
    const mouseX = isScaleToPointEnabled ? transformedX : clientX
    const mouseY = isScaleToPointEnabled ? transformedY : clientY

    const [nextX, nextY] = [
      mouseX - prevPosition.x,
      mouseY - prevPosition.y,
    ]

    if (isScaleToPointEnabled) {
      setPosition((prev) => ({
        x: prev.x + nextX,
        y: prev.y + nextY,
      }))
    } else {
      setPosition((prev) => getBoundedPosition({
        x: prev.x + nextX,
        y: prev.y + nextY,
      }))
    }
    updatePrevPosition(e)
  }, [
    isDragging,
    setPosition,
    prevPosition,
    updatePrevPosition,
    getBoundedPosition,
    getTransformedPoint,
    isScaleToPointEnabled,
  ])

  const onMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const onMouseDown = useCallback((e) => {
    e.preventDefault()

    updatePrevPosition(e)
    setIsDragging(true)
  }, [updatePrevPosition])

  const dragProp = useMemo(() => {
    if (!isDragging) {
      return { onMouseDown }
    }
  }, [isDragging, onMouseDown])

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  return {
    dragCursor,
    dragProp,
  }
}

export {
  useCanvasDragger,
}
