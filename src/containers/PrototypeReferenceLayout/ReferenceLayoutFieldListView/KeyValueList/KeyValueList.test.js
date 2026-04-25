
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { useFetchDocumentLayout } from '@/containers/PrototypeReferenceLayout/useFetchDocumentLayout'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { KeyValuePairElementLayout, KeyValuePairLayout, PageLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { activeLayoutIdSelector } from '@/selectors/prototypePage'
import { render } from '@/utils/rendererRTL'
import { KeyValueList } from './'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/components/NoData', () => mockShallowComponent('NoData'))
jest.mock('@/containers/InView', () => mockShallowComponent('InView'))
jest.mock('@/selectors/prototypePage')

jest.mock('@/containers/PrototypeReferenceLayout/useFetchDocumentLayout', () => ({
  useFetchDocumentLayout: jest.fn(() => ({
    isLoading: false,
    documentLayout: mockLayout,
    pagesCount: mockTotal,
  })),
}))

const mockKeyValuePairs = [
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
    id: 'mockId',
  }),
]

const mockTotal = 4

const mockLayout = {
  pages: [
    new PageLayout({
      id: 'mockId',
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      pageNumber: 1,
      images: [],
      paragraphs: [],
      keyValuePairs: mockKeyValuePairs,
      tables: [],
    }),
  ],
}

test('calls useFetchDocumentLayout with correct arguments', () => {
  render(
    <KeyValueList
      prototypeMappingKeys={[]}
    />,
  )

  expect(useFetchDocumentLayout).nthCalledWith(1, {
    layoutId: activeLayoutIdSelector.getSelectorMockValue(),
    features: [KnownParsingFeature.KEY_VALUE_PAIRS],
  })
})

test('shows spinner if data is fetching', () => {
  useFetchDocumentLayout.mockReturnValueOnce({
    documentLayout: mockLayout,
    isLoading: true,
  })

  render(
    <KeyValueList
      prototypeMappingKeys={[]}
    />,
  )

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('shows empty layout content when there is no kv pairs', () => {
  const mockLayout = {
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
    total: 1,
  }

  useFetchDocumentLayout.mockReturnValueOnce({
    documentLayout: mockLayout,
    isLoading: false,
    pagesCount: 1,
  })

  render(
    <KeyValueList
      prototypeMappingKeys={[]}
    />,
  )

  expect(screen.getByTestId('NoData')).toBeInTheDocument()
})

test('renders correct amount of children based on response', () => {
  jest.clearAllMocks()

  render(
    <KeyValueList
      prototypeMappingKeys={[]}
    />,
  )

  const keyValues = screen.getAllByTestId('InView')

  expect(keyValues).toHaveLength(mockTotal)
})
