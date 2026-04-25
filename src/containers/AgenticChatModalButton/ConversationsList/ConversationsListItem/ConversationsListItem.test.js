
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { render } from '@/utils/rendererRTL'
import { ConversationsListItem } from './ConversationsListItem'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react', () => mockReact())

jest.mock('../../MoreConversationActions', () => ({
  MoreConversationActions: ({ hideMoreActions, onAfterRename }) => {
    const onClick = () => {
      hideMoreActions()
      onAfterRename(newConversationTitle)
    }

    return (
      <div data-testid='more-conversation-actions'>
        <button
          data-testid='rename-button'
          onClick={onClick}
        />
      </div>
    )
  },
}))

jest.mock('@/components/LongText', () => ({
  LongText: ({ text, onClick }) => <div onClick={onClick}>{text}</div>,
}))

const newConversationTitle = 'New Conversation Title'
const mockSetIsMoreActionsVisible = jest.fn()

const defaultProps = {
  conversationId: 'conversation-id',
  conversationTitle: 'Conversation Title',
  isActive: false,
  itemRef: null,
  onAfterDelete: jest.fn(),
  selectConversation: jest.fn(),
  updateConversationTitle: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
  useState.mockReturnValue([false, mockSetIsMoreActionsVisible])
})

test('renders conversation list item correctly', async () => {
  render(<ConversationsListItem {...defaultProps} />)

  const listItem = screen.getByRole('listitem')
  expect(listItem).toHaveTextContent(defaultProps.conversationTitle)
})

test('renders more actions menu on visibility state changing', async () => {
  const { rerender } = render(<ConversationsListItem {...defaultProps} />)
  expect(screen.queryByTestId('more-conversation-actions')).not.toBeInTheDocument()

  useState.mockReturnValueOnce([true, mockSetIsMoreActionsVisible])
  rerender(<ConversationsListItem {...defaultProps} />)
  expect(screen.getByTestId('more-conversation-actions')).toBeInTheDocument()
})

test('calls selectConversation on conversation title click', async () => {
  render(<ConversationsListItem {...defaultProps} />)

  const conversation = screen.getByText(defaultProps.conversationTitle)
  await userEvent.click(conversation)

  expect(defaultProps.selectConversation).toHaveBeenCalled()
})

test('calls updateConversationTitle and hide more actions menu on conversation rename button click', async () => {
  useState.mockReturnValueOnce([true, mockSetIsMoreActionsVisible])

  render(<ConversationsListItem {...defaultProps} />)

  const renameButton = screen.getByTestId('rename-button')
  await userEvent.click(renameButton)

  expect(defaultProps.updateConversationTitle).nthCalledWith(1, newConversationTitle)
  expect(mockSetIsMoreActionsVisible).nthCalledWith(1, false)
})
