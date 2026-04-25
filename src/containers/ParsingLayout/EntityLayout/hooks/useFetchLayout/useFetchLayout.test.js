
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { useFetchDocumentLayoutQuery } from '@/apiRTK/documentLayoutApi'
import { useFetchFileLayoutQuery } from '@/apiRTK/fileLayoutApi'
import { DOCUMENT_LAYOUT_FEATURE, DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { PageLayout } from '@/models/DocumentLayout'
import { useLayoutData } from '../useLayoutData'
import { useFetchLayout } from './useFetchLayout'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/documentLayoutApi', () => ({
  useFetchDocumentLayoutQuery: jest.fn(() => ({
    data: mockLayout,
    isFetching: false,
    isError: false,
  })),
}))

jest.mock('@/apiRTK/fileLayoutApi', () => ({
  useFetchFileLayoutQuery: jest.fn(() => ({
    data: mockLayout,
    isFetching: false,
    isError: false,
  })),
}))

jest.mock('../useLayoutData', () => ({
  useLayoutData: jest.fn(() => ({
    layoutId: mockLayoutId,
    isFile: false,
  })),
}))

const mockLayoutId = 'layout-id-123'
const mockLayout = {
  pages: [
    new PageLayout({
      id: 'page1',
      paragraphs: [],
      tables: [],
      keyValuePairs: [],
      images: [],
      pageNumber: 1,
    }),
  ],
}

const mockDocumentLayoutResponse = {
  data: mockLayout,
  isFetching: false,
  isError: false,
}

const mockFileLayoutResponse = {
  data: mockLayout,
  isFetching: false,
  isError: false,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('calls useFetchDocumentLayoutQuery when isFile is false', () => {
  renderHook(() =>
    useFetchLayout({
      parsingFeature: DOCUMENT_LAYOUT_FEATURE.TEXT,
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      batchIndex: 0,
      batchSize: 1,
    }),
  )

  expect(useFetchDocumentLayoutQuery).toHaveBeenCalledWith(
    {
      documentId: mockLayoutId,
      features: [DOCUMENT_LAYOUT_FEATURE.TEXT],
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      batchIndex: 0,
      batchSize: 1,
    },
    {
      skip: false,
    },
  )

  expect(useFetchFileLayoutQuery).toHaveBeenCalledWith(
    expect.anything(),
    {
      skip: true,
    },
  )
})

test('calls useFetchFileLayoutQuery when isFile is true', () => {
  useLayoutData.mockReturnValueOnce({
    layoutId: mockLayoutId,
    isFile: true,
  })

  renderHook(() =>
    useFetchLayout({
      parsingFeature: DOCUMENT_LAYOUT_FEATURE.TEXT,
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      batchIndex: 0,
      batchSize: 1,
    }),
  )

  expect(useFetchFileLayoutQuery).toHaveBeenCalledWith(
    {
      fileId: mockLayoutId,
      features: [DOCUMENT_LAYOUT_FEATURE.TEXT],
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      batchIndex: 0,
      batchSize: 1,
    },
    {
      skip: false,
    },
  )

  expect(useFetchDocumentLayoutQuery).toHaveBeenCalledWith(
    expect.anything(),
    {
      skip: true,
    },
  )
})

test('returns document layout data when isFile is false', () => {
  const { result } = renderHook(() =>
    useFetchLayout({
      parsingFeature: DOCUMENT_LAYOUT_FEATURE.TEXT,
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      batchIndex: 0,
      batchSize: 1,
    }),
  )

  expect(result.current.data).toEqual(mockLayout)
  expect(result.current.isFetching).toBe(false)
  expect(result.current.isError).toBe(false)
})

test('returns file layout data when isFile is true', () => {
  useLayoutData.mockReturnValueOnce({
    layoutId: mockLayoutId,
    isFile: true,
  })

  const { result } = renderHook(() =>
    useFetchLayout({
      parsingFeature: DOCUMENT_LAYOUT_FEATURE.TEXT,
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      batchIndex: 0,
      batchSize: 1,
    }),
  )

  expect(result.current.data).toEqual(mockLayout)
  expect(result.current.isFetching).toBe(false)
  expect(result.current.isError).toBe(false)
})

test('returns isFetching true when document layout is loading', () => {
  useFetchDocumentLayoutQuery.mockReturnValueOnce({
    ...mockDocumentLayoutResponse,
    isFetching: true,
  })

  const { result } = renderHook(() =>
    useFetchLayout({
      parsingFeature: DOCUMENT_LAYOUT_FEATURE.TEXT,
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      batchIndex: 0,
      batchSize: 1,
    }),
  )

  expect(result.current.isFetching).toBe(true)
})

test('returns isError true when document layout fetch fails', () => {
  useFetchDocumentLayoutQuery.mockReturnValueOnce({
    ...mockDocumentLayoutResponse,
    isError: true,
  })

  const { result } = renderHook(() =>
    useFetchLayout({
      parsingFeature: DOCUMENT_LAYOUT_FEATURE.TEXT,
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      batchIndex: 0,
      batchSize: 1,
    }),
  )

  expect(result.current.isError).toBe(true)
})

test('returns isFetching true when file layout is loading', () => {
  useLayoutData.mockReturnValueOnce({
    layoutId: mockLayoutId,
    isFile: true,
  })

  useFetchFileLayoutQuery.mockReturnValueOnce({
    ...mockFileLayoutResponse,
    isFetching: true,
  })

  const { result } = renderHook(() =>
    useFetchLayout({
      parsingFeature: DOCUMENT_LAYOUT_FEATURE.TEXT,
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      batchIndex: 0,
      batchSize: 1,
    }),
  )

  expect(result.current.isFetching).toBe(true)
})

test('returns isError true when file layout fetch fails', () => {
  useLayoutData.mockReturnValueOnce({
    layoutId: mockLayoutId,
    isFile: true,
  })

  useFetchFileLayoutQuery.mockReturnValueOnce({
    ...mockFileLayoutResponse,
    isError: true,
  })

  const { result } = renderHook(() =>
    useFetchLayout({
      parsingFeature: DOCUMENT_LAYOUT_FEATURE.TEXT,
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      batchIndex: 0,
      batchSize: 1,
    }),
  )

  expect(result.current.isError).toBe(true)
})
