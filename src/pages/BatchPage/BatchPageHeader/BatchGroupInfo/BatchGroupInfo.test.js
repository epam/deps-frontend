
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { useFetchBatchQuery } from '@/apiRTK/batchesApi'
import { render } from '@/utils/rendererRTL'
import { BatchGroupInfo } from './BatchGroupInfo'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ id: '1' })),
}))

jest.mock('@/apiRTK/batchesApi', () => ({
  useFetchBatchQuery: jest.fn(() => ({
    data: {
      group: {
        name: 'Test Group',
      },
    },
  })),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders nothing if data.group is empty', () => {
  useFetchBatchQuery.mockReturnValueOnce({ data: { group: null } })

  const { container } = render(<BatchGroupInfo />)
  expect(container).toBeEmptyDOMElement()
})

test('renders group name if data.group is present', () => {
  render(<BatchGroupInfo />)
  expect(screen.getByText('Test Group')).toBeInTheDocument()
})
