
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/dom'
import { waitFor } from '@testing-library/react'
import { useFetchDocumentLayout } from '@/containers/PrototypeReferenceLayout/useFetchDocumentLayout'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import { ReferenceLayoutState } from '@/enums/ReferenceLayoutState'
import { Localization, localize } from '@/localization/i18n'
import { KeyValuePairElementLayout, KeyValuePairLayout, PageLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { ReferenceLayout } from '@/models/ReferenceLayout'
import { render } from '@/utils/rendererRTL'
import { ReferenceLayoutDocumentView } from './ReferenceLayoutDocumentView'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('./KeyValuePairsViewer', () => mockShallowComponent('KeyValuePairsViewer'))
jest.mock('./TablesViewer', () => mockShallowComponent('TablesViewer'))
jest.mock('@/components/Pagination', () => mockShallowComponent('Pagination'))

const mockDocumentLayout = {
  pages: [
    new PageLayout({
      id: 'mockId',
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      pageNumber: 1,
      images: [],
      paragraphs: [],
      keyValuePairs: [
        new KeyValuePairLayout({
          key: new KeyValuePairElementLayout(
            'keyContent',
            [
              new Point(0.111, 0.222),
              new Point(0.333, 0.444),
            ],
          ),
          value: new KeyValuePairElementLayout(
            'valueContent',
            [
              new Point(0.731, 0.456),
              new Point(0.123, 0.234),
            ],
          ),
          confidence: 0,
          id: 'id',
        }),
      ],
      tables: [],
    }),
  ],
}

const mockReferenceLayout = new ReferenceLayout({
  id: 'mockId',
  prototypeId: 'mockPrototypeId',
  blobName: 'mockBlobName',
  state: ReferenceLayoutState.PARSING,
  title: 'mockTitle',
  unifiedData: {
    1: [{
      blobName: 'mockBlobName',
      id: 'mockId',
      page: 1,
    }],
  },
})

jest.mock('../useFetchDocumentLayout', () => ({
  useFetchDocumentLayout: jest.fn(() => ({
    isLoading: false,
    documentLayout: mockDocumentLayout,
  })),
}))

test('calls useFetchDocumentLayout with correct arguments if view type is Fields', () => {
  jest.clearAllMocks()

  render(
    <ReferenceLayoutDocumentView
      fieldsViewType={PrototypeViewType.FIELDS}
      isEditMode={false}
      prototypeMappingKeys={[]}
      referenceLayout={mockReferenceLayout}
    />,
  )

  expect(useFetchDocumentLayout).nthCalledWith(1, {
    layoutId: mockReferenceLayout.id,
    features: [KnownParsingFeature.KEY_VALUE_PAIRS],
    batchIndex: 0,
  })
})

test('calls useFetchDocumentLayout with correct arguments if view type is Tables', () => {
  jest.clearAllMocks()

  render(
    <ReferenceLayoutDocumentView
      fieldsViewType={PrototypeViewType.TABLES}
      isEditMode={false}
      prototypeMappingKeys={[]}
      referenceLayout={mockReferenceLayout}
    />,
  )

  expect(useFetchDocumentLayout).nthCalledWith(1, {
    layoutId: mockReferenceLayout.id,
    features: [KnownParsingFeature.TABLES],
    batchIndex: 0,
  })
})

test('shows spinner if parsing data is fetching', () => {
  useFetchDocumentLayout.mockReturnValueOnce({
    documentLayout: mockDocumentLayout,
    isLoading: true,
  })

  render(
    <ReferenceLayoutDocumentView
      fieldsViewType={PrototypeViewType.TABLES}
      isEditMode={false}
      prototypeMappingKeys={[]}
      referenceLayout={mockReferenceLayout}
    />,
  )

  expect(screen.getAllByTestId('spin')[1]).toHaveClass('ant-spin-spinning')
})

test('shows k-v pairs viewer with paginator if view type is Fields', () => {
  render(
    <ReferenceLayoutDocumentView
      fieldsViewType={PrototypeViewType.FIELDS}
      isEditMode={false}
      prototypeMappingKeys={[]}
      referenceLayout={mockReferenceLayout}
    />,
  )

  expect(screen.getByTestId('KeyValuePairsViewer')).toBeInTheDocument()
  expect(screen.getByTestId('Pagination')).toBeInTheDocument()
})

test('shows tables viewer with paginator if view type is Tables', () => {
  render(
    <ReferenceLayoutDocumentView
      fieldsViewType={PrototypeViewType.TABLES}
      isEditMode={false}
      prototypeMappingKeys={[]}
      referenceLayout={mockReferenceLayout}
    />,
  )

  expect(screen.getByTestId('TablesViewer')).toBeInTheDocument()
  expect(screen.getByTestId('Pagination')).toBeInTheDocument()
})

test('displays color hint if there is document layout data', async () => {
  render(
    <ReferenceLayoutDocumentView
      fieldsViewType={PrototypeViewType.FIELDS}
      isEditMode={false}
      prototypeMappingKeys={[]}
      referenceLayout={mockReferenceLayout}
    />,
  )

  const labels = [
    Localization.ASSIGNED,
    Localization.UNASSIGNED,
    Localization.ACTIVE,
  ]

  for (const label of labels) {
    await waitFor(() => {
      expect(screen.getByText(localize(label))).toBeInTheDocument()
    })
  }
})
