
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { render } from '@/utils/rendererRTL'
import { EntityLayout } from './EntityLayout'

var MockParagraphLayout
var MockTableLayout

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/NoData', () => mockShallowComponent('NoData'))
jest.mock('@/components/Radio', () => ({
  ...jest.requireActual('@/components/Radio'),
  Radio: ({ children, optionType, ...props }) => (
    <div
      data-testid="Radio"
      {...props}
    >
      {children}
    </div>
  ),
  GroupOfRadio: ({ children, buttonStyle, ...props }) => (
    <div
      data-testid="GroupOfRadio"
      {...props}
    >
      {children}
    </div>
  ),
}))

jest.mock('./ParagraphLayout', () => {
  const mock = mockShallowComponent('ParagraphLayout')
  MockParagraphLayout = mock.ParagraphLayout
  return mock
})
jest.mock('./TableLayout', () => {
  const mock = mockShallowComponent('TableLayout')
  MockTableLayout = mock.TableLayout
  return mock
})
jest.mock('./KeyValuePairLayout', () => mockShallowComponent('KeyValuePairLayout'))
jest.mock('./ImageLayout', () => mockShallowComponent('ImageLayout'))

const mockDocumentLayoutSelect = jest.fn()

jest.mock('./LayoutSelect', () => ({
  LayoutSelect: (props) => {
    mockDocumentLayoutSelect(props)
    return (
      <div data-testid="LayoutSelect">
        <button
          data-testid="change-parsing-type-button"
          onClick={() => props.setSelectedParsingType('other-engine')}
        >
          Change parsing type
        </button>
      </div>
    )
  },
}))

const createMockDocumentLayoutData = (features = [KnownParsingFeature.TEXT], mergedTables = [], parsingType = DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT) => ({
  documentLayoutInfo: {
    parsingFeatures: {
      [parsingType]: features,
    },
    mergedTables: {
      [parsingType]: mergedTables,
    },
    pagesInfo: {
      [parsingType]: {
        pagesCount: 5,
      },
    },
  },
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders no data message when no document layout available', () => {
  render(<EntityLayout rawParsingInfoData={null} />)

  expect(screen.getByTestId('NoData')).toBeInTheDocument()
})

test('renders radio buttons and selects first option by default', () => {
  const mockData = createMockDocumentLayoutData([
    KnownParsingFeature.TEXT,
    KnownParsingFeature.TABLES,
  ])

  render(<EntityLayout rawParsingInfoData={mockData} />)

  expect(screen.getByTestId('ParagraphLayout')).toBeInTheDocument()
})

test('renders TableLayout when tables feature is available', () => {
  const mockData = createMockDocumentLayoutData([KnownParsingFeature.TABLES])

  render(<EntityLayout rawParsingInfoData={mockData} />)

  expect(screen.getByTestId('TableLayout')).toBeInTheDocument()
})

test('passes mergedTables prop to TableLayout component', () => {
  const mergedTables = [
    {
      id: 1,
      tables: [
        {
          id: 'table1',
          name: 'Test Table',
        },
      ],
    },
  ]

  const mockData = createMockDocumentLayoutData([KnownParsingFeature.TABLES], mergedTables)

  render(<EntityLayout rawParsingInfoData={mockData} />)

  const tableLayoutProps = MockTableLayout.getProps()

  expect(tableLayoutProps.mergedTables).toEqual([
    {
      id: 'table1',
      name: 'Test Table',
      parentId: 'merged-table-0',
    },
  ])
})

test('renders LayoutSelect component', () => {
  const mockData = createMockDocumentLayoutData([KnownParsingFeature.TEXT])

  render(<EntityLayout rawParsingInfoData={mockData} />)

  expect(screen.getByTestId('LayoutSelect')).toBeInTheDocument()
})

test('provides USER_DEFINED parsing type to LayoutSelect when available', () => {
  const mockData = createMockDocumentLayoutData(
    [KnownParsingFeature.TEXT],
    [],
    DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED,
  )
  mockData.documentLayoutInfo.parsingFeatures[DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT] = [KnownParsingFeature.TEXT]

  render(<EntityLayout rawParsingInfoData={mockData} />)

  expect(mockDocumentLayoutSelect).toHaveBeenLastCalledWith(
    expect.objectContaining({
      selectedParsingType: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED,
    }),
  )
})

test('provides first available parsing type to LayoutSelect when USER_DEFINED is not available', () => {
  const mockData = createMockDocumentLayoutData([KnownParsingFeature.TEXT])

  render(<EntityLayout rawParsingInfoData={mockData} />)

  expect(mockDocumentLayoutSelect).toHaveBeenLastCalledWith(
    expect.objectContaining({
      selectedParsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
    }),
  )
})

test('updates parsing type when user selects a different option', async () => {
  jest.clearAllMocks()

  const mockData = createMockDocumentLayoutData([KnownParsingFeature.TEXT])

  mockData.documentLayoutInfo.parsingFeatures['other-engine'] = [KnownParsingFeature.TEXT]
  mockData.documentLayoutInfo.pagesInfo['other-engine'] = { pagesCount: 3 }

  render(<EntityLayout rawParsingInfoData={mockData} />)

  const changeButton = screen.getByTestId('change-parsing-type-button')
  await userEvent.click(changeButton)

  expect(mockDocumentLayoutSelect).toHaveBeenLastCalledWith(
    expect.objectContaining({
      selectedParsingType: 'other-engine',
    }),
  )
})

test('renders KeyValuePairLayout when key value pairs feature is available', () => {
  const mockData = createMockDocumentLayoutData([KnownParsingFeature.KEY_VALUE_PAIRS])

  render(<EntityLayout rawParsingInfoData={mockData} />)

  expect(screen.getByTestId('KeyValuePairLayout')).toBeInTheDocument()
})

test('renders ImageLayout when images feature is available', () => {
  const mockData = createMockDocumentLayoutData([KnownParsingFeature.IMAGES])

  render(<EntityLayout rawParsingInfoData={mockData} />)

  expect(screen.getByTestId('ImageLayout')).toBeInTheDocument()
})

test('passes correct props to layout components', () => {
  const mockData = createMockDocumentLayoutData([KnownParsingFeature.TEXT])

  render(<EntityLayout rawParsingInfoData={mockData} />)

  const paragraphLayoutProps = MockParagraphLayout.getProps()

  expect(paragraphLayoutProps).toEqual(
    expect.objectContaining({
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
      total: 5,
    }),
  )
})

test('renders no data when no features are available', () => {
  const mockData = createMockDocumentLayoutData([])

  render(<EntityLayout rawParsingInfoData={mockData} />)

  expect(screen.getByTestId('NoData')).toBeInTheDocument()
})
