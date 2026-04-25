
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { useFetchFileUnifiedDataQuery } from '@/apiRTK/filesApi'
import { UiKeys } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { uiSelector } from '@/selectors/navigation'
import { render } from '@/utils/rendererRTL'
import { FileTableViewer } from './FileTableViewer'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({ fileId: 'test-file-id' })),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileUnifiedDataQuery: jest.fn(),
}))

jest.mock('@/actions/navigation')

jest.mock('@/selectors/navigation', () => ({
  uiSelector: jest.fn(),
}))

jest.mock('@/components/Spin', () => mockShallowComponent('Spin'))
jest.mock('@/containers/ImagePageSwitcher', () => mockShallowComponent('ImagePageSwitcher'))
jest.mock('@/containers/UnifiedDataHandsonTable', () => mockShallowComponent('UnifiedDataHandsonTable'))
jest.mock('./FileTableViewerWithCells', () => mockShallowComponent('FileTableViewerWithCells'))

let defaultUnifiedData

beforeEach(() => {
  jest.clearAllMocks()

  defaultUnifiedData = {
    1: [
      {
        id: 'table-1',
        page: 1,
        name: 'Sheet1',
        maxRow: 10,
        maxColumn: 5,
        cells: [
          {
            value: {
              content: 'Cell 1',
              confidence: 1,
            },
            coordinates: {
              column: 0,
              row: 0,
              colspan: 1,
              rowspan: 1,
            },
          },
          {
            value: {
              content: 'Cell 2',
              confidence: 1,
            },
            coordinates: {
              column: 1,
              row: 0,
              colspan: 1,
              rowspan: 1,
            },
          },
        ],
      },
    ],
    2: [
      {
        id: 'table-2',
        page: 2,
        name: 'Sheet2',
        maxRow: 8,
        maxColumn: 3,
        cells: [
          {
            value: {
              content: 'Data 1',
              confidence: 1,
            },
            coordinates: {
              column: 0,
              row: 0,
              colspan: 1,
              rowspan: 1,
            },
          },
        ],
      },
    ],
  }

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: defaultUnifiedData,
    isLoading: false,
  })

  uiSelector.mockReturnValue({
    [UiKeys.ACTIVE_PAGE]: 1,
  })
})

test('renders SheetNameStyled with correct sheet name', () => {
  render(<FileTableViewer />)

  expect(screen.getByText(localize(Localization.TABLE_SHEET_NAME, { sheetName: 'Sheet1' }))).toBeInTheDocument()
})

test('renders ImagePageSwitcher with correct props', () => {
  render(<FileTableViewer />)

  const pageSwitcher = screen.getByTestId('ImagePageSwitcher')
  expect(pageSwitcher).toBeInTheDocument()
  expect(pageSwitcher).toHaveAttribute('data-activepage', '1')
  expect(pageSwitcher).toHaveAttribute('data-pagesquantity', '2')
  expect(pageSwitcher).toHaveAttribute('data-disabled', 'false')
})

test('renders FileTableViewerWithCells when unified data is loaded with cells', () => {
  render(<FileTableViewer />)

  expect(screen.getByTestId('FileTableViewerWithCells')).toBeInTheDocument()
  expect(screen.queryByTestId('UnifiedDataHandsonTable')).not.toBeInTheDocument()
  expect(screen.queryByTestId('Spin')).not.toBeInTheDocument()
})

test('renders FileTableViewerWithCells when cells need to be fetched', () => {
  const unifiedDataWithoutCells = {
    1: [
      {
        id: 'table-1',
        page: 1,
        name: 'Sheet1',
        maxRow: 10,
        maxColumn: 5,
      },
    ],
  }

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: unifiedDataWithoutCells,
    isLoading: false,
  })

  render(<FileTableViewer />)

  expect(screen.getByTestId('FileTableViewerWithCells')).toBeInTheDocument()
  expect(screen.queryByTestId('UnifiedDataHandsonTable')).not.toBeInTheDocument()
})

test('renders Spin when data is loading', () => {
  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: undefined,
    isLoading: true,
  })

  render(<FileTableViewer />)

  expect(screen.getByTestId('Spin')).toBeInTheDocument()
  expect(screen.queryByTestId('UnifiedDataHandsonTable')).not.toBeInTheDocument()
})

test('renders FileTableViewerWithCells when maxRow is 0', () => {
  const unifiedDataWithZeroMaxRow = {
    1: [
      {
        id: 'table-1',
        page: 1,
        name: 'Sheet1',
        maxRow: 0,
        maxColumn: 0,
      },
    ],
  }

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: unifiedDataWithZeroMaxRow,
    isLoading: false,
  })

  render(<FileTableViewer />)

  expect(screen.getByTestId('FileTableViewerWithCells')).toBeInTheDocument()
  expect(screen.queryByTestId('Spin')).not.toBeInTheDocument()
})

test('renders FileTableViewerWithCells when maxRow is greater than 0', () => {
  const unifiedDataWithPositiveMaxRow = {
    1: [
      {
        id: 'table-1',
        page: 1,
        name: 'Sheet1',
        maxRow: 100,
        maxColumn: 50,
      },
    ],
  }

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: unifiedDataWithPositiveMaxRow,
    isLoading: false,
  })

  render(<FileTableViewer />)

  expect(screen.getByTestId('FileTableViewerWithCells')).toBeInTheDocument()
  expect(screen.queryByTestId('Spin')).not.toBeInTheDocument()
})

test('uses activeSourceId when available to find current unified data', () => {
  uiSelector.mockReturnValue({
    [UiKeys.ACTIVE_PAGE]: 1,
    [UiKeys.ACTIVE_SOURCE_ID]: 'table-2',
  })

  render(<FileTableViewer />)

  expect(screen.getByText(localize(Localization.TABLE_SHEET_NAME, { sheetName: 'Sheet2' }))).toBeInTheDocument()
})

test('defaults to page 1 when active page is not set', () => {
  uiSelector.mockReturnValue({})

  render(<FileTableViewer />)

  const pageSwitcher = screen.getByTestId('ImagePageSwitcher')
  expect(pageSwitcher).toHaveAttribute('data-activepage', '1')
})

test('calculates correct pages quantity from unified data', () => {
  const multiPageUnifiedData = {
    1: [
      {
        id: 'table-1',
        page: 1,
        name: 'Sheet1',
        cells: [],
      },
    ],
    2: [
      {
        id: 'table-2',
        page: 2,
        name: 'Sheet2',
        cells: [],
      },
    ],
    3: [
      {
        id: 'table-3',
        page: 3,
        name: 'Sheet3',
        cells: [],
      },
    ],
  }

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: multiPageUnifiedData,
    isLoading: false,
  })

  render(<FileTableViewer />)

  const pageSwitcher = screen.getByTestId('ImagePageSwitcher')
  expect(pageSwitcher).toHaveAttribute('data-pagesquantity', '3')
})

test('defaults to 1 page when unified data is empty', () => {
  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: {},
    isLoading: false,
  })

  render(<FileTableViewer />)

  const pageSwitcher = screen.getByTestId('ImagePageSwitcher')
  expect(pageSwitcher).toHaveAttribute('data-pagesquantity', '1')
})

test('uses UNKNOWN localization when no unified data is found', () => {
  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: {},
    isLoading: false,
  })

  render(<FileTableViewer />)

  expect(screen.getByText(
    localize(Localization.TABLE_SHEET_NAME, { sheetName: localize(Localization.UNKNOWN) }),
  )).toBeInTheDocument()
})

test('passes correct currentUnifiedData with maxRow and maxColumn to FileTableViewerWithCells', () => {
  render(<FileTableViewer />)

  const viewerWithCells = screen.getByTestId('FileTableViewerWithCells')
  const currentUnifiedDataProp = viewerWithCells.getAttribute('data-currentunifieddata')
  const parsedData = JSON.parse(currentUnifiedDataProp)

  expect(parsedData.id).toBe('table-1')
  expect(parsedData.name).toBe('Sheet1')
  expect(parsedData.maxRow).toBe(10)
  expect(parsedData.maxColumn).toBe(5)
})

test('passes currentUnifiedData with cells to FileTableViewerWithCells', () => {
  render(<FileTableViewer />)

  const viewerWithCells = screen.getByTestId('FileTableViewerWithCells')
  const currentUnifiedDataProp = viewerWithCells.getAttribute('data-currentunifieddata')
  const parsedData = JSON.parse(currentUnifiedDataProp)

  expect(parsedData.id).toBe('table-1')
  expect(parsedData.maxRow).toBe(10)
  expect(parsedData.maxColumn).toBe(5)
  expect(parsedData.cells).toBeDefined()
  expect(parsedData.cells.length).toBe(2)
})

test('renders page switcher and table together', () => {
  render(<FileTableViewer />)

  expect(screen.getByTestId('ImagePageSwitcher')).toBeInTheDocument()
  expect(screen.getByTestId('FileTableViewerWithCells')).toBeInTheDocument()
})

test('handles unified data with multiple tables per page', () => {
  const multiTableUnifiedData = {
    1: [
      {
        id: 'table-1',
        page: 1,
        name: 'Sheet1',
        cells: [],
      },
      {
        id: 'table-2',
        page: 1,
        name: 'Sheet2',
        cells: [],
      },
    ],
  }

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: multiTableUnifiedData,
    isLoading: false,
  })

  render(<FileTableViewer />)

  const pageSwitcher = screen.getByTestId('ImagePageSwitcher')
  expect(pageSwitcher).toHaveAttribute('data-pagesquantity', '2')
})

test('finds correct unified data by page when activeSourceId is not set', () => {
  uiSelector.mockReturnValue({
    [UiKeys.ACTIVE_PAGE]: 2,
  })

  render(<FileTableViewer />)

  const viewerWithCells = screen.getByTestId('FileTableViewerWithCells')
  const currentUnifiedDataProp = viewerWithCells.getAttribute('data-currentunifieddata')
  const parsedData = JSON.parse(currentUnifiedDataProp)

  expect(parsedData.id).toBe('table-2')
  expect(parsedData.page).toBe(2)
})
