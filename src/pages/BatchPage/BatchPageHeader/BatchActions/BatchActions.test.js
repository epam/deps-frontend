
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { useFetchBatchQuery } from '@/apiRTK/batchesApi'
import { selectionSelector } from '@/selectors/navigation'
import { render } from '@/utils/rendererRTL'
import { BatchActions } from '.'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/DeleteBatch', () => mockShallowComponent('DeleteSingleBatch'))
jest.mock('@/containers/DeleteBatchFiles', () => mockShallowComponent('DeleteBatchFiles'))
jest.mock('@/containers/ManageBatch/AddFilesToBatchDrawerButton', () =>
  mockShallowComponent('AddFilesToBatchDrawerButton'),
)
jest.mock('@/selectors/navigation')

jest.mock('@/apiRTK/batchesApi', () => ({
  useFetchBatchQuery: jest.fn(() => ({
    data: {
      id: 1,
      name: 'hola',
    },
    isFetching: false,
  })),
}))

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({
    id: 1,
  })),
}))

test('renders Delete Batch Files when there are selected batch files', () => {
  selectionSelector.mockImplementation(() => ['file1', 'file2'])

  render(<BatchActions />)

  expect(screen.getByTestId('DeleteBatchFiles')).toBeInTheDocument()
  expect(screen.queryByTestId('DeleteSingleBatch')).not.toBeInTheDocument()
  expect(screen.queryByTestId('AddFilesToBatchDrawerButton')).not.toBeInTheDocument()
})

test('renders Delete Batch and AddFilesToBatchDrawerButton when there are no selected batch files', () => {
  selectionSelector.mockImplementation(() => [])

  render(<BatchActions />)

  expect(screen.getByTestId('DeleteSingleBatch')).toBeInTheDocument()
  expect(screen.getByTestId('AddFilesToBatchDrawerButton')).toBeInTheDocument()
  expect(screen.queryByTestId('DeleteBatchFiles')).not.toBeInTheDocument()
})

test('does not render DeleteSingleBatch, DeleteBatchFiles, or AddFilesToBatchDrawerButton when data is fetching', () => {
  useFetchBatchQuery.mockReturnValue({
    isFetching: true,
    data: null,
  })

  render(<BatchActions />)

  expect(screen.queryByTestId('DeleteSingleBatch')).not.toBeInTheDocument()
  expect(screen.queryByTestId('DeleteBatchFiles')).not.toBeInTheDocument()
  expect(screen.queryByTestId('AddFilesToBatchDrawerButton')).not.toBeInTheDocument()
})
