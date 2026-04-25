
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { ConversationsListItem } from '@/models/AgenticChat'
import { render } from '@/utils/rendererRTL'
import { ConversationSelector } from './ConversationSelector'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Menu', () => {
  const MockMenu = ({ children }) => (
    <ul
      data-testid="menu"
      role="menu"
    >
      {children}
    </ul>
  )
  MockMenu.Item = ({ children, onClick, eventKey }) => (
    <li
      data-key={eventKey}
      onClick={onClick}
      role="menuitem"
    >
      {children}
    </li>
  )
  return {
    Menu: MockMenu,
    MenuTrigger: {
      CLICK: 'click',
    },
  }
})

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useChatSettings: () => mockUseChatSettings(),
}))

const mockUseChatSettings = jest.fn()
const mockSetActiveConversationId = jest.fn()
const mockDocumentId = 'docId'

const mockConversation1 = new ConversationsListItem({
  id: 'conv-1',
  agentVendorId: 'vendor-1',
  title: 'Conversation 1',
  mode: {
    id: 'mode-1',
    code: 'default',
  },
  relation: {
    details: {
      documentId: mockDocumentId,
    },
  },
})

const mockConversation2 = new ConversationsListItem({
  id: 'conv-2',
  agentVendorId: 'vendor-1',
  title: 'Conversation 2',
  mode: {
    id: 'mode-1',
    code: 'default',
  },
  relation: {
    details: {
      documentId: mockDocumentId,
    },
  },
})

const mockConversation3 = new ConversationsListItem({
  id: 'conv-3',
  agentVendorId: 'vendor-1',
  title: 'Conversation 3',
  mode: {
    id: 'mode-1',
    code: 'default',
  },
  relation: {
    details: {
      documentId: mockDocumentId,
    },
  },
})

const mockConversations = [mockConversation1, mockConversation2, mockConversation3]

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()

  mockUseChatSettings.mockReturnValue({
    activeConversationId: mockConversation1.id,
    setActiveConversationId: mockSetActiveConversationId,
  })

  defaultProps = {
    currentDocumentConversations: mockConversations,
    disabled: false,
  }
})

test('renders dropdown trigger with active conversation title', () => {
  render(<ConversationSelector {...defaultProps} />)

  expect(screen.getByText(mockConversation1.title)).toBeInTheDocument()
})

test('opens dropdown and displays conversations when clicked', async () => {
  const user = userEvent.setup()

  render(<ConversationSelector {...defaultProps} />)

  await user.click(screen.getByText(mockConversation1.title))

  expect(screen.getByText(mockConversation2.title)).toBeInTheDocument()
  expect(screen.getByText(mockConversation3.title)).toBeInTheDocument()
})

test('calls setActiveConversationId when conversation is clicked', async () => {
  const user = userEvent.setup()

  render(<ConversationSelector {...defaultProps} />)

  await user.click(screen.getByText(mockConversation1.title))
  await user.click(screen.getByText(mockConversation2.title))

  expect(mockSetActiveConversationId).nthCalledWith(1, mockConversation2.id)
})

test('disables dropdown when disabled prop is true', async () => {
  const user = userEvent.setup()

  render(
    <ConversationSelector
      {...defaultProps}
      disabled
    />,
  )

  await user.click(screen.getByText(mockConversation1.title))

  expect(screen.queryByTestId('dropdown-content')).not.toBeInTheDocument()
})

test('renders correct dropdown trigger when no active conversation', async () => {
  mockUseChatSettings.mockReturnValue({
    activeConversationId: null,
    setActiveConversationId: mockSetActiveConversationId,
  })

  render(<ConversationSelector {...defaultProps} />)

  const button = screen.getByTestId('switch-conversations-button')

  await userEvent.hover(button)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.AGENTIC_CHAT_SWITCH_CONVERSATION))
  })
})
