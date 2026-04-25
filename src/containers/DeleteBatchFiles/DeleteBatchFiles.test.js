
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { BatchStatus as MockBatchStatus } from '@/enums/BatchStatus'
import { Localization, localize } from '@/localization/i18n'
import { BatchFile, Batch as MockBatchModel } from '@/models/Batch'
import { selectionSelector } from '@/selectors/navigation'
import { render } from '@/utils/rendererRTL'
import { DeleteBatchFiles } from '.'

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/navigation')

const mockId = 'mockId'

const mockBatchFile = new BatchFile({
  id: 'mockFileId',
  documentTypeId: 'document type',
  engine: 'TESSERACT',
  error: null,
  llmType: 'llm type',
  name: 'file name',
  parsingFeatures: ['text', 'tables'],
  status: 'completed',
})

const mockBatchFile2 = new BatchFile({
  id: 'mockFileId2',
  documentTypeId: 'document type',
  engine: 'TESSERACT',
  error: null,
  llmType: 'llm type',
  name: 'file name 2',
  parsingFeatures: ['text', 'tables'],
  status: 'completed',
})

const mockBatch = new MockBatchModel({
  id: mockId,
  files: [mockBatchFile, mockBatchFile2],
  group: {
    id: 'groupId',
    name: 'groupName',
  },
  name: 'Test Batch',
  status: MockBatchStatus.COMPLETED,
  createdAt: '2021-01-01',
})

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({
    id: mockId,
  })),
}))

jest.mock('@/apiRTK/batchesApi', () => ({
  useDeleteBatchFilesMutation: jest.fn(() => [mockDeleteBatchFilesFunction]),
  useDeleteBatchFilesWithDocumentsMutation: jest.fn(() => [mockDeleteBatchFilesWithDocuments]),
  useDeleteBatchesMutation: jest.fn(() => [mockDeleteBatchesFunction]),
  useDeleteBatchesWithDocumentsMutation: jest.fn(() => [mockDeleteBatchesWithDocumentsFunction]),
  useFetchBatchQuery: jest.fn(() => ({
    data: mockBatch,
  })),
}))

const mockDeleteBatchFilesFunction = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve()),
}))

const mockDeleteBatchFilesWithDocuments = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve()),
}))

const mockDeleteBatchesFunction = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve()),
}))

const mockDeleteBatchesWithDocumentsFunction = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve()),
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

const props = {
  file: mockBatchFile,
  renderTrigger: MockContent,
}

test('shows modal with checkbox and related content in case of button click', async () => {
  render(<DeleteBatchFiles {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(screen.getByTestId('delete-associated-docs')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.REMOVE_CORRESPONDING_DOCUMENTS))).toBeInTheDocument()
})

test('shows modal with title for list of batches in case of button click', async () => {
  selectionSelector.mockReturnValue(['1'])

  render(<DeleteBatchFiles {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(screen.getByText(localize(Localization.DELETE_BATCH_FILES_CONFIRM_TITLE))).toBeInTheDocument()
})

test('calls deleteBatchFiles with correct arguments on Batch page when clicking on modal confirm', async () => {
  selectionSelector.mockReturnValue(['1'])

  render(<DeleteBatchFiles {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockDeleteBatchFilesFunction).nthCalledWith(1, {
    batchId: mockId,
    fileIds: ['1'],
  })
})

test('calls deleteBatchFiles with correct arguments from selected files on Batch page when clicking on modal confirm', async () => {
  selectionSelector.mockReturnValue(['1'])

  render(<DeleteBatchFiles {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockDeleteBatchFilesFunction).nthCalledWith(1, {
    batchId: mockId,
    fileIds: ['1'],
  })
})

test('calls deleteBatchFiles with correct arguments from props in case there are no selected ids when clicking on modal confirm', async () => {
  selectionSelector.mockImplementation(() => [])

  render(<DeleteBatchFiles {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockDeleteBatchFilesFunction).nthCalledWith(1, {
    batchId: mockId,
    fileIds: [props.file.id],
  })
})

test('calls deleteBatchFilesWithDocuments with correct argument when delete associated docs checked and clicking on modal confirm', async () => {
  selectionSelector.mockImplementation(() => [])

  render(<DeleteBatchFiles {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const checkbox = screen.getByTestId('delete-associated-docs')
  await userEvent.click(checkbox)

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockDeleteBatchFilesWithDocuments).nthCalledWith(1, {
    batchId: mockId,
    fileIds: [props.file.id],
  })
})

test('calls notifySuccess with correct message in case successful deletion', async () => {
  render(<DeleteBatchFiles {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockNotification.notifySuccess).nthCalledWith(
    1,
    localize(Localization.DELETE_COMPLETED),
  )
})

test('calls notifyWarning with correct message in case of delete rejection', async () => {
  const mockError = new Error('test')
  const mockRejectedUnwrapFn = () => Promise.reject(mockError)

  mockDeleteBatchFilesFunction.mockImplementationOnce(() => ({
    unwrap: mockRejectedUnwrapFn,
  }))

  render(<DeleteBatchFiles {...props} />)

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

  mockDeleteBatchFilesFunction.mockImplementation(() => ({
    unwrap: mockRejectedUnwrapFn,
  }))

  render(<DeleteBatchFiles {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  const confirmBtn = screen.getByText(localize(Localization.CONFIRM))

  await userEvent.click(confirmBtn)

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.BATCH_NOT_FOUND),
  )
})

test('shows modal with title from batch prop in case of button click', async () => {
  selectionSelector.mockImplementation(() => [])

  render(<DeleteBatchFiles {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(screen.getByText(localize(Localization.DELETE_BATCH_FILE_CONFIRM_CONTENT, { name: mockBatchFile.name }))).toBeInTheDocument()
})

test('shows modal with batch deletion title when all files are selected', async () => {
  selectionSelector.mockImplementation(() => [mockBatchFile.id, mockBatchFile2.id])

  render(<DeleteBatchFiles {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(screen.getByText(localize(Localization.DELETE_BATCH_CONFIRM_TITLE, { name: mockBatch.name }))).toBeInTheDocument()
})

test('deletes entire batch when all files are selected', async () => {
  selectionSelector.mockImplementation(() => [mockBatchFile.id, mockBatchFile2.id])

  render(<DeleteBatchFiles {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))
  await userEvent.click(screen.getByText(localize(Localization.CONFIRM)))

  expect(mockDeleteBatchesFunction).toHaveBeenCalledWith({ ids: [mockId] })
})

test('deletes batch with documents when checkbox is checked and all files are selected', async () => {
  selectionSelector.mockImplementation(() => [mockBatchFile.id, mockBatchFile2.id])

  render(<DeleteBatchFiles {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))
  await userEvent.click(screen.getByTestId('delete-associated-docs'))
  await userEvent.click(screen.getByText(localize(Localization.CONFIRM)))

  expect(mockDeleteBatchesWithDocumentsFunction).toHaveBeenCalledWith({ ids: [mockId] })
})
