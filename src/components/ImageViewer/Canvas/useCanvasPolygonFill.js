
import {
  useRef,
  useCallback,
  useEffect,
} from 'react'

const POLYGON_FILL_COLOR = 'rgba(255, 0, 0, 0.1)'

const useCanvasPolygonFill = ({
  context,
  activePolygons = [],
  onAddActivePolygons = () => {},
  onClearActivePolygons = () => {},
}) => {
  const mousePosition = useRef({
    x: null,
    y: null,
  })

  const isPolygonActive = useCallback((polygon) => (
    activePolygons.some((p) => p === polygon)
  ), [activePolygons])

  const isInCurrentPath = useCallback(() => (
    context.isPointInPath(mousePosition.current.x, mousePosition.current.y)
  ), [context])

  const clearMousePosition = useCallback(() => {
    mousePosition.current = {
      x: null,
      y: null,
    }
  }, [])

  const onDblClick = useCallback((e) => {
    if (e.target !== context.canvas) {
      return
    }

    onClearActivePolygons()

    mousePosition.current = {
      x: e.offsetX,
      y: e.offsetY,
    }
  }, [onClearActivePolygons, context])

  useEffect(() => {
    document.addEventListener('dblclick', onDblClick)
    document.addEventListener('mousedown', clearMousePosition)

    return () => {
      document.removeEventListener('dblclick', onDblClick)
      document.removeEventListener('mousedown', clearMousePosition)
    }
  }, [onDblClick, clearMousePosition])

  const fill = useCallback((polygon) => {
    if (!isPolygonActive(polygon) && isInCurrentPath()) {
      onAddActivePolygons(polygon)
    }

    if (!isPolygonActive(polygon)) {
      return
    }

    context.fillStyle = POLYGON_FILL_COLOR
    context.fill()
  }, [
    context,
    isPolygonActive,
    isInCurrentPath,
    onAddActivePolygons,
  ])

  return {
    fill,
  }
}

export {
  useCanvasPolygonFill,
}
