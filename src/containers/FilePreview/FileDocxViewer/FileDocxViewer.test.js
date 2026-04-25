
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { useFetchFileUnifiedDataQuery } from '@/apiRTK/filesApi'
import { render } from '@/utils/rendererRTL'
import { FileDocxViewer } from './FileDocxViewer'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({ fileId: 'test-file-id' })),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileUnifiedDataQuery: jest.fn(),
}))

jest.mock('@/components/Spin', () => mockShallowComponent('Spin'))
jest.mock('@/containers/Slate', () => mockShallowComponent('Slate'))

jest.mock('@/models/UnifiedData/mappers/mapUDToSlateData', () => ({
  mapUDToSlateData: jest.fn((data) => data),
}))

jest.mock('./FileDocxViewerWithTables', () => mockShallowComponent('FileDocxViewerWithTables'))

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders Spin when unified data is loading', () => {
  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: undefined,
    isLoading: true,
  })

  render(<FileDocxViewer />)

  const spinComponent = screen.getByTestId('Spin')
  expect(spinComponent).toBeInTheDocument()
})

test('renders FileDocxViewerWithTables when there are tables without cells', () => {
  const mockUnifiedData = {
    1: [
      {
        id: 'ud-1',
        text: 'Some text',
      },
      {
        id: 'table-1',
        maxColumn: 3,
        maxRow: 5,
      },
    ],
  }

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: mockUnifiedData,
    isLoading: false,
  })

  render(<FileDocxViewer />)

  expect(screen.getByTestId('FileDocxViewerWithTables')).toBeInTheDocument()
})

test('renders Content with Slate when unified data is ready and all tables have cells', () => {
  const mockUnifiedData = {
    1: [
      {
        id: 'ud-1',
        text: 'Some text',
      },
      {
        id: 'ud-2',
        text: 'More text',
      },
    ],
  }

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: mockUnifiedData,
    isLoading: false,
  })

  render(<FileDocxViewer />)

  expect(screen.getByTestId('Slate')).toBeInTheDocument()
})
