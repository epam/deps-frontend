
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { selectionSelector } from '@/selectors/navigation'
import { render } from '@/utils/rendererRTL'
import { BatchesPageActions } from './BatchesPageActions'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/navigation')

jest.mock('@/containers/DeleteBatch', () => mockShallowComponent('BulkBatchesDelete'))
jest.mock('@/containers/ManageBatch/AddBatchDrawerButton', () => mockShallowComponent('AddBatchDrawerButton'))
jest.mock('../RefreshBatches', () => mockShallowComponent('RefreshBatches'))
jest.mock('../ResetBatches', () => mockShallowComponent('ResetBatches'))

const mockRefetch = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

test('shows standard actions when no batches are selected', () => {
  selectionSelector.mockImplementation(() => [])

  render(<BatchesPageActions refetch={mockRefetch} />)

  expect(screen.getByTestId('RefreshBatches')).toBeInTheDocument()
  expect(screen.getByTestId('ResetBatches')).toBeInTheDocument()
  expect(screen.getByTestId('AddBatchDrawerButton')).toBeInTheDocument()
  expect(screen.queryByTestId('BulkBatchesDelete')).not.toBeInTheDocument()
})

test('shows delete button when batches are selected', () => {
  selectionSelector.mockImplementation(() => ['batch1', 'batch2'])

  render(<BatchesPageActions refetch={mockRefetch} />)

  expect(screen.getByTestId('BulkBatchesDelete')).toBeInTheDocument()

  expect(screen.queryByTestId('RefreshBatches')).not.toBeInTheDocument()
  expect(screen.queryByTestId('ResetBatches')).not.toBeInTheDocument()
  expect(screen.queryByTestId('AddBatchDrawerButton')).not.toBeInTheDocument()
})

test('shows delete button when single batch is selected', () => {
  selectionSelector.mockImplementation(() => ['batch1'])

  render(<BatchesPageActions refetch={mockRefetch} />)

  expect(screen.getByTestId('BulkBatchesDelete')).toBeInTheDocument()
})

test('switches back to standard actions when selection is cleared', () => {
  selectionSelector.mockImplementation(() => ['batch1'])

  const { unmount } = render(<BatchesPageActions refetch={mockRefetch} />)

  expect(screen.getByTestId('BulkBatchesDelete')).toBeInTheDocument()

  unmount()

  selectionSelector.mockImplementation(() => [])

  render(<BatchesPageActions refetch={mockRefetch} />)

  expect(screen.getByTestId('RefreshBatches')).toBeInTheDocument()
  expect(screen.queryByTestId('BulkBatchesDelete')).not.toBeInTheDocument()
})
