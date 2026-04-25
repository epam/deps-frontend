
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FileGenAIModalButton } from './FileGenAIModalButton'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Button', () => ({
  Button: {
    Secondary: (props) => (
      <button
        aria-label={props['aria-label']}
        data-testid="chat-button"
        disabled={props.disabled}
        onClick={props.onClick}
        title={props.tooltip?.title}
      >
        {props.icon}
      </button>
    ),
  },
}))

jest.mock('@/components/Icons/MessageIcon', () => ({
  MessageIcon: () => <span data-testid="message-icon">MessageIcon</span>,
}))

describe('FileGenAIModalButton', () => {
  let defaultProps

  beforeEach(() => {
    jest.clearAllMocks()

    defaultProps = {
      isModalVisible: false,
      toggleModal: jest.fn(),
    }
  })

  test('renders chat button', () => {
    render(<FileGenAIModalButton {...defaultProps} />)

    const button = screen.getByTestId('chat-button')
    expect(button).toBeInTheDocument()
  })

  test('renders MessageIcon inside button', () => {
    render(<FileGenAIModalButton {...defaultProps} />)

    const icon = screen.getByTestId('message-icon')
    expect(icon).toBeInTheDocument()
  })

  test('has correct tooltip', () => {
    render(<FileGenAIModalButton {...defaultProps} />)

    const button = screen.getByTestId('chat-button')
    expect(button).toHaveAttribute('title', localize(Localization.OPEN_CHAT))
  })

  test('calls toggleModal when button is clicked', async () => {
    render(<FileGenAIModalButton {...defaultProps} />)

    const button = screen.getByTestId('chat-button')
    await userEvent.click(button)

    expect(defaultProps.toggleModal).toHaveBeenCalledTimes(1)
  })

  describe('onClick handler', () => {
    test('does not call toggleModal multiple times on single click', async () => {
      render(<FileGenAIModalButton {...defaultProps} />)

      const button = screen.getByTestId('chat-button')
      await userEvent.click(button)

      expect(defaultProps.toggleModal).toHaveBeenCalledTimes(1)
    })
  })

  test('button is disabled when modal is visible', () => {
    defaultProps.isModalVisible = true

    render(<FileGenAIModalButton {...defaultProps} />)

    const button = screen.getByTestId('chat-button')
    expect(button).toBeDisabled()
  })

  test('does not call toggleModal when button is disabled', async () => {
    defaultProps.isModalVisible = true

    render(<FileGenAIModalButton {...defaultProps} />)

    const button = screen.getByTestId('chat-button')
    await userEvent.click(button)

    expect(defaultProps.toggleModal).not.toHaveBeenCalled()
  })
})
