
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import {
  addActivePolygons,
  clearActivePolygons,
  clearFileStore,
  highlightPolygonCoordsField,
  highlightTableCoordsField,
  setHighlightedField,
} from '@/actions/fileReviewPage'
import { setUi } from '@/actions/navigation'
import { UiKeys } from '@/constants/navigation'
import { Point } from '@/models/Point'
import { UnifiedData } from '@/models/UnifiedData'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => ({
  ENV: mockEnv.ENV,
}))
jest.mock('@/actions/navigation', () => ({
  setUi: jest.fn(),
}))

const mockSourceId = '12345'
const mockPage = 100
const mockFoundPageBySourceId = 1
const mockCoords = [[1, 1], [2, 3]]
const mockPolygonCoords = [[
  new Point(0, 0),
  new Point(0.1, 0.2),
]]

let dispatch

beforeEach(() => {
  UnifiedData.getPageBySourceId = jest.fn(() => mockFoundPageBySourceId)
  UnifiedData.getBboxSourceIdByPage = jest.fn(() => mockSourceId)
  dispatch = jest.fn()
})

test('setHighlightedField creates action with correct type and payload', () => {
  const mockField = [[new Point(0, 0), new Point(0.1, 0.2)]]
  const action = setHighlightedField(mockField)
  expect(action.type).toBe('FILE_REVIEW_PAGE/SET_HIGHLIGHTED_FIELD')
  expect(action.payload).toEqual(mockField)
})

test('clearActivePolygons creates action with correct type', () => {
  const action = clearActivePolygons()
  expect(action.type).toBe('FILE_REVIEW_PAGE/CLEAR_ACTIVE_POLYGONS')
})

test('addActivePolygons creates action with correct type and payload', () => {
  const mockPolygon = [[new Point(0, 0), new Point(0.1, 0.2)]]
  const action = addActivePolygons(mockPolygon)
  expect(action.type).toBe('FILE_REVIEW_PAGE/ADD_ACTIVE_POLYGONS')
  expect(action.payload).toEqual(mockPolygon)
})

test('clearFileStore creates action with correct type', () => {
  const action = clearFileStore()
  expect(action.type).toBe('FILE_REVIEW_PAGE/CLEAR_FILE_STORE')
})

test('highlightTableCoordsField dispatches setUi with correct args when field and page were passed', () => {
  highlightTableCoordsField({
    field: mockCoords,
    page: mockPage,
  })(dispatch)
  expect(dispatch).nthCalledWith(1, setUi({
    [UiKeys.ACTIVE_PAGE]: mockPage,
    [UiKeys.ACTIVE_SOURCE_ID]: undefined,
  }))
})

test('highlightTableCoordsField dispatches setUi with correct args when field, page and sourceId were passed', () => {
  highlightTableCoordsField({
    field: mockCoords,
    page: mockPage,
    sourceId: mockSourceId,
  })(dispatch)
  expect(dispatch).nthCalledWith(1, setUi({
    [UiKeys.ACTIVE_PAGE]: mockPage,
    [UiKeys.ACTIVE_SOURCE_ID]: mockSourceId,
  }))
})

test('highlightTableCoordsField dispatches setHighlightedField with correct args', () => {
  highlightTableCoordsField({
    field: mockCoords,
    page: mockPage,
  })(dispatch)
  expect(dispatch).nthCalledWith(2, setHighlightedField(mockCoords))
})

test('highlightTableCoordsField dispatches clearActivePolygons', () => {
  highlightTableCoordsField({
    field: mockCoords,
    page: mockPage,
  })(dispatch)
  expect(dispatch).nthCalledWith(3, clearActivePolygons())
})

test('highlightPolygonCoordsField dispatches setUi with correct args when field and page were passed', () => {
  highlightPolygonCoordsField({
    field: mockPolygonCoords,
    page: mockPage,
  })(dispatch)
  expect(dispatch).nthCalledWith(1, setUi({
    [UiKeys.ACTIVE_PAGE]: mockPage,
    [UiKeys.ACTIVE_SOURCE_ID]: mockSourceId,
  }))
})

test('highlightPolygonCoordsField dispatches setUi with correct args when field and sourceId were passed', () => {
  highlightPolygonCoordsField({
    field: mockPolygonCoords,
    sourceId: mockSourceId,
    unifiedData: {},
  })(dispatch)
  expect(dispatch).nthCalledWith(1, setUi({
    [UiKeys.ACTIVE_PAGE]: mockFoundPageBySourceId,
    [UiKeys.ACTIVE_SOURCE_ID]: mockSourceId,
  }))
})

test('highlightPolygonCoordsField dispatches setHighlightedField with correct args', () => {
  highlightPolygonCoordsField({
    field: mockPolygonCoords,
    page: mockPage,
  })(dispatch)
  expect(dispatch).nthCalledWith(
    2,
    setHighlightedField(mockPolygonCoords),
  )
})

test('highlightPolygonCoordsField dispatches clearActivePolygons', () => {
  highlightPolygonCoordsField({
    field: mockPolygonCoords,
    page: mockPage,
  })(dispatch)
  expect(dispatch).nthCalledWith(3, clearActivePolygons())
})
