
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import {
  addActivePolygons as documentAddActivePolygons,
  clearActivePolygons as documentClearActivePolygons,
  highlightPolygonCoordsField as documentHighlightPolygonCoordsField,
  highlightTableCoordsField as documentHighlightTableCoordsField,
  setHighlightedField as documentSetHighlightedField,
} from '@/actions/documentReviewPage'
import {
  addActivePolygons as fileAddActivePolygons,
  clearActivePolygons as fileClearActivePolygons,
  highlightPolygonCoordsField as fileHighlightPolygonCoordsField,
  highlightTableCoordsField as fileHighlightTableCoordsField,
  setHighlightedField as fileSetHighlightedField,
} from '@/actions/fileReviewPage'
import { useReviewActions } from './useReviewActions'

jest.mock('@/utils/env', () => mockEnv)

const mockUseParams = jest.fn()
jest.mock('react-router', () => ({
  useParams: () => mockUseParams(),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns file actions when fileId is present in route params', () => {
  mockUseParams.mockReturnValue({ fileId: 'file-123' })

  const { result } = renderHook(() => useReviewActions())

  expect(result.current.clearActivePolygons).toBe(fileClearActivePolygons)
  expect(result.current.addActivePolygons).toBe(fileAddActivePolygons)
  expect(result.current.setHighlightedField).toBe(fileSetHighlightedField)
  expect(result.current.highlightPolygonCoordsField).toBe(fileHighlightPolygonCoordsField)
  expect(result.current.highlightTableCoordsField).toBe(fileHighlightTableCoordsField)
})

test('returns document actions when fileId is absent from route params', () => {
  mockUseParams.mockReturnValue({})

  const { result } = renderHook(() => useReviewActions())

  expect(result.current.clearActivePolygons).toBe(documentClearActivePolygons)
  expect(result.current.addActivePolygons).toBe(documentAddActivePolygons)
  expect(result.current.setHighlightedField).toBe(documentSetHighlightedField)
  expect(result.current.highlightPolygonCoordsField).toBe(documentHighlightPolygonCoordsField)
  expect(result.current.highlightTableCoordsField).toBe(documentHighlightTableCoordsField)
})
