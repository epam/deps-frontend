
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { TABLE_COLUMN_WIDTHS } from '@/constants/storage'
import { localStorageWrapper } from '@/utils/localStorageWrapper'

const DEFAULT_MIN_WIDTH = 80
const DEFAULT_WIDTH = 150

const getColumnKey = (column, index) => (
  column?.key ?? column?.dataIndex ?? index
)

export const useTableColumnsResize = (columns = [], storageId) => {
  const [columnsWidth, setColumnsWidth] = useState({})
  const [isResizing, setIsResizing] = useState(false)
  const resizeStopTimeoutRef = useRef(null)

  const storageKey = useMemo(() => {
    const keyParts = columns.map((col, index) => getColumnKey(col, index))
    const base = keyParts.join('|')
    return storageId
      ? `${TABLE_COLUMN_WIDTHS}:${storageId}`
      : `${TABLE_COLUMN_WIDTHS}:${base}`
  }, [columns, storageId])

  const saveWidthsToStorage = useCallback(() => {
    localStorageWrapper.setItem(storageKey, columnsWidth)
  }, [storageKey, columnsWidth])

  /**
   * Clamps the resize delta so both adjacent columns respect their minimum widths.
   * When column A grows by delta, column B shrinks by the same amount.
   */
  const clampDelta = useCallback((prevA, prevB, minA, minB, delta) => {
    const minAllowedDelta = minA - prevA
    const maxAllowedDelta = prevB - minB

    if (delta < minAllowedDelta) return minAllowedDelta
    if (delta > maxAllowedDelta) return maxAllowedDelta
    return delta
  }, [])

  const resizeSingleColumn = useCallback((prev, key, minWidth, defaultWidth, delta) => {
    const prevWidth = prev[key] ?? defaultWidth
    const applied = Math.max(minWidth - prevWidth, delta)

    return {
      ...prev,
      [key]: Math.max(minWidth, prevWidth + applied),
    }
  }, [])

  const resizeColumnPair = useCallback((prev, key, dependentKey, minA, minB, defaultA, defaultB, delta) => {
    const prevA = prev[key] ?? defaultA
    const prevB = prev[dependentKey] ?? defaultB
    const applied = clampDelta(prevA, prevB, minA, minB, delta)

    return {
      ...prev,
      [key]: Math.max(minA, prevA + applied),
      [dependentKey]: Math.max(minB, prevB - applied),
    }
  }, [clampDelta])

  const handleResizePair = useCallback((key, dependentKey, column, dependentColumn) => (event) => {
    const minA = column?.minWidth ?? DEFAULT_MIN_WIDTH
    const minB = dependentColumn?.minWidth ?? DEFAULT_MIN_WIDTH
    const defaultA = column?.width ?? DEFAULT_WIDTH
    const defaultB = dependentColumn?.width ?? DEFAULT_WIDTH

    setColumnsWidth((prev) => {
      const delta = event?.movementX ?? 0

      if (!delta) return prev

      const hasDependent = (
        dependentKey != null &&
        dependentColumn != null &&
        !dependentColumn?.disableResize
      )

      if (!hasDependent) {
        return resizeSingleColumn(prev, key, minA, defaultA, delta)
      }

      return resizeColumnPair(prev, key, dependentKey, minA, minB, defaultA, defaultB, delta)
    })
  }, [resizeColumnPair, resizeSingleColumn])

  const handleResizeStart = useCallback(() => {
    setIsResizing(true)
  }, [])

  const handleResizeEnd = useCallback(() => {
    if (resizeStopTimeoutRef.current) {
      clearTimeout(resizeStopTimeoutRef.current)
      resizeStopTimeoutRef.current = null
    }

    resizeStopTimeoutRef.current = setTimeout(() => {
      setIsResizing(false)
      resizeStopTimeoutRef.current = null
      saveWidthsToStorage()
    }, 0)
  }, [saveWidthsToStorage])

  useEffect(() => () => {
    if (resizeStopTimeoutRef.current) {
      clearTimeout(resizeStopTimeoutRef.current)
      resizeStopTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    const loadWidthsFromStorage = () => {
      const parsed = localStorageWrapper.getItem(storageKey)

      if (!parsed) return

      const allowedKeys = new Set((columns).map((c, idx) => getColumnKey(c, idx)))
      const initialColumnsWidth = Object.keys(parsed).reduce((acc, key) => {
        if (allowedKeys.has(key)) {
          acc[key] = parsed[key]
        }
        return acc
      }, {})
      setColumnsWidth(initialColumnsWidth)
    }

    loadWidthsFromStorage()
  }, [storageKey, columns])

  const processedColumns = useMemo(() => (
    columns.map((col, index) => {
      const key = getColumnKey(col, index)
      const width = columnsWidth[key] ?? (col?.width ?? DEFAULT_WIDTH)
      const nextCol = columns[index + 1]
      const dependentKey = nextCol ? getColumnKey(nextCol, index + 1) : null

      if (col?.disableResize || nextCol?.disableResize || !nextCol) {
        return {
          ...col,
          width,
        }
      }

      return {
        ...col,
        width,
        onHeaderCell: (column) => ({
          width,
          resizableWidth: width,
          onResize: handleResizePair(key, dependentKey, column, nextCol),
          onResizeStart: handleResizeStart,
          onResizeStop: handleResizeEnd,
          isResizing,
        }),
      }
    })
  ), [
    columns,
    columnsWidth,
    handleResizePair,
    isResizing,
    handleResizeEnd,
    handleResizeStart,
  ])

  return {
    processedColumns,
    isResizing,
  }
}
