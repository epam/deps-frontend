
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import { useFetchFileUnifiedDataTableCellsQuery } from '@/apiRTK/filesApi'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FileTableViewerWithCells } from './FileTableViewerWithCells'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({ fileId: 'test-file-id' })),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileUnifiedDataTableCellsQuery: jest.fn(),
}))

jest.mock('@/components/Spin', () => mockShallowComponent('Spin'))
jest.mock('@/containers/UnifiedDataHandsonTable', () => mockShallowComponent('UnifiedDataHandsonTable'))

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()

  defaultProps = {
    currentUnifiedData: {
      id: 'table-1',
      page: 1,
      name: 'Sheet1',
      maxRow: 10,
      maxColumn: 5,
    },
  }

  useFetchFileUnifiedDataTableCellsQuery.mockReturnValue({
    data: undefined,
    isLoading: false,
    isFetching: false,
  })
})

test('renders Spin when cells are not loaded yet', () => {
  useFetchFileUnifiedDataTableCellsQuery.mockReturnValue({
    data: undefined,
    isLoading: true,
    isFetching: false,
  })

  render(<FileTableViewerWithCells {...defaultProps} />)

  expect(screen.getByTestId('Spin')).toBeInTheDocument()
  expect(screen.queryByTestId('UnifiedDataHandsonTable')).not.toBeInTheDocument()
})

test('renders Spin when isLoading is true', () => {
  useFetchFileUnifiedDataTableCellsQuery.mockReturnValue({
    data: undefined,
    isLoading: true,
    isFetching: false,
  })

  render(<FileTableViewerWithCells {...defaultProps} />)

  expect(screen.getByTestId('Spin')).toBeInTheDocument()
  expect(screen.queryByTestId('UnifiedDataHandsonTable')).not.toBeInTheDocument()
})

test('renders Spin when isFetching is true', () => {
  useFetchFileUnifiedDataTableCellsQuery.mockReturnValue({
    data: undefined,
    isLoading: false,
    isFetching: true,
  })

  render(<FileTableViewerWithCells {...defaultProps} />)

  expect(screen.getByTestId('Spin')).toBeInTheDocument()
  expect(screen.queryByTestId('UnifiedDataHandsonTable')).not.toBeInTheDocument()
})

test('renders UnifiedDataHandsonTable when cells are loaded', () => {
  const mockCells = [
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
  ]

  useFetchFileUnifiedDataTableCellsQuery.mockReturnValue({
    data: mockCells,
    isLoading: false,
    isFetching: false,
  })

  render(<FileTableViewerWithCells {...defaultProps} />)

  expect(screen.getByTestId('UnifiedDataHandsonTable')).toBeInTheDocument()
  expect(screen.queryByTestId('Spin')).not.toBeInTheDocument()
})

test('passes correct query parameters to useFetchFileUnifiedDataTableCellsQuery', () => {
  render(<FileTableViewerWithCells {...defaultProps} />)

  expect(useFetchFileUnifiedDataTableCellsQuery).toHaveBeenCalledWith(
    {
      fileId: 'test-file-id',
      tableId: 'table-1',
      maxRow: 10,
      maxColumn: 5,
    },
    {
      skip: false,
    },
  )
})

test('skips fetching when currentUnifiedData has cells', () => {
  const propsWithCells = {
    currentUnifiedData: {
      ...defaultProps.currentUnifiedData,
      cells: [
        {
          value: {
            content: 'Existing Cell',
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
  }

  render(<FileTableViewerWithCells {...propsWithCells} />)

  expect(useFetchFileUnifiedDataTableCellsQuery).toHaveBeenCalledWith(
    expect.anything(),
    {
      skip: true,
    },
  )
})

test('passes enriched unified data with cells to UnifiedDataHandsonTable', () => {
  const mockCells = [
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
  ]

  useFetchFileUnifiedDataTableCellsQuery.mockReturnValue({
    data: mockCells,
    isLoading: false,
    isFetching: false,
  })

  render(<FileTableViewerWithCells {...defaultProps} />)

  const table = screen.getByTestId('UnifiedDataHandsonTable')
  const unifiedDataProp = table.getAttribute('data-unifieddata')
  const parsedData = JSON.parse(unifiedDataProp)

  expect(parsedData.id).toBe('table-1')
  expect(parsedData.name).toBe('Sheet1')
  expect(parsedData.cells).toEqual(mockCells)
})

test('enriches unified data when cells become available', async () => {
  const mockCells = [
    {
      value: {
        content: 'New Cell',
        confidence: 0.95,
      },
      coordinates: {
        column: 0,
        row: 0,
        colspan: 1,
        rowspan: 1,
      },
    },
  ]

  useFetchFileUnifiedDataTableCellsQuery.mockReturnValue({
    data: mockCells,
    isLoading: false,
    isFetching: false,
  })

  render(<FileTableViewerWithCells {...defaultProps} />)

  await waitFor(() => {
    const table = screen.getByTestId('UnifiedDataHandsonTable')
    const unifiedDataProp = table.getAttribute('data-unifieddata')
    const parsedData = JSON.parse(unifiedDataProp)
    expect(parsedData.cells).toBeDefined()
  })
})

test('renders Empty component with localized message when cells do not exist', () => {
  useFetchFileUnifiedDataTableCellsQuery.mockReturnValue({
    data: undefined,
    isLoading: false,
    isFetching: false,
  })

  render(<FileTableViewerWithCells {...defaultProps} />)

  expect(screen.queryByTestId('Spin')).not.toBeInTheDocument()
  expect(screen.queryByTestId('UnifiedDataHandsonTable')).not.toBeInTheDocument()
  expect(screen.getByText(localize(Localization.NO_TABLE_CELLS_AVAILABLE))).toBeInTheDocument()
})
