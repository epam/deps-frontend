
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { AgenticAiModes } from '@/enums/AgenticAiModes'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { ConversationsListItem as ConversationsListItemModel } from '@/models/AgenticChat'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { DeleteConversationButton } from './DeleteConversationButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification')

const mockDeleteConversation = jest.fn()
let mockDeleteMutationState

jest.mock('@/apiRTK/agenticAiApi', () => ({
  useDeleteConversationMutation: () => [
    mockDeleteConversation,
    mockDeleteMutationState,
  ],
}))

jest.mock('@/components/Modal', () => ({
  Modal: {
    confirm: jest.fn(({ onOk }) => {
      onOk?.()
    }),
  },
}))

const mockSetActiveConversationId = jest.fn()
const mockSetIsNewConversationMode = jest.fn()
let mockActiveConversationId = null

jest.mock('../hooks', () => ({
  useChatSettings: () => ({
    activeConversationId: mockActiveConversationId,
    setActiveConversationId: mockSetActiveConversationId,
    setIsNewConversationMode: mockSetIsNewConversationMode,
  }),
}))

const mockConversation = new ConversationsListItemModel({
  id: 'conversation-1',
  agentVendorId: 'agent-1',
  mode: {
    id: 'mode-1',
    code: AgenticAiModes.DOCUMENT,
  },
  title: 'Test Conversation Title',
  relation: {
    details: {
      documentId: 'doc-1',
    },
  },
})

const mockNextConversation = new ConversationsListItemModel({
  id: 'conversation-2',
  agentVendorId: 'agent-1',
  mode: {
    id: 'mode-1',
    code: AgenticAiModes.DOCUMENT,
  },
  title: 'Next Conversation',
  relation: {
    details: {
      documentId: 'doc-1',
    },
  },
})

const mockTrigger = jest.fn(({ onClick, disabled }) => (
  <button
    disabled={disabled}
    onClick={onClick}
  >
    {localize(Localization.DELETE)}
  </button>
))

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  mockActiveConversationId = null
  mockDeleteConversation.mockReturnValue({
    unwrap: jest.fn().mockResolvedValue({}),
  })
  mockDeleteMutationState = { isLoading: false }

  defaultProps = {
    conversationId: mockConversation.id,
    conversationTitle: mockConversation.title,
    nextConversationId: null,
    onAfterDelete: jest.fn(),
    renderTrigger: mockTrigger,
  }
})

test('shows confirmation modal when clicking delete button', async () => {
  const user = userEvent.setup()

  render(<DeleteConversationButton {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.DELETE) })
  await user.click(button)

  expect(Modal.confirm).toHaveBeenNthCalledWith(1, {
    title: localize(Localization.CONFIRM_DELETING_CONVERSATION_MESSAGE, { title: mockConversation.title }),
    okText: localize(Localization.DELETE),
    cancelText: localize(Localization.CANCEL),
    onOk: expect.any(Function),
  })
})

test('deletes conversation and calls onAfterDelete when confirming', async () => {
  const user = userEvent.setup()

  render(<DeleteConversationButton {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.DELETE) })
  await user.click(button)

  await waitFor(() => {
    expect(mockDeleteConversation).toHaveBeenNthCalledWith(1, mockConversation.id)
  })
  await waitFor(() => {
    expect(defaultProps.onAfterDelete).toHaveBeenCalled()
  })
})

test('shows success notification after successful deletion', async () => {
  const user = userEvent.setup()

  render(<DeleteConversationButton {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.DELETE) })
  await user.click(button)

  await waitFor(() => {
    expect(notifySuccess).toHaveBeenNthCalledWith(1, localize(Localization.DELETE_COMPLETED))
  })
})

test('shows specific error message when deletion fails with known error code', async () => {
  const errorCode = ErrorCode.notFoundError
  const mockError = {
    data: {
      code: errorCode,
    },
  }

  mockDeleteConversation.mockReturnValue({
    unwrap: jest.fn().mockRejectedValue(mockError),
  })

  const user = userEvent.setup()

  render(<DeleteConversationButton {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.DELETE) })
  await user.click(button)

  await waitFor(() => {
    expect(notifyWarning).toHaveBeenNthCalledWith(
      1,
      RESOURCE_ERROR_TO_DISPLAY[errorCode],
    )
  })
})

test('shows default error message when deletion fails with unknown error code', async () => {
  const mockError = {
    data: {
      code: 'unknown_error_code',
    },
  }

  mockDeleteConversation.mockReturnValue({
    unwrap: jest.fn().mockRejectedValue(mockError),
  })

  const user = userEvent.setup()

  render(<DeleteConversationButton {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.DELETE) })
  await user.click(button)

  await waitFor(() => {
    expect(notifyWarning).toHaveBeenNthCalledWith(
      1,
      localize(Localization.DELETE_FAILED),
    )
  })
})

test('stops event propagation when clicking button', async () => {
  const onParentClick = jest.fn()
  const user = userEvent.setup()

  render(
    <div onClick={onParentClick}>
      <DeleteConversationButton {...defaultProps} />
    </div>,
  )

  const button = screen.getByRole('button', { name: localize(Localization.DELETE) })
  await user.click(button)

  expect(onParentClick).not.toHaveBeenCalled()
})

test('selects next conversation when deleting active conversation and next conversation is available', async () => {
  mockActiveConversationId = mockConversation.id
  const user = userEvent.setup()

  render(
    <DeleteConversationButton
      {...defaultProps}
      nextConversationId={mockNextConversation.id}
    />,
  )

  const button = screen.getByRole('button', { name: localize(Localization.DELETE) })
  await user.click(button)

  expect(mockSetActiveConversationId).toHaveBeenNthCalledWith(1, mockNextConversation.id)
  expect(mockSetIsNewConversationMode).not.toHaveBeenCalled()
})

test('clears active conversation and enters new conversation mode when no next conversation', async () => {
  mockActiveConversationId = mockConversation.id
  const user = userEvent.setup()

  render(<DeleteConversationButton {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.DELETE) })
  await user.click(button)

  await waitFor(() => {
    expect(mockSetActiveConversationId).toHaveBeenNthCalledWith(1, null)
  })
  expect(mockSetIsNewConversationMode).toHaveBeenNthCalledWith(1, true)
})

test('clears active conversation and enters new mode when nextConversationId equals conversationId', async () => {
  mockActiveConversationId = mockConversation.id
  const user = userEvent.setup()

  render(
    <DeleteConversationButton
      {...defaultProps}
      nextConversationId={mockConversation.id}
    />,
  )

  const button = screen.getByRole('button', { name: localize(Localization.DELETE) })
  await user.click(button)

  expect(mockSetActiveConversationId).toHaveBeenCalledWith(null)
  expect(mockSetIsNewConversationMode).toHaveBeenNthCalledWith(1, true)
})

test('does not enter new conversation mode when there is nextConversationId', async () => {
  mockActiveConversationId = mockConversation.id
  const user = userEvent.setup()

  render(
    <DeleteConversationButton
      {...defaultProps}
      nextConversationId={mockNextConversation.id}
    />,
  )

  const button = screen.getByRole('button', { name: localize(Localization.DELETE) })
  await user.click(button)

  await waitFor(() => {
    expect(mockSetIsNewConversationMode).not.toHaveBeenCalled()
  })
})

test('does not change active conversation or enter new conversation mode when deleted conversation is not active', async () => {
  mockActiveConversationId = 'active-conversation-id'
  const user = userEvent.setup()

  render(<DeleteConversationButton {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.DELETE) })
  await user.click(button)

  expect(mockSetActiveConversationId).not.toHaveBeenCalled()
  expect(mockSetIsNewConversationMode).not.toHaveBeenCalled()
})

test('disables button when deletion is in progress', () => {
  mockDeleteMutationState = { isLoading: true }

  render(<DeleteConversationButton {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.DELETE) })
  expect(button).toBeDisabled()
})
