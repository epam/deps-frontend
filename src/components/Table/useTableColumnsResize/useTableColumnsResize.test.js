
import { mockLocalStorageWrapper } from '@/mocks/mockLocalStorageWrapper'
import { renderHook, act } from '@testing-library/react-hooks'
import { TABLE_COLUMN_WIDTHS } from '@/constants/storage'
import { localStorageWrapper } from '@/utils/localStorageWrapper'
import { useTableColumnsResize } from './useTableColumnsResize'

jest.mock('@/utils/localStorageWrapper', () => mockLocalStorageWrapper())

afterEach(() => {
  jest.clearAllMocks()
})

test('initial widths default to provided width or 150 when missing', () => {
  const columns = [
    {
      title: 'A',
      dataIndex: 'a',
    },
    {
      title: 'B',
      dataIndex: 'b',
      width: 120,
    },
  ]

  const { result } = renderHook(({ cols }) => useTableColumnsResize(cols), {
    initialProps: { cols: columns },
  })

  expect(result.current.processedColumns[0].width).toBe(150)
  expect(result.current.processedColumns[1].width).toBe(120)
})

test('resizes adjacent columns with clamping to min width', () => {
  const columns = [
    {
      title: 'A',
      dataIndex: 'a',
      width: 100,
    },
    {
      title: 'B',
      dataIndex: 'b',
      width: 120,
    },
  ]

  const { result } = renderHook(({ cols }) => useTableColumnsResize(cols), {
    initialProps: { cols: columns },
  })

  act(() => {
    const headerA = result.current.processedColumns[0].onHeaderCell(result.current.processedColumns[0])
    headerA.onResize({ movementX: 30 })
  })

  expect(result.current.processedColumns[0].width).toBe(130)
  expect(result.current.processedColumns[1].width).toBe(90)

  act(() => {
    const headerA = result.current.processedColumns[0].onHeaderCell(result.current.processedColumns[0])
    headerA.onResize({ movementX: -50 })
  })

  expect(result.current.processedColumns[0].width).toBe(80)
  expect(result.current.processedColumns[1].width).toBe(140)
})

test('last column is not directly resizable but still changes as dependent column', () => {
  const columns = [
    {
      title: 'A',
      dataIndex: 'a',
      width: 100,
    },
    {
      title: 'B',
      dataIndex: 'b',
      width: 120,
    },
    {
      title: 'C',
      dataIndex: 'c',
      width: 140,
    },
  ]

  const { result } = renderHook(({ cols }) => useTableColumnsResize(cols), {
    initialProps: { cols: columns },
  })

  expect(result.current.processedColumns[2].onHeaderCell).toBeUndefined()

  act(() => {
    const headerB = result.current.processedColumns[1].onHeaderCell(result.current.processedColumns[1])
    headerB.onResize({ movementX: -40 })
  })

  expect(result.current.processedColumns[1].width).toBe(80)
  expect(result.current.processedColumns[2].width).toBe(180)
})

test('does not expose onHeaderCell if current or next column has disableResize', () => {
  const columns = [
    {
      title: 'A',
      dataIndex: 'a',
      width: 100,
      disableResize: true,
    },
    {
      title: 'B',
      dataIndex: 'b',
      width: 120,
    },
    {
      title: 'C',
      dataIndex: 'c',
      width: 140,
      disableResize: true,
    },
  ]

  const { result, rerender } = renderHook(({ cols }) => useTableColumnsResize(cols), {
    initialProps: { cols: columns },
  })

  expect(result.current.processedColumns[0].onHeaderCell).toBeUndefined()

  columns[0].disableResize = false
  columns[1].disableResize = true
  rerender({ cols: columns })

  expect(result.current.processedColumns[0].onHeaderCell).toBeUndefined()
})

test('isResizing toggles via onResizeStart and onResizeStop', () => {
  jest.useFakeTimers()

  const columns = [
    {
      title: 'A',
      dataIndex: 'a',
      width: 100,
    },
    {
      title: 'B',
      dataIndex: 'b',
      width: 120,
    },
  ]

  const { result } = renderHook(({ cols }) => useTableColumnsResize(cols), {
    initialProps: { cols: columns },
  })

  expect(result.current.isResizing).toBe(false)

  act(() => {
    const headerA = result.current.processedColumns[0].onHeaderCell(result.current.processedColumns[0])
    headerA.onResizeStart()
  })
  expect(result.current.isResizing).toBe(true)

  const headerA = result.current.processedColumns[0].onHeaderCell(result.current.processedColumns[0])
  headerA.onResizeStop()

  act(() => {
    jest.runOnlyPendingTimers()
  })

  expect(result.current.isResizing).toBe(false)

  jest.useRealTimers()
})

test('loads saved widths from localStorage on init and applies them (with storageId prop)', () => {
  const columns = [
    {
      title: 'A',
      dataIndex: 'a',
      width: 100,
    },
    {
      title: 'B',
      dataIndex: 'b',
      width: 120,
    },
  ]

  const mockStorageId = 'table-1'

  localStorageWrapper.getItem.mockReturnValue({ a: 222 })

  const { result } = renderHook(
    ({ cols, sid }) => useTableColumnsResize(cols, sid),
    {
      initialProps: {
        cols: columns,
        sid: mockStorageId,
      },
    },
  )

  expect(localStorageWrapper.getItem).toHaveBeenCalledWith(`${TABLE_COLUMN_WIDTHS}:${mockStorageId}`)
  expect(result.current.processedColumns[0].width).toBe(222)
  expect(result.current.processedColumns[1].width).toBe(120)
})

test('loads saved widths from localStorage on init and applies them (without storageId prop)', () => {
  const columns = [
    {
      title: 'A',
      dataIndex: 'a',
      width: 100,
    },
    {
      title: 'B',
      dataIndex: 'b',
      width: 120,
    },
  ]

  localStorageWrapper.getItem.mockReturnValue({ a: 222 })

  const { result } = renderHook(
    ({ cols }) => useTableColumnsResize(cols),
    { initialProps: { cols: columns } },
  )

  expect(localStorageWrapper.getItem).toHaveBeenCalledWith(`${TABLE_COLUMN_WIDTHS}:a|b`)
  expect(result.current.processedColumns[0].width).toBe(222)
  expect(result.current.processedColumns[1].width).toBe(120)
})

test('saves widths to localStorage on resize stop', () => {
  jest.useFakeTimers()

  const columns = [
    {
      title: 'A',
      dataIndex: 'a',
      width: 150,
    },
    {
      title: 'B',
      dataIndex: 'b',
      width: 150,
    },
  ]

  const mockStorageId = 'table-1'

  localStorageWrapper.getItem.mockReturnValue(null)

  const { result } = renderHook(
    ({ cols, sid }) => useTableColumnsResize(cols, sid),
    {
      initialProps: {
        cols: columns,
        sid: mockStorageId,
      },
    },
  )

  act(() => {
    const headerA = result.current.processedColumns[0].onHeaderCell(result.current.processedColumns[0])
    headerA.onResizeStart()
    headerA.onResize({ movementX: 20 })
  })

  const freshHeaderA = result.current.processedColumns[0].onHeaderCell(result.current.processedColumns[0])

  act(() => {
    freshHeaderA.onResizeStop()
    jest.runOnlyPendingTimers()
  })

  expect(localStorageWrapper.setItem).toHaveBeenCalledWith(
    `${TABLE_COLUMN_WIDTHS}:${mockStorageId}`,
    {
      a: 170,
      b: 130,
    },
  )

  jest.useRealTimers()
})
