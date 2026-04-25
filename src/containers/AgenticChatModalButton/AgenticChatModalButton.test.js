
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { AgenticChatModalButton } from './AgenticChatModalButton'
import { useChatSettings } from './hooks'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/DraggableModal', () => ({
  DraggableModal: ({ children, isModalVisible, renderHeaderContent }) => (
    isModalVisible && (
      <div data-testid="modal">
        {renderHeaderContent()}
        {children}
      </div>
    )
  ),
}))

jest.mock('./AgenticChat', () => ({
  AgenticChat: () => <div data-testid='agentic-chat' />,
}))

jest.mock('./ModalHeader', () => ({
  ModalHeader: () => <div data-testid='modal-header' />,
}))

jest.mock('./providers', () => ({
  ChatSettingsProvider: ({ children }) => children,
}))

jest.mock('./hooks', () => ({
  useChatSettings: jest.fn(() => ({
    isExpandedView: false,
    isModalVisible: false,
    openModal: mockOpenModal,
  })),
}))

const mockOpenModal = jest.fn()

test('renders trigger button', () => {
  render(<AgenticChatModalButton />)

  const triggerButton = screen.getByRole('button', {
    name: localize(Localization.DEPS_AGENT_CHAT),
  })

  expect(triggerButton).toBeInTheDocument()
})

test('calls openModal on trigger button click', async () => {
  render(<AgenticChatModalButton />)

  const triggerButton = screen.getByRole('button', {
    name: localize(Localization.DEPS_AGENT_CHAT),
  })
  await userEvent.click(triggerButton)

  expect(mockOpenModal).toHaveBeenCalled()
})

test('renders base modal with correct layout', async () => {
  useChatSettings.mockImplementationOnce(() => ({
    isExpandedView: false,
    isModalVisible: true,
    openModal: mockOpenModal,
  }))

  render(<AgenticChatModalButton />)

  expect(screen.getByTestId('modal')).toBeInTheDocument()
  expect(screen.getByTestId('modal-header')).toBeInTheDocument()
  expect(screen.getByTestId('agentic-chat')).toBeInTheDocument()
})

test('shows expanded modal with correct layout', async () => {
  useChatSettings.mockImplementationOnce(() => ({
    isExpandedView: true,
    isModalVisible: true,
    openModal: mockOpenModal,
  }))

  render(<AgenticChatModalButton />)

  expect(screen.getByRole('dialog')).toBeInTheDocument()
  expect(screen.getByTestId('modal-header')).toBeInTheDocument()
  expect(screen.getByTestId('agentic-chat')).toBeInTheDocument()
})
