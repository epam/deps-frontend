
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { removeChatMessages } from '@/actions/genAiChat'
import { deleteAiConversationMessages } from '@/api/aiConversationApi'
import { Modal } from '@/components/Modal'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { DeletePromptButton } from './DeletePromptButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
}))
jest.mock('@/api/aiConversationApi', () => ({
  deleteAiConversationMessages: jest.fn(),
}))

Modal.confirm = jest.fn()
const mockDispatch = jest.fn()

const mockMessageId = 'mockMessageId'
const mockDocumentId = 'mockDocumentId'

test('shows DeletePromptButton', async () => {
  const props = {
    documentId: mockDocumentId,
    messageId: mockMessageId,
  }

  render(<DeletePromptButton {...props} />)

  expect(screen.getByRole('button')).toBeInTheDocument()
})

test('opens confirmation modal when button is clicked', async () => {
  const props = {
    documentId: mockDocumentId,
    messageId: mockMessageId,
  }

  render(<DeletePromptButton {...props} />)

  await userEvent.click(screen.getByRole('button'))

  expect(Modal.confirm).toHaveBeenCalledWith({
    title: localize(Localization.DELETE_PROMPT_CONFIRM_MESSAGE),
    onOk: expect.any(Function),
    okText: localize(Localization.DELETE),
  })
})

test('calls deleteAiConversationMessages while deletion', async () => {
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    documentId: mockDocumentId,
    messageId: mockMessageId,
  }

  render(<DeletePromptButton {...props} />)

  await userEvent.click(screen.getByRole('button'))

  expect(deleteAiConversationMessages).toHaveBeenCalledWith(mockDocumentId, mockMessageId)
})

test('dispatches removeChatMessages after successful deletion', async () => {
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    documentId: mockDocumentId,
    messageId: mockMessageId,
  }

  render(<DeletePromptButton {...props} />)

  await userEvent.click(screen.getByRole('button'))

  expect(mockDispatch).toHaveBeenCalledWith(
    removeChatMessages({
      documentId: mockDocumentId,
      messageId: mockMessageId,
    }),
  )
})

test('calls notifySuccess on successful deletion', async () => {
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    documentId: mockDocumentId,
    messageId: mockMessageId,
  }

  render(<DeletePromptButton {...props} />)

  await userEvent.click(screen.getByRole('button'))

  expect(mockNotification.notifySuccess).toHaveBeenCalledWith(localize(Localization.MESSAGE_DELETE_SUCCESS))
})

test('calls notifyWarning if deleteAiConversationMessages request fails', async () => {
  deleteAiConversationMessages.mockRejectedValueOnce(new Error('Deletion failed'))
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    documentId: mockDocumentId,
    messageId: mockMessageId,
  }

  render(<DeletePromptButton {...props} />)

  await userEvent.click(screen.getByRole('button'))

  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR_MESSAGE))
})
