
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AgentConversationsFilterKey } from '@/constants/navigation'
import { render } from '@/utils/rendererRTL'
import { ConversationsSearch } from './ConversationsSearch'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useChatSettings: () => mockUseChatSettings(),
}))

jest.mock('./ConversationsSearch.styles', () => ({
  Search: ({ filter, onChange }) => (
    <input
      data-testid="search-input"
      onChange={(e) => onChange(e.target.value)}
      value={filter}
    />
  ),
}))

const mockUseChatSettings = jest.fn()

const defaultChatData = {
  filters: {
    [AgentConversationsFilterKey.TITLE]: 'title',
  },
  setTitleFilter: jest.fn(),
}

test('shows title from passed filters as current search value', () => {
  mockUseChatSettings.mockReturnValue(defaultChatData)

  render(<ConversationsSearch />)

  const input = screen.getByTestId('search-input')
  expect(input).toHaveValue(defaultChatData.filters[AgentConversationsFilterKey.TITLE])
})

test('calls setFilters and shows new title if user sets new search value', async () => {
  mockUseChatSettings.mockReturnValue(defaultChatData)
  const newTitle = 'new title'

  render(<ConversationsSearch />)

  const input = screen.getByTestId('search-input')
  await userEvent.clear(input)
  await userEvent.type(input, newTitle)

  expect(defaultChatData.setTitleFilter).toHaveBeenCalledWith(newTitle)
  expect(input).toHaveValue(newTitle)
})
