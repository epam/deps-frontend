
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import { useFetchFileUnifiedDataQuery, useLazyFetchFileUnifiedDataTableCellsQuery } from '@/apiRTK/filesApi'
import { UnifiedDataPositionalText } from '@/models/UnifiedData/UnifiedDataPositionalText'
import { UnifiedDataWord } from '@/models/UnifiedData/UnifiedDataWord'
import { render } from '@/utils/rendererRTL'
import { FileDocxViewerWithTables } from './FileDocxViewerWithTables'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({ fileId: 'test-file-id' })),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileUnifiedDataQuery: jest.fn(),
  useLazyFetchFileUnifiedDataTableCellsQuery: jest.fn(),
}))

jest.mock('@/components/Spin', () => mockShallowComponent('Spin'))
jest.mock('@/containers/Slate', () => mockShallowComponent('Slate'))

const createMockTableCell = (content = 'default cell', row = 0, column = 0, rowspan = 1, colspan = 1) => ({
  value: {
    content,
  },
  coordinates: {
    row,
    column,
    rowspan,
    colspan,
  },
})

const createMockTableCells = () => [createMockTableCell()]

const createMockUnifiedDataText = (id, page, content = 'Some text') => {
  const word = new UnifiedDataWord({
    content,
    confidence: 1,
  })

  return new UnifiedDataPositionalText(id, page, [word])
}

const createMockTable = (id, page, maxRow = 5, maxColumn = 3) => ({
  id,
  maxColumn,
  maxRow,
  page,
})

let defaultProps
let mockFetchTableCells
let defaultUnifiedData

beforeEach(() => {
  jest.clearAllMocks()

  mockFetchTableCells = jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve(createMockTableCells())),
  }))

  defaultUnifiedData = {
    1: [
      createMockUnifiedDataText('ud-1', 1, 'Some text'),
      createMockTable('table-1', 1, 5, 3),
    ],
  }

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: defaultUnifiedData,
  })

  useLazyFetchFileUnifiedDataTableCellsQuery.mockReturnValue([
    mockFetchTableCells,
    {
      isFetching: false,
      isLoading: false,
    },
  ])

  defaultProps = {
    notReadyTables: [
      {
        id: 'table-1',
        maxColumn: 3,
        maxRow: 5,
      },
    ],
  }
})

test('renders Spin component while loading table cells', async () => {
  render(<FileDocxViewerWithTables {...defaultProps} />)

  await waitFor(() => {
    expect(screen.getByTestId('Spin')).toBeInTheDocument()
  })
})

test('fetches table cells for all not ready tables on mount', async () => {
  const notReadyTables = [
    {
      id: 'table-1',
      maxColumn: 3,
      maxRow: 5,
    },
    {
      id: 'table-2',
      maxColumn: 4,
      maxRow: 2,
    },
  ]

  const unifiedData = {
    1: [
      createMockUnifiedDataText('ud-1', 1),
      createMockTable('table-1', 1, 5, 3),
      createMockTable('table-2', 1, 2, 4),
    ],
  }

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: unifiedData,
  })

  mockFetchTableCells.mockImplementation(() => ({
    unwrap: jest.fn(() => Promise.resolve(createMockTableCells())),
  }))

  render(
    <FileDocxViewerWithTables
      notReadyTables={notReadyTables}
    />,
  )

  await waitFor(() => {
    expect(mockFetchTableCells).toHaveBeenCalledTimes(2)
  })

  expect(mockFetchTableCells).toHaveBeenNthCalledWith(1, {
    fileId: 'test-file-id',
    maxColumn: 3,
    maxRow: 5,
    tableId: 'table-1',
  })
  expect(mockFetchTableCells).toHaveBeenNthCalledWith(2, {
    fileId: 'test-file-id',
    maxColumn: 4,
    maxRow: 2,
    tableId: 'table-2',
  })
})

test('shows Spin while isFetching is true', async () => {
  useLazyFetchFileUnifiedDataTableCellsQuery.mockReturnValue([
    mockFetchTableCells,
    {
      isLoading: false,
      isFetching: true,
    },
  ])

  render(<FileDocxViewerWithTables {...defaultProps} />)

  await waitFor(() => {
    expect(screen.getByTestId('Spin')).toBeInTheDocument()
  })
})

test('shows Spin while isLoading is true', async () => {
  useLazyFetchFileUnifiedDataTableCellsQuery.mockReturnValue([
    mockFetchTableCells,
    {
      isLoading: true,
      isFetching: false,
    },
  ])

  render(<FileDocxViewerWithTables {...defaultProps} />)

  await waitFor(() => {
    expect(screen.getByTestId('Spin')).toBeInTheDocument()
  })
})

test('handles empty notReadyTables array', async () => {
  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: {
      1: [
        createMockUnifiedDataText('ud-1', 1),
      ],
    },
  })

  useLazyFetchFileUnifiedDataTableCellsQuery.mockReturnValue([
    mockFetchTableCells,
    {
      isFetching: false,
      isLoading: false,
    },
  ])

  render(
    <FileDocxViewerWithTables
      notReadyTables={[]}
    />,
  )

  await waitFor(() => {
    expect(mockFetchTableCells).not.toHaveBeenCalled()
  })
})

test('renders Spin initially before table cells are loaded', async () => {
  mockFetchTableCells.mockReturnValue({
    unwrap: jest.fn(() => new Promise(() => {})),
  })

  render(<FileDocxViewerWithTables {...defaultProps} />)

  await waitFor(() => {
    expect(screen.getByTestId('Spin')).toBeInTheDocument()
  })

  expect(screen.queryByTestId('Slate')).not.toBeInTheDocument()
})

test('calls fetchTableCells with correct parameters', async () => {
  mockFetchTableCells.mockImplementation(() => ({
    unwrap: jest.fn(() => Promise.resolve(createMockTableCells())),
  }))

  render(<FileDocxViewerWithTables {...defaultProps} />)

  await waitFor(() => {
    expect(mockFetchTableCells).toHaveBeenCalledWith({
      fileId: 'test-file-id',
      maxColumn: 3,
      maxRow: 5,
      tableId: 'table-1',
    })
  })
})

test('handles multiple tables from different pages', async () => {
  const unifiedData = {
    1: [
      createMockUnifiedDataText('ud-1', 1, 'Page 1 text'),
      createMockTable('table-1', 1, 2, 2),
    ],
    2: [
      createMockUnifiedDataText('ud-2', 2, 'Page 2 text'),
      createMockTable('table-2', 2, 3, 3),
    ],
  }

  const notReadyTables = [
    {
      id: 'table-1',
      maxColumn: 2,
      maxRow: 2,
    },
    {
      id: 'table-2',
      maxColumn: 3,
      maxRow: 3,
    },
  ]

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: unifiedData,
  })

  mockFetchTableCells.mockImplementation(() => ({
    unwrap: jest.fn(() => Promise.resolve(createMockTableCells())),
  }))

  render(
    <FileDocxViewerWithTables
      notReadyTables={notReadyTables}
    />,
  )

  await waitFor(() => {
    expect(mockFetchTableCells).toHaveBeenCalledTimes(2)
  })
})
