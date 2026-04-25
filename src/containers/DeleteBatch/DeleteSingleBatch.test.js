
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { useParams } from 'react-router-dom'
import { Localization, localize } from '@/localization/i18n'
import { Batch, BatchFile } from '@/models/Batch'
import { navigationMap } from '@/utils/navigationMap'
import { render } from '@/utils/rendererRTL'
import { goTo } from '@/utils/routerActions'
import { DeleteSingleBatch } from './DeleteSingleBatch'

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

const mockId = 'mockId'

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({
    id: mockId,
  })),
}))

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
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

const mockBatch = new Batch({
  id: 'mockBatchId',
  files: [
    new BatchFile({
      documentTypeId: 'document type',
      engine: 'TESSERACT',
      error: null,
      llmType: 'llm type',
      name: 'file name',
      parsingFeatures: ['text', 'tables'],
      status: 'completed',
    }),
  ],
  group: {
    id: '3',
    name: 'group name',
  },
  name: 'batch name',
  status: 'completed',
  createdAt: '2025-07-01T00:00:00.000Z',
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('shows modal with checkbox and related content in case of button click', async () => {
  const props = {
    batch: mockBatch,
    renderTrigger: MockContent,
  }

  render(<DeleteSingleBatch {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(screen.getByTestId('delete-associated-docs')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.REMOVE_CORRESPONDING_DOCUMENTS))).toBeInTheDocument()
})

test('shows modal with title from batch prop in case of button click', async () => {
  const props = {
    batch: mockBatch,
    renderTrigger: MockContent,
  }

  render(<DeleteSingleBatch {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(screen.getByText(localize(Localization.DELETE_BATCH_CONFIRM_TITLE, { name: mockBatch.name }))).toBeInTheDocument()
})

test('calls deleteBatches with batch id when clicking on modal confirm', async () => {
  const props = {
    batch: mockBatch,
    renderTrigger: MockContent,
  }

  render(<DeleteSingleBatch {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockDeleteBatchFunction).nthCalledWith(1, {
    ids: [mockBatch.id],
  })
})

test('calls deleteBatchesWithDocuments when delete associated docs checked and clicking on modal confirm', async () => {
  const props = {
    batch: mockBatch,
    renderTrigger: MockContent,
  }

  render(<DeleteSingleBatch {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const checkbox = screen.getByTestId('delete-associated-docs')
  await userEvent.click(checkbox)

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockDeleteBatchWithDocuments).nthCalledWith(1, {
    ids: [mockBatch.id],
  })
})

test('calls goTo and notifySuccess when deleting from batch page', async () => {
  useParams.mockImplementation(() => ({
    id: mockId,
  }))

  const props = {
    batch: mockBatch,
    renderTrigger: MockContent,
  }

  render(<DeleteSingleBatch {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))
  await userEvent.click(confirmBtn)

  await waitFor(() => {
    expect(goTo).toHaveBeenCalledWith(navigationMap.batches())
  })

  expect(mockNotification.notifySuccess).nthCalledWith(
    1,
    localize(Localization.DELETE_COMPLETED),
  )
})

test('does not call goTo when deleting from batches list (no id in params)', async () => {
  useParams.mockImplementation(() => ({}))

  const props = {
    batch: mockBatch,
    renderTrigger: MockContent,
  }

  render(<DeleteSingleBatch {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))
  await userEvent.click(confirmBtn)

  await waitFor(() => {
    expect(mockNotification.notifySuccess).nthCalledWith(
      1,
      localize(Localization.DELETE_COMPLETED),
    )
  })

  expect(goTo).not.toHaveBeenCalled()
})

test('calls notifyWarning with correct message in case of delete rejection', async () => {
  const mockError = new Error('test')
  const mockRejectedUnwrapFn = () => Promise.reject(mockError)

  mockDeleteBatchFunction.mockImplementationOnce(() => ({
    unwrap: mockRejectedUnwrapFn,
  }))

  const props = {
    batch: mockBatch,
    renderTrigger: MockContent,
  }

  render(<DeleteSingleBatch {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.DELETE_FAILED),
  )
})

test('calls notifyWarning with correct message in case of delete rejection with known code', async () => {
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
    batch: mockBatch,
    renderTrigger: MockContent,
  }

  render(<DeleteSingleBatch {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.BATCH_NOT_FOUND),
  )
})
