
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { useFetchDocumentLayout } from '@/containers/PrototypeReferenceLayout/useFetchDocumentLayout'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import {
  KeyValuePairElementLayout,
  KeyValuePairLayout,
  PageLayout,
  TableLayout,
} from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { render } from '@/utils/rendererRTL'
import { BatchedKeyValuePairs } from './BatchedKeyValuePairs'

jest.mock('../KeyValueItem', () => ({
  KeyValueItem: () => <div data-testid='key-value' />,
}))

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/PrototypeReferenceLayout/useFetchDocumentLayout', () => ({
  useFetchDocumentLayout: jest.fn(() => ({
    isLoading: false,
    documentLayout: mockLayout,
  })),
}))

const mockTable = new TableLayout({
  id: 'id1',
  order: 1,
  cells: [],
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

test('calls useFetchDocumentLayout with correct arguments', async () => {
  const mockLayoutId = 'mockId'
  const mockBatchIndex = 1

  render(
    <BatchedKeyValuePairs
      batchIndex={mockBatchIndex}
      checkIsKeyAssigned={jest.fn()}
      layoutId={mockLayoutId}
    />,
  )

  expect(useFetchDocumentLayout).nthCalledWith(1, {
    layoutId: mockLayoutId,
    features: [KnownParsingFeature.KEY_VALUE_PAIRS],
    batchIndex: mockBatchIndex,
  })
})

test('shows spin if fields are fetching', async () => {
  useFetchDocumentLayout.mockReturnValueOnce({
    documentLayout: mockLayout,
    isLoading: true,
  })

  render(
    <BatchedKeyValuePairs
      batchIndex={1}
      checkIsKeyAssigned={jest.fn()}
      layoutId={'mockId'}
    />,
  )

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('renders correct amount of keyValue pairs', async () => {
  const expectedAmount = 3
  const getMockKeyValue = (id) => new KeyValuePairLayout({
    key: new KeyValuePairElementLayout('mockKey', []),
    value: new KeyValuePairElementLayout('mockValue', []),
    confidence: 42,
    id,
  })

  useFetchDocumentLayout.mockReturnValueOnce({
    documentLayout: {
      pages: [
        new PageLayout({
          id: 'mockId',
          parsingType: 'mockParsingType',
          pageNumber: 1,
          images: [],
          paragraphs: [],
          keyValuePairs: Array(expectedAmount).fill(0).map((_, i) => getMockKeyValue(i)),
          tables: [],
        }),
      ],
    },
    isLoading: false,
  })

  render(
    <BatchedKeyValuePairs
      batchIndex={1}
      checkIsKeyAssigned={jest.fn()}
      layoutId={'mockId'}
    />,
  )

  const keyValues = await screen.findAllByTestId('key-value')
  expect(keyValues).toHaveLength(expectedAmount)
})
