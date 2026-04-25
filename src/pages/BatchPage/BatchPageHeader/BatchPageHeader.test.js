
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { BatchPageHeader } from '.'

var mockBackBtn
const mockPatchBatch = jest.fn(() => ({
  unwrap: jest.fn(),
}))
const mockUsePatchBatchMutation = jest.fn(() => [mockPatchBatch, { isLoading: false }])

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/utils/notification', () => mockNotification)

jest.mock('./BatchGroupInfo', () => mockShallowComponent('BatchGroupInfo'))
jest.mock('./BatchActions', () => mockShallowComponent('BatchActions'))
jest.mock('@/containers/BackToSourceButton', () => {
  const mock = mockShallowComponent('BackToSourceButton')
  mockBackBtn = mock.BackToSourceButton
  return mock
})

const mockBatchId = '123'

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({
    id: mockBatchId,
  })),
}))

const mockBatchName = 'hola'

jest.mock('@/apiRTK/batchesApi', () => ({
  useFetchBatchQuery: jest.fn(() => ({
    data: {
      name: mockBatchName,
    },
    isFetching: false,
  })),
  usePatchBatchMutation: () => mockUsePatchBatchMutation(),
}))

const TEST_ID = {
  EDIT_BATCH_NAME: 'edit-batch-name',
  TEXT_EDITOR_MODAL_INPUT: 'text-editor-modal-input',
  TEXT_EDITOR_MODAL_SUBMIT: 'text-editor-modal-submit',
  TEXT_EDITOR_MODAL_CANCEL: 'text-editor-modal-cancel',
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders BatchGroupInfo', () => {
  render(<BatchPageHeader />)
  const BatchGroupInfo = screen.getByTestId('BatchGroupInfo')

  expect(BatchGroupInfo).toBeInTheDocument()
})

test('renders BatchActions', () => {
  render(<BatchPageHeader />)
  const actions = screen.getByTestId('BatchActions')

  expect(actions).toBeInTheDocument()
})

test('renders BackToSourceButton with correct sourcePath prop', () => {
  render(<BatchPageHeader />)
  const back = screen.getByTestId('BackToSourceButton')

  expect(back).toBeInTheDocument()
  expect(mockBackBtn.getProps()).toEqual({ sourcePath: navigationMap.batches() })
})

test('renders Title with correct text', () => {
  render(<BatchPageHeader />)
  const title = screen.getByText(mockBatchName)

  expect(title).toBeInTheDocument()
})

test('opens modal with correct props when edit button is clicked', async () => {
  render(<BatchPageHeader />)
  const editButton = screen.getByTestId(TEST_ID.EDIT_BATCH_NAME)

  await userEvent.click(editButton)

  const modal = screen.getByRole('dialog')
  const input = screen.getByTestId(TEST_ID.TEXT_EDITOR_MODAL_INPUT)

  expect(modal).toBeInTheDocument()
  expect(input).toHaveValue(mockBatchName)
})

test('submits new batch name when onSubmit is called with different name', async () => {
  render(<BatchPageHeader />)
  const editButton = screen.getByTestId(TEST_ID.EDIT_BATCH_NAME)

  await userEvent.click(editButton)

  const input = screen.getByTestId(TEST_ID.TEXT_EDITOR_MODAL_INPUT)
  const submitButton = screen.getByTestId(TEST_ID.TEXT_EDITOR_MODAL_SUBMIT)

  await userEvent.clear(input)
  await userEvent.type(input, 'New Batch Name')
  await userEvent.click(submitButton)

  expect(mockPatchBatch).toHaveBeenCalledWith({
    batchId: mockBatchId,
    data: { name: 'New Batch Name' },
  })
})

test('does not submit when onSubmit is called with same name', async () => {
  render(<BatchPageHeader />)
  const editButton = screen.getByTestId(TEST_ID.EDIT_BATCH_NAME)

  await userEvent.click(editButton)

  const input = screen.getByTestId(TEST_ID.TEXT_EDITOR_MODAL_INPUT)
  const submitButton = screen.getByTestId(TEST_ID.TEXT_EDITOR_MODAL_SUBMIT)

  await userEvent.clear(input)
  await userEvent.type(input, mockBatchName)
  await userEvent.click(submitButton)

  expect(mockPatchBatch).not.toHaveBeenCalled()
})

test('handles error during batch name update and shows warning notification', async () => {
  const mockError = new Error('Update failed')
  mockPatchBatch.mockImplementationOnce(() => ({
    unwrap: jest.fn().mockRejectedValue(mockError),
  }))

  render(<BatchPageHeader />)
  const editButton = screen.getByTestId(TEST_ID.EDIT_BATCH_NAME)

  await userEvent.click(editButton)

  const input = screen.getByTestId(TEST_ID.TEXT_EDITOR_MODAL_INPUT)
  const submitButton = screen.getByTestId(TEST_ID.TEXT_EDITOR_MODAL_SUBMIT)

  await userEvent.clear(input)
  await userEvent.type(input, 'New Batch Name')
  await userEvent.click(submitButton)

  expect(notifyWarning).toHaveBeenCalledWith(localize(Localization.FAILED_TO_UPDATE_BATCH_NAME))
})
