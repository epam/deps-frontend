
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { fetchUnifiedDataCells } from '@/actions/documents'
import { UnifiedDataPositionalText } from '@/models/UnifiedData/UnifiedDataPositionalText'
import { UnifiedDataWord } from '@/models/UnifiedData/UnifiedDataWord'
import { render } from '@/utils/rendererRTL'
import { DocumentDocxViewer } from './DocumentDocxViewer'

const mockDispatch = jest.fn()

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({ documentId: 'test-document-id' })),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
  useSelector: jest.fn(),
}))

jest.mock('@/actions/documents', () => ({
  fetchUnifiedDataCells: jest.fn(),
}))

jest.mock('@/components/Spin', () => mockShallowComponent('Spin'))
jest.mock('@/containers/Slate', () => mockShallowComponent('Slate'))

const createMockUnifiedDataText = (id, page, content = 'Some text') => {
  const word = new UnifiedDataWord({
    content,
    confidence: 1,
  })

  return new UnifiedDataPositionalText(id, page, [word])
}

const createMockTable = (id, page, maxRow = 5, maxColumn = 3, cells = null) => ({
  id,
  maxColumn,
  maxRow,
  page,
  ...(cells && { cells }),
})

beforeEach(() => {
  jest.clearAllMocks()
  mockDispatch.mockClear()
})

test('renders Spin when there are tables without cells', () => {
  const mockDocument = {
    _id: 'test-document-id',
    unifiedData: {
      1: [
        createMockUnifiedDataText('ud-1', 1, 'Some text'),
        createMockTable('table-1', 1, 5, 3),
      ],
    },
  }

  useSelector.mockReturnValue(mockDocument)

  render(<DocumentDocxViewer />)

  const spinComponent = screen.getByTestId('Spin')
  expect(spinComponent).toBeInTheDocument()
})

test('renders Slate when unified data is ready and all tables have cells', () => {
  const mockDocument = {
    _id: 'test-document-id',
    unifiedData: {
      1: [
        createMockUnifiedDataText('ud-1', 1, 'Some text'),
        createMockUnifiedDataText('ud-2', 1, 'More text'),
      ],
    },
  }

  useSelector.mockReturnValue(mockDocument)

  render(<DocumentDocxViewer />)

  expect(screen.getByTestId('Slate')).toBeInTheDocument()
})

test('calls fetchUnifiedDataCells with correct arguments when tables without cells exist', () => {
  const mockDocument = {
    _id: 'test-document-id',
    unifiedData: {
      1: [
        createMockUnifiedDataText('ud-1', 1, 'Some text'),
      ],
      2: [
        createMockTable('table-1', 1, 5, 3),
        createMockTable('table-2', 2, 10, 4),
      ],
    },
  }

  useSelector.mockReturnValue(mockDocument)

  render(<DocumentDocxViewer />)

  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenNthCalledWith(1, fetchUnifiedDataCells({
    documentId: 'test-document-id',
    tableConfigs: [
      {
        tableId: 'table-1',
        maxRow: 5,
        maxColumn: 3,
      },
      {
        tableId: 'table-2',
        maxRow: 10,
        maxColumn: 4,
      },
    ],
  }))
})
