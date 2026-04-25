
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { MoreConversationActions } from './MoreConversationActions'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../RenameConversationButton', () => ({
  RenameConversationButton: ({ renderTrigger }) => renderTrigger({ onClick: jest.fn() }),
}))

jest.mock('../DeleteConversationButton', () => ({
  DeleteConversationButton: ({ renderTrigger }) => renderTrigger({
    onClick: jest.fn(),
    disabled: false,
  }),
}))

const defaultProps = {
  conversationId: 'conversation-id',
  conversationTitle: 'Conversation Title',
  isActive: false,
  hideMoreActions: jest.fn(),
  onAfterDelete: jest.fn(),
  onAfterRename: jest.fn(),
}

test('renders menu with correct items on more actions button click', async () => {
  render(<MoreConversationActions {...defaultProps} />)

  const button = screen.getByRole('button')
  await userEvent.click(button)

  expect(screen.getByRole('menu')).toBeInTheDocument()
  const [renameItem, deleteItem] = screen.getAllByRole('menuitem')
  expect(renameItem).toHaveTextContent(localize(Localization.RENAME))
  expect(deleteItem).toHaveTextContent(localize(Localization.DELETE))
})
