
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { ChatFooter } from './ChatFooter'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../hooks', () => ({
  useChatSettings: () => ({
    isExpandedView: false,
  }),
}))

jest.mock('../ConversationSettings', () => ({
  ConversationSettings: ({ disabled }) => (
    <div data-testid='conversation-settings'>
      {disabled && <span data-testid='settings-disabled' />}
    </div>
  ),
}))

jest.mock('../ChatInput', () => ({
  ChatInput: ({ disabled, prompt, saveDialog, setPrompt }) => (
    <div data-testid='chat-input'>
      <input
        data-testid='input-field'
        disabled={disabled}
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      <button
        data-testid='send-button'
        disabled={disabled}
        onClick={saveDialog}
      >
        Send
      </button>
    </div>
  ),
}))

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    disabled: false,
    prompt: '',
    onSendMessage: jest.fn(),
    setPrompt: jest.fn(),
  }
})

test('renders ConversationSettings and ChatInput components', () => {
  render(<ChatFooter {...defaultProps} />)

  expect(screen.getByTestId('conversation-settings')).toBeInTheDocument()
  expect(screen.getByTestId('chat-input')).toBeInTheDocument()
})

test('passes disabled prop to ConversationSettings and ChatInput', () => {
  render(
    <ChatFooter
      {...defaultProps}
      disabled={true}
    />,
  )

  expect(screen.getByTestId('settings-disabled')).toBeInTheDocument()
  expect(screen.getByTestId('input-field')).toBeDisabled()
  expect(screen.getByTestId('send-button')).toBeDisabled()
})

test('passes prompt value to ChatInput', () => {
  render(
    <ChatFooter
      {...defaultProps}
      prompt='test message'
    />,
  )

  expect(screen.getByTestId('input-field')).toHaveValue('test message')
})

test('calls setPrompt when input changes', async () => {
  const user = userEvent.setup()

  render(<ChatFooter {...defaultProps} />)

  await user.type(screen.getByTestId('input-field'), 'a')

  expect(defaultProps.setPrompt).toHaveBeenCalled()
})

test('calls onSendMessage when send button is clicked', async () => {
  const user = userEvent.setup()

  render(<ChatFooter {...defaultProps} />)

  await user.click(screen.getByTestId('send-button'))

  expect(defaultProps.onSendMessage).toHaveBeenCalledTimes(1)
})
