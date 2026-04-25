
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'

const DEFAULT_CONFIG = {
  initialWidth: 700,
  initialHeight: 500,
  minWidth: 450,
  minHeight: 500,
  maxWidth: '90vw',
  maxHeight: '90vh',
  margin: 20,
  storageKey: null,
  minTopPosition: 0,
}

const RESIZE_ENABLE = {
  top: true,
  right: true,
  bottom: true,
  left: true,
  topRight: true,
  bottomRight: true,
  bottomLeft: true,
  topLeft: true,
}

const TOP_DIRECTIONS = ['top', 'topLeft', 'topRight']
const LEFT_DIRECTIONS = ['left', 'topLeft', 'bottomLeft']

const useModalResize = (isVisible, config = {}) => {
  const {
    initialWidth,
    initialHeight,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    margin,
    minTopPosition,
    storageKey,
  } = {
    ...DEFAULT_CONFIG,
    ...config,
  }

  const getInitialState = useCallback(() => {
    if (storageKey) {
      const stored = sessionStorageWrapper.getItem(storageKey)
      const storedState = stored ? JSON.parse(stored) : null

      if (storedState?.size && storedState?.position) {
        return storedState
      }
    }

    return {
      size: {
        width: initialWidth,
        height: initialHeight,
      },
      position: {
        x: window.innerWidth - initialWidth - margin,
        y: window.innerHeight - initialHeight - margin,
      },
    }
  }, [
    initialWidth,
    initialHeight,
    margin,
    storageKey,
  ])

  const [isResizing, setIsResizing] = useState(false)
  const [size, setSize] = useState(() => getInitialState().size)
  const [position, setPosition] = useState(() => getInitialState().position)

  const resizeStartDataRef = useRef(null)

  useEffect(() => {
    if (isVisible) {
      const { size: newSize, position: newPosition } = getInitialState()
      setSize(newSize)
      setPosition(newPosition)
    }
  }, [isVisible, getInitialState])

  const handleResizeStart = useCallback(() => {
    setIsResizing(true)
    resizeStartDataRef.current = {
      position: { ...position },
      size: { ...size },
    }
  }, [position, size])

  const handleResize = useCallback((e, direction, ref, delta) => {
    if (!resizeStartDataRef.current) return

    const { position: startPosition, size: startSize } = resizeStartDataRef.current
    let newX = startPosition.x
    let newY = startPosition.y
    let newWidth = startSize.width + delta.width
    let newHeight = startSize.height + delta.height

    if (TOP_DIRECTIONS.includes(direction)) {
      const rawY = startPosition.y - delta.height
      newY = Math.max(rawY, minTopPosition)
      newHeight = startSize.height + startPosition.y - newY
      ref.style.height = `${newHeight}px`
    }

    if (LEFT_DIRECTIONS.includes(direction)) {
      const rawX = startPosition.x - delta.width
      newX = Math.max(rawX, 0)
      newWidth = startSize.width + startPosition.x - newX
      ref.style.width = `${newWidth}px`
    }

    setPosition({
      x: newX,
      y: newY,
    })
  }, [minTopPosition])

  const handleResizeStop = useCallback((e, direction, ref) => {
    setIsResizing(false)
    const newSize = {
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    }
    setSize(newSize)

    if (storageKey) {
      sessionStorageWrapper.setItem(storageKey, JSON.stringify({
        size: newSize,
        position,
      }))
    }

    resizeStartDataRef.current = null
  }, [position, storageKey])

  const updatePosition = useCallback((newPosition) => {
    setPosition(newPosition)

    if (storageKey) {
      sessionStorageWrapper.setItem(storageKey, JSON.stringify({
        size,
        position: newPosition,
      }))
    }
  }, [size, storageKey])

  const resizableProps = useMemo(() => ({
    enable: RESIZE_ENABLE,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    onResize: handleResize,
    onResizeStart: handleResizeStart,
    onResizeStop: handleResizeStop,
    size,
  }), [
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    handleResize,
    handleResizeStart,
    handleResizeStop,
    size,
  ])

  return {
    isResizing,
    size,
    position,
    updatePosition,
    resizableProps,
  }
}

export {
  useModalResize,
}
