
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AgenticAiModes } from '@/enums/AgenticAiModes'
import { Localization, localize } from '@/localization/i18n'
import { ConversationsListItem } from '@/models/AgenticChat'
import { render } from '@/utils/rendererRTL'
import { ConversationsSidebar } from './ConversationsSidebar'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../ConversationsList/ConversationsList', () => ({
  ConversationsList: () => <div data-testid="conversations-list" />,
}))

jest.mock('../ConversationsSearch', () => ({
  ConversationsSearch: () => <div data-testid='conversations-search' />,
}))

const mockConversation1 = new ConversationsListItem({
  id: 'conv-1',
  agentVendorId: 'vendor-1',
  title: 'Conversation 1',
  mode: {
    id: 'mode-1',
    code: AgenticAiModes.DOCUMENT,
  },
  relation: {
    details: {
      documentId: 'doc-1',
    },
  },
})

const mockConversation2 = new ConversationsListItem({
  id: 'conv-2',
  agentVendorId: 'vendor-1',
  title: 'Conversation 2',
  mode: {
    id: 'mode-1',
    code: AgenticAiModes.DOCUMENT,
  },
  relation: {
    details: {
      documentId: 'doc-2',
    },
  },
})

const mockConversations = {
  'doc-1': [mockConversation1],
  'doc-2': [mockConversation2],
}

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    activeConversation: null,
    conversations: mockConversations,
    documentsIds: ['doc-1', 'doc-2'],
    fetchConversations: jest.fn(),
    hasMore: false,
    isFetching: false,
    onStartNewConversation: jest.fn(),
  }
})

test('renders correct layout', () => {
  render(<ConversationsSidebar {...defaultProps} />)

  const newConversationButton = screen.getByRole('button', {
    name: localize(Localization.AGENTIC_CHAT_START_NEW_CHAT),
  })

  expect(newConversationButton).toBeInTheDocument()
  expect(screen.getByTestId('conversations-list')).toBeInTheDocument()
  expect(screen.getByTestId('conversations-search')).toBeInTheDocument()
})

test('calls onStartNewConversation when NewConversationButton is clicked', async () => {
  const mockOnStartNewConversation = jest.fn()
  const user = userEvent.setup()

  render(
    <ConversationsSidebar
      {...defaultProps}
      onStartNewConversation={mockOnStartNewConversation}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.AGENTIC_CHAT_START_NEW_CHAT),
  })

  await user.click(button)

  expect(mockOnStartNewConversation).toHaveBeenCalledTimes(1)
})
