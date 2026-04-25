
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { renderHook } from '@testing-library/react-hooks'
import { useParams } from 'react-router'
import { useFetchParsingInfoQuery } from '@/apiRTK/documentLayoutApi'
import { useFetchFileParsingInfoQuery } from '@/apiRTK/fileLayoutApi'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { documentSelector } from '@/selectors/documentReviewPage'
import { LAYOUT_TYPE, useLayoutData } from './useLayoutData'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => mockReactRedux)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => mockParams),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileQuery: jest.fn(() => ({
    data: null,
  })),
}))

jest.mock('@/apiRTK/fileLayoutApi', () => ({
  useFetchFileParsingInfoQuery: jest.fn(() => ({
    isFetching: false,
    error: null,
  })),
}))

jest.mock('@/apiRTK/documentLayoutApi', () => ({
  useFetchParsingInfoQuery: jest.fn(() => ({
    isFetching: false,
    error: null,
  })),
}))

jest.mock('@/selectors/documentReviewPage')

const mockFile = {
  id: 'file-123',
  name: 'Test File',
  state: {
    status: 'IN_REVIEW',
  },
}

const mockParams = {
  documentId: documentSelector.getSelectorMockValue()._id,
  fileId: undefined,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns correct data when documentId is present', () => {
  const { result } = renderHook(() => useLayoutData())

  expect(result.current.layoutId).toBe(documentSelector.getSelectorMockValue()._id)
  expect(result.current.layoutType).toBe(LAYOUT_TYPE.DOCUMENT)
  expect(result.current.isFile).toBe(false)
  expect(result.current.document).toEqual(documentSelector.getSelectorMockValue())
  expect(result.current.file).toBe(null)
  expect(result.current.isParsingDataFetching).toBe(false)
  expect(result.current.isParsingDataError).toBe(null)
})

test('returns correct data when fileId is present', () => {
  const mockParams = {
    documentId: undefined,
    fileId: 'file-123',
  }

  useParams.mockReturnValueOnce(mockParams)

  useFetchFileQuery.mockReturnValueOnce({
    data: mockFile,
  })

  const { result } = renderHook(() => useLayoutData())

  expect(result.current.layoutId).toBe(mockParams.fileId)
  expect(result.current.layoutType).toBe(LAYOUT_TYPE.FILE)
  expect(result.current.isFile).toBe(true)
  expect(result.current.document).toEqual(documentSelector.getSelectorMockValue())
  expect(result.current.file).toEqual(mockFile)
  expect(result.current.isParsingDataFetching).toBe(false)
  expect(result.current.isParsingDataError).toBe(null)
})

test('calls useFetchFileQuery when fileId is present', () => {
  const mockParams = {
    documentId: undefined,
    fileId: 'file-123',
  }

  useParams.mockReturnValueOnce(mockParams)

  renderHook(() => useLayoutData())

  expect(useFetchFileQuery).toHaveBeenCalledWith(mockParams.fileId, { skip: false })
})

test('skips useFetchFileQuery when documentId is present', () => {
  renderHook(() => useLayoutData())

  expect(useFetchFileQuery).toHaveBeenCalledWith(
    documentSelector.getSelectorMockValue()._id,
    { skip: true },
  )
})

test('calls useFetchFileParsingInfoQuery when fileId is present', () => {
  const mockParams = {
    documentId: undefined,
    fileId: 'file-123',
  }

  useParams.mockReturnValueOnce(mockParams)

  renderHook(() => useLayoutData())

  expect(useFetchFileParsingInfoQuery).toHaveBeenCalledWith(mockParams.fileId, { skip: false })
})

test('skips useFetchFileParsingInfoQuery when documentId is present', () => {
  renderHook(() => useLayoutData())

  expect(useFetchFileParsingInfoQuery).toHaveBeenCalledWith(
    documentSelector.getSelectorMockValue()._id,
    { skip: true },
  )
})

test('calls useFetchParsingInfoQuery when documentId is present', () => {
  renderHook(() => useLayoutData())

  expect(useFetchParsingInfoQuery).toHaveBeenCalledWith(
    documentSelector.getSelectorMockValue()._id,
    { skip: false },
  )
})

test('skips useFetchParsingInfoQuery when documentId is not present', () => {
  const mockParams = {
    documentId: undefined,
    fileId: 'file-123',
  }

  useParams.mockReturnValueOnce(mockParams)

  renderHook(() => useLayoutData())

  expect(useFetchParsingInfoQuery).toHaveBeenCalledWith(mockParams.fileId, { skip: true })
})

test('returns correct isParsingDataFetching as true when file query is fetching', () => {
  useFetchFileParsingInfoQuery.mockReturnValueOnce({
    isFetching: true,
    error: null,
  })

  const { result } = renderHook(() => useLayoutData())

  expect(result.current.isParsingDataFetching).toBe(true)
})

test('returns correct isParsingDataFetching as true when document query is fetching', () => {
  useFetchParsingInfoQuery.mockReturnValueOnce({
    isFetching: true,
    error: null,
  })

  const { result } = renderHook(() => useLayoutData())

  expect(result.current.isParsingDataFetching).toBe(true)
})

test('returns correct isParsingDataError as true when file query has error', () => {
  const error = new Error()

  useFetchFileParsingInfoQuery.mockReturnValue({
    isFetching: false,
    error,
  })

  const { result } = renderHook(() => useLayoutData())

  expect(result.current.isParsingDataError).toEqual(error)
})

test('returns correct isParsingDataError as true when document query has error', () => {
  const error = new Error()

  useFetchParsingInfoQuery.mockReturnValueOnce({
    isFetching: false,
    error,
  })

  const { result } = renderHook(() => useLayoutData())

  expect(result.current.isParsingDataError).toEqual(error)
})

test('returns document from selector when documentId is present', () => {
  const { result } = renderHook(() => useLayoutData())

  expect(result.current.document).toEqual(documentSelector.getSelectorMockValue())
})

test('returns file from query when fileId is present', () => {
  const mockParams = {
    documentId: undefined,
    fileId: 'file-123',
  }

  useParams.mockReturnValueOnce(mockParams)

  useFetchFileQuery.mockReturnValueOnce({
    data: mockFile,
  })

  const { result } = renderHook(() => useLayoutData())

  expect(result.current.file).toEqual(mockFile)
})
