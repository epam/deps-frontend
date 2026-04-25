
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { ConversationsListItem } from '@/models/AgenticChat'
import { render } from '@/utils/rendererRTL'
import { ChatHeaderBase } from './ChatHeaderBase'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../ConversationSelector', () =>
  mockShallowComponent('ConversationSelector'),
)

jest.mock('../InitialConversationTitleInput', () =>
  mockShallowComponent('InitialConversationTitleInput'),
)

const mockActiveConversation = new ConversationsListItem({
  id: 'conv-1',
  agentVendorId: 'vendor-1',
  title: 'Test Conversation',
  mode: {
    id: 'mode-1',
    code: 'default',
  },
  relation: {
    details: { documentId: 'doc-1' },
  },
})

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    activeConversationId: null,
    currentDocumentConversations: [mockActiveConversation],
    initialTitle: 'New Conversation',
    onTitleChange: jest.fn(),
    onCreateNew: jest.fn(),
    disabled: false,
  }
})

test('renders correct layout when no active conversation exists', () => {
  render(<ChatHeaderBase {...defaultProps} />)

  expect(screen.getByTestId('InitialConversationTitleInput')).toBeInTheDocument()
  expect(screen.getByTestId('create-new-conversation-button')).toBeInTheDocument()
  expect(screen.getByTestId('ConversationSelector')).toBeInTheDocument()
})

test('renders correct layout when there is an active conversation', () => {
  render(
    <ChatHeaderBase
      {...defaultProps}
      activeConversationId={mockActiveConversation.id}
    />,
  )

  expect(screen.getByTestId('ConversationSelector')).toBeInTheDocument()
  expect(screen.getByTestId('create-new-conversation-button')).toBeInTheDocument()
  expect(screen.queryByTestId('InitialConversationTitleInput')).not.toBeInTheDocument()
})

test('renders create new conversation button with correct tooltip', async () => {
  render(
    <ChatHeaderBase
      {...defaultProps}
      activeConversationId={mockActiveConversation.id}
    />,
  )

  const createNewButton = screen.getByTestId('create-new-conversation-button')
  await userEvent.hover(createNewButton)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.AGENTIC_CHAT_CREATE_NEW_CONVERSATION))
  })
})

test('calls onCreateNew when trigger button is clicked', async () => {
  const user = userEvent.setup()

  render(
    <ChatHeaderBase
      {...defaultProps}
      activeConversationId={mockActiveConversation.id}
    />,
  )

  const createNewButton = screen.getByTestId('create-new-conversation-button')
  await user.click(createNewButton)

  expect(defaultProps.onCreateNew).toHaveBeenCalledTimes(1)
})

test('disables create conversation button when disabled prop is true', () => {
  render(
    <ChatHeaderBase
      {...defaultProps}
      activeConversationId={mockActiveConversation.id}
      disabled
    />,
  )

  const createNewButton = screen.getByTestId('create-new-conversation-button')
  expect(createNewButton).toBeDisabled()
})

test('disables create conversation button when no active conversation', () => {
  render(
    <ChatHeaderBase
      {...defaultProps}
      activeConversationId={null}
    />,
  )
  const createNewButton = screen.getByTestId('create-new-conversation-button')
  expect(createNewButton).toBeDisabled()
})
