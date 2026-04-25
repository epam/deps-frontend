
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { renderHook } from '@testing-library/react-hooks'
import { useFetchDocumentLayoutQuery, useFetchParsingInfoQuery } from '@/apiRTK/documentLayoutApi'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { Localization, localize } from '@/localization/i18n'
import { MergedTableInfo, PageLayout } from '@/models/DocumentLayout'
import { DocumentLayoutInfo, DocumentParsingInfo } from '@/models/DocumentParsingInfo'
import { notifyWarning } from '@/utils/notification'
import { useFetchDocumentLayout } from './useFetchDocumentLayout'

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/documentLayoutApi', () => ({
  useFetchDocumentLayoutQuery: jest.fn(() => ({
    data: mockLayout,
    isFetching: false,
    error: null,
  })),
  useFetchParsingInfoQuery: jest.fn(() => ({
    data: mockParsingInfo,
    isFetching: false,
    error: null,
  })),
}))

const mockMergedTables = [
  new MergedTableInfo({
    pageNumber: 1,
    tableId: 'tableId',
  }),
]

const mockParsingInfo = new DocumentParsingInfo({
  layoutId: 'mockId',
  documentLayoutInfo: new DocumentLayoutInfo({
    documentLayoutId: 'mockId',
    parsingFeatures: {
      [DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT]: [KnownParsingFeature.TEXT],
    },
    mergedTables: {
      [DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT]: [{
        tables: mockMergedTables,
      }],
    },
  }),
})

const mockLayout = {
  pages: [
    new PageLayout({
      id: '1',
      pageNumber: 2,
      images: [],
      paragraphs: [],
      tables: [],
      keyValuePairs: [],
    }),
  ],
}

const props = {
  layoutId: 'test-layout-id',
  features: [KnownParsingFeature.TABLES],
  batchIndex: 0,
  batchSize: 10,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns expected data when queries succeed', () => {
  useFetchParsingInfoQuery.mockReturnValueOnce({
    data: mockParsingInfo,
    isFetching: false,
    error: null,
  })

  useFetchDocumentLayoutQuery.mockReturnValueOnce({
    data: mockLayout,
    isFetching: false,
    error: null,
  })

  const { result } = renderHook(() =>
    useFetchDocumentLayout(props),
  )

  expect(result.current.isLoading).toBe(false)
  expect(result.current.documentLayout).toEqual(mockLayout)
  expect(result.current.parsingType).toBe(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT)
  expect(result.current.mergedTables).toEqual([{
    tables: mockMergedTables,
  }])
})

test('shows warning when fetch parsingInfo failed', () => {
  useFetchParsingInfoQuery.mockReturnValueOnce({
    data: null,
    isFetching: false,
    error: new Error('Parsing error'),
  })

  renderHook(() => useFetchDocumentLayout(props))

  expect(notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
})

test('shows warning when fetch documentLayout failed', () => {
  useFetchDocumentLayoutQuery.mockReturnValueOnce({
    data: mockLayout,
    isFetching: false,
    error: new Error('Document Layout Error'),
  })

  renderHook(() => useFetchDocumentLayout(props))

  expect(notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
})
