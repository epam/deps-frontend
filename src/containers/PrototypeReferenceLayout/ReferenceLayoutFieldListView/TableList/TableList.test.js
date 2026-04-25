
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { useFetchDocumentLayout } from '@/containers/PrototypeReferenceLayout/useFetchDocumentLayout'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { PageLayout, TableCellLayout, TableLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { render } from '@/utils/rendererRTL'
import { TableList } from './TableList'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/components/NoData', () => mockShallowComponent('NoData'))
jest.mock('./TableItem', () => mockShallowComponent('TableItem'))
jest.mock('@/containers/InView', () => ({
  InView: jest.fn(({ children }) => (
    <div>{children}</div>
  )),
}))

jest.mock('@/selectors/prototypePage')

jest.mock('@/containers/PrototypeReferenceLayout/useFetchDocumentLayout', () => ({
  useFetchDocumentLayout: jest.fn(() => ({
    isLoading: false,
    documentLayout: mockLayout,
    pagesCount: 1,
  })),
}))

const mockCell = new TableCellLayout({
  content: 'Cell content',
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 1,
  rowIndex: 0,
  rowSpan: 1,
  page: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockTable = new TableLayout({
  id: 'id1',
  order: 1,
  cells: [mockCell],
  confidence: 0,
  columnCount: 1,
  rowCount: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockLayout = {
  pages: [
    new PageLayout({
      id: 'mockId',
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      pageNumber: 1,
      images: [],
      paragraphs: [],
      keyValuePairs: [],
      tables: [mockTable],
    }),
  ],
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('shows spinner when document layout is loading', async () => {
  useFetchDocumentLayout.mockReturnValue({
    documentLayout: null,
    isLoading: true,
    pagesCount: 0,
  })

  render(<TableList isEditMode />)

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('shows empty layout content when all batches were loaded and there are no tables', () => {
  const mockEmptyLayout = {
    pages: [
      new PageLayout({
        id: 'mockId',
        parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
        pageNumber: 1,
        images: [],
        paragraphs: [],
        keyValuePairs: [],
        tables: [],
      }),
    ],
  }

  useFetchDocumentLayout.mockReturnValue({
    documentLayout: mockEmptyLayout,
    isLoading: false,
    pagesCount: 1,
  })

  render(<TableList isEditMode />)

  expect(screen.getByTestId('NoData')).toBeInTheDocument()
})

test('renders table correctly', () => {
  useFetchDocumentLayout.mockReturnValueOnce({
    documentLayout: mockLayout,
    isLoading: false,
    pagesCount: 1,
  })

  render(<TableList isEditMode />)

  expect(screen.getByTestId('TableItem')).toBeInTheDocument()
})
