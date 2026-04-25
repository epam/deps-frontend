
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { renderHook } from '@testing-library/react-hooks'
import { useFetchFileUnifiedDataQuery } from '@/apiRTK/filesApi'
import { useLayoutData } from '../useLayoutData'
import { useHighlightCoords } from './useHighlightCoords'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))

const mockHighlightPolygonCoordsField = jest.fn()
const mockClearActivePolygons = jest.fn()
const mockSetHighlightedField = jest.fn()

jest.mock('@/containers/ParsingLayout/hooks', () => ({
  useReviewActions: () => ({
    highlightPolygonCoordsField: mockHighlightPolygonCoordsField,
    clearActivePolygons: mockClearActivePolygons,
    setHighlightedField: mockSetHighlightedField,
  }),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileUnifiedDataQuery: jest.fn(() => ({
    data: null,
  })),
}))

jest.mock('../useLayoutData', () => ({
  useLayoutData: jest.fn(),
}))

const mockDispatch = jest.fn()
const mockUnifiedData = {
  id: 'unified-data-1',
  data: 'test-data',
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns highlightCoords and unhighlightCoords functions', () => {
  useLayoutData.mockReturnValueOnce({
    isFile: false,
    layoutId: 'doc-123',
  })

  const { result } = renderHook(() => useHighlightCoords())

  expect(result.current.highlightCoords).toEqual(expect.any(Function))
  expect(result.current.unhighlightCoords).toEqual(expect.any(Function))
})

test('calls highlightPolygonCoordsField with correct args', () => {
  useLayoutData.mockReturnValueOnce({
    isFile: false,
    layoutId: 'doc-123',
  })

  const { result } = renderHook(() => useHighlightCoords())

  const mockParams = {
    field: 'field-1',
    page: 1,
    sourceId: 'source-1',
  }

  result.current.highlightCoords(mockParams)

  expect(mockDispatch).toHaveBeenCalled()
  expect(mockHighlightPolygonCoordsField).toHaveBeenCalledWith({
    ...mockParams,
    unifiedData: null,
  })
})

test('calls useFetchFileUnifiedDataQuery when isFile is true', () => {
  useLayoutData.mockReturnValueOnce({
    isFile: true,
    layoutId: 'file-123',
  })

  useFetchFileUnifiedDataQuery.mockReturnValueOnce({
    data: mockUnifiedData,
  })

  renderHook(() => useHighlightCoords())

  expect(useFetchFileUnifiedDataQuery).toHaveBeenCalledWith('file-123', { skip: false })
})

test('skips useFetchFileUnifiedDataQuery when isFile is false', () => {
  useLayoutData.mockReturnValueOnce({
    isFile: false,
    layoutId: 'doc-123',
  })

  renderHook(() => useHighlightCoords())

  expect(useFetchFileUnifiedDataQuery).toHaveBeenCalledWith('doc-123', { skip: true })
})

test('uses unifiedData from query when calling highlightPolygonCoordsField', () => {
  const customUnifiedData = {
    id: 'custom-unified-data',
    data: 'custom-data',
  }

  useLayoutData.mockReturnValueOnce({
    isFile: true,
    layoutId: 'file-123',
  })

  useFetchFileUnifiedDataQuery.mockReturnValueOnce({
    data: customUnifiedData,
  })

  const { result } = renderHook(() => useHighlightCoords())

  const mockParams = {
    field: 'field-1',
    page: 1,
    sourceId: 'source-1',
  }

  result.current.highlightCoords(mockParams)

  expect(mockHighlightPolygonCoordsField).toHaveBeenCalledWith({
    ...mockParams,
    unifiedData: customUnifiedData,
  })
})
