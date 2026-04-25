
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { selectionSelector } from '@/selectors/navigation'
import { render } from '@/utils/rendererRTL'
import { BulkBatchesDelete } from './BulkBatchesDelete'

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/navigation')

const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/apiRTK/batchesApi', () => ({
  useDeleteBatchesMutation: jest.fn(() => [mockDeleteBatchFunction]),
  useDeleteBatchesWithDocumentsMutation: jest.fn(() => [mockDeleteBatchWithDocuments]),
}))

const deleteBatchFn = jest.fn(() => Promise.resolve())
const mockDeleteBatchFunction = jest.fn(() => ({
  unwrap: deleteBatchFn,
}))

const mockDeleteBatchWithDocuments = jest.fn(() => ({
  unwrap: deleteBatchFn,
}))

const MockContent = (onClick) => (
  <button
    data-testid='delete-trigger'
    onClick={onClick}
  />
)

beforeEach(() => {
  jest.clearAllMocks()
})

test('shows modal with checkbox and related content in case of button click', async () => {
  const mockBatches = ['batch1', 'batch2', 'batch3']
  selectionSelector.mockImplementation(() => mockBatches)

  const props = {
    renderTrigger: MockContent,
  }

  render(<BulkBatchesDelete {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(screen.getByTestId('delete-associated-docs')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.REMOVE_CORRESPONDING_DOCUMENTS))).toBeInTheDocument()
})

test('shows modal with title for multiple selected batches in case of button click', async () => {
  const mockBatches = ['batch1', 'batch2', 'batch3']
  selectionSelector.mockImplementation(() => mockBatches)

  const props = {
    renderTrigger: MockContent,
  }

  render(<BulkBatchesDelete {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(screen.getByText(
    localize(
      Localization.DELETE_BATCHES_COUNT_CONFIRM_TITLE,
      { count: mockBatches.length }))).toBeInTheDocument()
})

test('calls deleteBatches with selected batch ids when clicking on modal confirm', async () => {
  const mockBatches = ['batch1', 'batch2', 'batch3']
  selectionSelector.mockImplementation(() => mockBatches)

  const props = {
    renderTrigger: MockContent,
  }

  render(<BulkBatchesDelete {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockDeleteBatchFunction).nthCalledWith(1, {
    ids: mockBatches,
  })
})

test('calls deleteBatchesWithDocuments when delete associated docs checked and clicking on modal confirm', async () => {
  const mockBatches = ['batch1', 'batch2']
  selectionSelector.mockImplementation(() => mockBatches)

  const props = {
    renderTrigger: MockContent,
  }

  render(<BulkBatchesDelete {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const checkbox = screen.getByTestId('delete-associated-docs')
  await userEvent.click(checkbox)

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockDeleteBatchWithDocuments).nthCalledWith(1, {
    ids: mockBatches,
  })
})

test('clears selection and shows success notification after successful deletion', async () => {
  const mockBatches = ['batch1', 'batch2']
  selectionSelector.mockImplementation(() => mockBatches)

  const props = {
    renderTrigger: MockContent,
  }

  render(<BulkBatchesDelete {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))
  await userEvent.click(confirmBtn)

  await waitFor(() => {
    expect(mockDispatch).toHaveBeenCalled()
  })

  expect(mockNotification.notifySuccess).nthCalledWith(
    1,
    localize(Localization.DELETE_COMPLETED),
  )
})

test('calls notifyWarning with correct message in case of delete rejection', async () => {
  const mockBatches = ['batch1']
  selectionSelector.mockImplementation(() => mockBatches)

  const mockError = new Error('test')
  const mockRejectedUnwrapFn = () => Promise.reject(mockError)

  mockDeleteBatchFunction.mockImplementationOnce(() => ({
    unwrap: mockRejectedUnwrapFn,
  }))

  const props = {
    renderTrigger: MockContent,
  }

  render(<BulkBatchesDelete {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.DELETE_FAILED),
  )
})

test('calls notifyWarning with correct message in case of delete rejection with known code', async () => {
  const mockBatches = ['batch1']
  selectionSelector.mockImplementation(() => mockBatches)

  const mockError = {
    data: {
      code: 'batch_not_found',
    },
  }

  const mockRejectedUnwrapFn = () => Promise.reject(mockError)

  mockDeleteBatchFunction.mockImplementation(() => ({
    unwrap: mockRejectedUnwrapFn,
  }))

  const props = {
    renderTrigger: MockContent,
  }

  render(<BulkBatchesDelete {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.BATCH_NOT_FOUND),
  )
})
