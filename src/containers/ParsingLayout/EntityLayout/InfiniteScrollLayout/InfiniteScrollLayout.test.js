
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/react'
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils'
import { useFetchLayout } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_FEATURE, DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { Localization, localize } from '@/localization/i18n'
import { ParagraphLayout, PageLayout } from '@/models/DocumentLayout'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { InfiniteScrollLayout, TEST_ID } from './InfiniteScrollLayout'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/containers/ParsingLayout/EntityLayout/hooks', () => ({
  useFetchLayout: jest.fn(() => ({
    data: null,
    isFetching: false,
    isError: false,
  })),
}))

const mockSetLayout = jest.fn()

const mockParagraph = new ParagraphLayout({
  id: 'p1',
  order: 1,
  content: 'paragraph',
  confidence: 1,
  role: 'role',
  polygon: [],
  lines: [],
})

const mockLayout = {
  pages: [
    new PageLayout({
      id: 'page1',
      paragraphs: [mockParagraph],
      tables: [],
      keyValuePairs: [],
      images: [],
      pageNumber: 1,
    }),
  ],
}

const defaultProps = {
  parsingFeature: DOCUMENT_LAYOUT_FEATURE.TEXT,
  parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
  setLayout: mockSetLayout,
  showEmpty: false,
  total: 1,
  children: <div>Test Content</div>,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('shows spinner while layout loading is in process', async () => {
  useFetchLayout.mockReturnValueOnce({
    data: null,
    isFetching: true,
    isError: false,
  })

  const props = {
    ...defaultProps,
    total: 0,
  }

  render(<InfiniteScrollLayout {...props} />)

  mockAllIsIntersecting(true)

  await waitFor(() => {
    expect(screen.getByTestId(TEST_ID.SPIN)).toBeInTheDocument()
  })

  expect(mockSetLayout).not.toHaveBeenCalled()
})

test('renders children correctly', () => {
  render(<InfiniteScrollLayout {...defaultProps} />)

  expect(screen.getByText('Test Content')).toBeInTheDocument()
})

test('displays NoData when showEmpty is true and all layout pages are already fetched', () => {
  useFetchLayout.mockReturnValueOnce({
    data: {
      pages: [],
    },
    isFetching: false,
    isError: false,
  })

  const props = {
    ...defaultProps,
    showEmpty: true,
  }

  render(<InfiniteScrollLayout {...props} />)

  expect(screen.getByText(localize(Localization.NO_DATA))).toBeInTheDocument()
})

test('calls notifyWarning with correct value when layout retrieving failed', async () => {
  useFetchLayout.mockReturnValueOnce({
    data: null,
    isFetching: false,
    isError: true,
  })

  const props = {
    ...defaultProps,
    total: 0,
  }

  render(<InfiniteScrollLayout {...props} />)

  await waitFor(() => {
    expect(notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
  })
})

test('displays InfiniteScroll when data is present and no fetching or error', () => {
  useFetchLayout.mockReturnValueOnce({
    data: mockLayout,
    isFetching: false,
    isError: false,
  })

  render(<InfiniteScrollLayout {...defaultProps} />)

  expect(screen.getByTestId(TEST_ID.INFINITE_SCROLL)).toBeInTheDocument()
})

test('calls useFetchLayout with correct parameters', () => {
  render(<InfiniteScrollLayout {...defaultProps} />)

  expect(useFetchLayout).toHaveBeenCalledWith({
    parsingFeature: DOCUMENT_LAYOUT_FEATURE.TEXT,
    parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
    batchIndex: 0,
    batchSize: 1,
  })
})

test('calls setLayout with mapped layout data when batch is loaded', async () => {
  useFetchLayout.mockReturnValueOnce({
    data: mockLayout,
    isFetching: false,
    isError: false,
  })

  render(<InfiniteScrollLayout {...defaultProps} />)

  await waitFor(() => {
    expect(mockSetLayout).toHaveBeenCalledWith([
      {
        pageId: 'page1',
        page: 1,
        layout: mockParagraph,
      },
    ])
  })
})

test('does not call setLayout when layout is still fetching', () => {
  useFetchLayout.mockReturnValueOnce({
    data: mockLayout,
    isFetching: true,
    isError: false,
  })

  render(<InfiniteScrollLayout {...defaultProps} />)

  expect(mockSetLayout).not.toHaveBeenCalled()
})

test('does not call setLayout when layout data is null', () => {
  useFetchLayout.mockReturnValueOnce({
    data: null,
    isFetching: false,
    isError: false,
  })

  render(<InfiniteScrollLayout {...defaultProps} />)

  expect(mockSetLayout).not.toHaveBeenCalled()
})

test('does not call setLayout when layout has no data for the parsing feature', () => {
  useFetchLayout.mockReturnValueOnce({
    data: {
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
    },
    isFetching: false,
    isError: false,
  })

  render(<InfiniteScrollLayout {...defaultProps} />)

  expect(mockSetLayout).not.toHaveBeenCalled()
})
