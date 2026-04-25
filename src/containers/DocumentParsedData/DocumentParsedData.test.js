
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { KnownTabularLayoutParsingType } from '@/enums/KnownTabularLayoutParsingType'
import {
  DocumentParsingInfo,
  DocumentLayoutInfo,
  TabularLayoutInfo,
} from '@/models/DocumentParsingInfo'
import { documentSelector } from '@/selectors/documentReviewPage'
import { render } from '@/utils/rendererRTL'
import { DocumentParsedData } from './DocumentParsedData'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ documentId: 'mockDocumentId' })),
}))
jest.mock('@/apiRTK/documentLayoutApi', () => ({
  useFetchParsingInfoQuery: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
}))
jest.mock('@/containers/ParsingLayout/TabularLayout', () => mockShallowComponent('TabularLayout'))
jest.mock('@/containers/DocumentLayout', () => mockShallowComponent('DocumentLayout'))

const tabularLayoutInfo = new TabularLayoutInfo({
  id: 'mockId',
  parsingType: KnownTabularLayoutParsingType.EXCEL,
  sheets: [],
})

const documentLayoutInfo = new DocumentLayoutInfo({
  documentLayoutId: 'mockId',
  parsingFeatures: {
    [DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT]: [KnownParsingFeature.TEXT],
  },
  pagesInfo: {
    [DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT]: { pagesCount: 1 },
  },
  mergedTables: {},
})

test('shows document layout when parsing info contains document layout info', async () => {
  const mockParsingInfo = new DocumentParsingInfo({
    layoutId: 'mockId',
    documentLayoutInfo,
    tabularLayoutInfo: null,
  })

  documentSelector.mockImplementation(() => ({
    _id: 'doc-id',
    parsingInfo: mockParsingInfo,
  }))

  render(
    <DocumentParsedData />,
  )

  expect(screen.getByTestId('DocumentLayout')).toBeInTheDocument()
})

test('shows tabular layout data when parsing info contains tabular layout info', async () => {
  const mockParsingInfo = new DocumentParsingInfo({
    layoutId: 'mockId',
    documentLayoutInfo: null,
    tabularLayoutInfo,
  })

  documentSelector.mockImplementation(() => ({
    _id: 'doc-id',
    parsingInfo: mockParsingInfo,
  }))

  render(
    <DocumentParsedData />,
  )

  expect(screen.getByTestId('TabularLayout')).toBeInTheDocument()
})

test('shows document layout when there are no tabular or document layout', async () => {
  documentSelector.mockImplementation(() => ({
    _id: 'doc-id',
    parsingInfo: null,
  }))

  render(
    <DocumentParsedData />,
  )

  expect(screen.getByTestId('DocumentLayout')).toBeInTheDocument()
})

test('shows document layout when parsing info has no layout data', async () => {
  const mockParsingInfo = new DocumentParsingInfo({
    layoutId: 'mockId',
    documentLayoutInfo: null,
    tabularLayoutInfo: null,
  })

  documentSelector.mockImplementation(() => ({
    _id: 'doc-id',
    parsingInfo: mockParsingInfo,
  }))

  render(
    <DocumentParsedData />,
  )

  expect(screen.getByTestId('DocumentLayout')).toBeInTheDocument()
})
