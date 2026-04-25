
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { ChatContent } from './ChatContent'

jest.mock('@/utils/env', () => mockEnv)

const mockUseChatSettings = jest.fn()

jest.mock('../hooks', () => ({
  useChatSettings: () => mockUseChatSettings(),
}))

jest.mock('../Conversation', () => ({
  Conversation: () => (
    <div data-testid='conversation' />
  ),
}))

jest.mock('../SuggestedPrompts', () => ({
  SuggestedPrompts: ({ onPromptClick }) => (
    <button
      data-testid='suggested-prompts'
      onClick={onPromptClick}
    />
  ),
}))

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  mockUseChatSettings.mockReturnValue({
    isExpandedView: false,
    activeConversationId: null,
  })
  defaultProps = {
    containerRef: { current: null },
    isCompletionProcessing: false,
    onSuggestedPromptClick: jest.fn(),
    editMessage: jest.fn(),
  }
})

test('renders SuggestedPrompts when no activeConversation and not fetching', () => {
  render(
    <ChatContent
      {...defaultProps}
    />,
  )

  expect(screen.getByTestId('suggested-prompts')).toBeInTheDocument()
})

test('renders Conversation when activeConversationId is present', () => {
  mockUseChatSettings.mockReturnValue({
    isExpandedView: false,
    activeConversationId: 'testConversationId',
  })

  render(
    <ChatContent
      {...defaultProps}
    />,
  )

  expect(screen.getByTestId('conversation')).toBeInTheDocument()
})

test('calls onSuggestedPromptClick when prompt is clicked', async () => {
  const user = userEvent.setup()

  render(
    <ChatContent
      {...defaultProps}
    />,
  )

  await user.click(screen.getByTestId('suggested-prompts'))

  expect(defaultProps.onSuggestedPromptClick).toHaveBeenCalledTimes(1)
})
