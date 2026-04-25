
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { fireEvent } from '@testing-library/react'
import { useParams } from 'react-router'
import { highlightPolygonCoordsField } from '@/actions/fileReviewPage'
import { useFetchFileUnifiedDataQuery } from '@/apiRTK/filesApi'
import { KeyCode } from '@/enums/KeyCode'
import { render } from '@/utils/rendererRTL'
import { FileImagePreviewHotkeys } from './FileImagePreviewHotkeys'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => mockReactRedux)

jest.mock('react-router', () => ({
  useParams: jest.fn(),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileUnifiedDataQuery: jest.fn(),
}))

jest.mock('@/actions/fileReviewPage', () => ({
  highlightPolygonCoordsField: jest.fn(),
}))

const mockFileId = 'test-file-id'
const mockDispatch = jest.fn()
const mockHighlightPolygonCoordsFieldAction = {
  type: 'DOCUMENT_REVIEW_PAGE/HIGHLIGHT_POLYGON_COORDS_FIELD',
}

const mockUnifiedData = {
  1: [{ id: 'source-1' }],
  2: [{ id: 'source-2' }],
}

beforeEach(() => {
  jest.clearAllMocks()

  mockReactRedux.useDispatch.mockReturnValue(mockDispatch)

  useParams.mockReturnValue({ fileId: mockFileId })

  highlightPolygonCoordsField.mockReturnValue(mockHighlightPolygonCoordsFieldAction)

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: mockUnifiedData,
  })
})

test('renders WindowListener with onKeyDown handler', () => {
  mockReactRedux.useSelector.mockReturnValue(2)

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: {
      1: [{ id: 'source-1' }],
      2: [{ id: 'source-2' }],
    },
  })

  const { container } = render(<FileImagePreviewHotkeys />)

  expect(container).toBeInTheDocument()
})

test('calls dispatch with decremented page when left arrow key is pressed on page 2', () => {
  mockReactRedux.useSelector.mockReturnValue(2)

  render(<FileImagePreviewHotkeys />)

  fireEvent.keyDown(window, {
    keyCode: KeyCode.LEFT_ARROW,
  })

  expect(highlightPolygonCoordsField).toHaveBeenCalledTimes(1)
  expect(highlightPolygonCoordsField).toHaveBeenCalledWith({
    page: 1,
    unifiedData: mockUnifiedData,
  })
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(mockHighlightPolygonCoordsFieldAction)
})

test('calls dispatch with decremented page when Shift+A is pressed on page 2', () => {
  mockReactRedux.useSelector.mockReturnValue(2)

  render(<FileImagePreviewHotkeys />)

  fireEvent.keyDown(window, {
    keyCode: KeyCode.A,
    shiftKey: true,
  })

  expect(highlightPolygonCoordsField).toHaveBeenCalledTimes(1)
  expect(highlightPolygonCoordsField).toHaveBeenCalledWith({
    page: 1,
    unifiedData: mockUnifiedData,
  })
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(mockHighlightPolygonCoordsFieldAction)
})

test('does not call dispatch when left arrow key is pressed on initial page', () => {
  mockReactRedux.useSelector.mockReturnValue(1)

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: {
      1: [{ id: 'source-1' }],
    },
  })

  render(<FileImagePreviewHotkeys />)

  fireEvent.keyDown(window, {
    keyCode: KeyCode.LEFT_ARROW,
  })

  expect(highlightPolygonCoordsField).not.toHaveBeenCalled()
  expect(mockDispatch).not.toHaveBeenCalled()
})

test('does not call dispatch when right arrow key is pressed on last page', () => {
  mockReactRedux.useSelector.mockReturnValue(1)

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: {
      1: [{ id: 'source-1' }],
    },
  })

  render(<FileImagePreviewHotkeys />)

  fireEvent.keyDown(window, {
    keyCode: KeyCode.RIGHT_ARROW,
  })

  expect(highlightPolygonCoordsField).not.toHaveBeenCalled()
  expect(mockDispatch).not.toHaveBeenCalled()
})

test('does not call dispatch when Shift+D is pressed on last page', () => {
  mockReactRedux.useSelector.mockReturnValue(1)

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: {
      1: [{ id: 'source-1' }],
    },
  })

  render(<FileImagePreviewHotkeys />)

  fireEvent.keyDown(window, {
    keyCode: KeyCode.D,
    shiftKey: true,
  })

  expect(highlightPolygonCoordsField).not.toHaveBeenCalled()
  expect(mockDispatch).not.toHaveBeenCalled()
})

test('does not call dispatch when key is pressed in input field', () => {
  mockReactRedux.useSelector.mockReturnValue(2)

  render(<FileImagePreviewHotkeys />)

  const input = document.createElement('input')
  document.body.appendChild(input)

  const event = new KeyboardEvent('keydown', {
    keyCode: KeyCode.LEFT_ARROW,
    bubbles: true,
  })
  Object.defineProperty(event, 'target', {
    value: input,
    enumerable: true,
  })

  input.dispatchEvent(event)

  expect(highlightPolygonCoordsField).not.toHaveBeenCalled()
  expect(mockDispatch).not.toHaveBeenCalled()

  document.body.removeChild(input)
})

test('does not call dispatch when key is pressed in textarea field', () => {
  mockReactRedux.useSelector.mockReturnValue(2)

  render(<FileImagePreviewHotkeys />)

  const textarea = document.createElement('textarea')
  document.body.appendChild(textarea)

  const event = new KeyboardEvent('keydown', {
    keyCode: KeyCode.RIGHT_ARROW,
    bubbles: true,
  })
  Object.defineProperty(event, 'target', {
    value: textarea,
    enumerable: true,
  })

  textarea.dispatchEvent(event)

  expect(highlightPolygonCoordsField).not.toHaveBeenCalled()
  expect(mockDispatch).not.toHaveBeenCalled()

  document.body.removeChild(textarea)
})

test('calls dispatch with incremented page when right arrow key is pressed on page 1', () => {
  mockReactRedux.useSelector.mockReturnValue(1)

  render(<FileImagePreviewHotkeys />)

  fireEvent.keyDown(window, {
    keyCode: KeyCode.RIGHT_ARROW,
  })

  expect(highlightPolygonCoordsField).toHaveBeenCalledTimes(1)
  expect(highlightPolygonCoordsField).toHaveBeenCalledWith({
    page: 2,
    unifiedData: mockUnifiedData,
  })
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(mockHighlightPolygonCoordsFieldAction)
})

test('calls dispatch with incremented page when Shift+D is pressed on page 1', () => {
  mockReactRedux.useSelector.mockReturnValue(1)

  render(<FileImagePreviewHotkeys />)

  fireEvent.keyDown(window, {
    keyCode: KeyCode.D,
    shiftKey: true,
  })

  expect(highlightPolygonCoordsField).toHaveBeenCalledTimes(1)
  expect(highlightPolygonCoordsField).toHaveBeenCalledWith({
    page: 2,
    unifiedData: mockUnifiedData,
  })
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(mockHighlightPolygonCoordsFieldAction)
})
