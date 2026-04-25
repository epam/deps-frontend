
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { MAX_CONVERSATION_TITLE_LENGTH } from '../constants'
import { InitialConversationTitleInput } from './InitialConversationTitleInput'

jest.mock('@/utils/env', () => mockEnv)

test('calls setTitle on title change', async () => {
  const setTitle = jest.fn()
  const user = userEvent.setup()

  render(
    <InitialConversationTitleInput
      initialTitle=""
      setTitle={setTitle}
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.AGENTIC_CHAT_CONVERSATION_TITLE_PLACEHOLDER))

  await user.type(input, 'N')

  await waitFor(() => {
    expect(setTitle).toHaveBeenCalledWith('N')
  })
})

test('displays initialTitle if it was set', () => {
  const setTitle = jest.fn()
  const initialTitle = 'My Title'

  render(
    <InitialConversationTitleInput
      initialTitle={initialTitle}
      setTitle={setTitle}
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.AGENTIC_CHAT_CONVERSATION_TITLE_PLACEHOLDER))

  expect(input.value).toBe(initialTitle)
})

test('has maxLength of MAX_CONVERSATION_TITLE_LENGTH', () => {
  render(
    <InitialConversationTitleInput
      initialTitle=""
      setTitle={jest.fn()}
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.AGENTIC_CHAT_CONVERSATION_TITLE_PLACEHOLDER))

  expect(input).toHaveAttribute('maxLength', MAX_CONVERSATION_TITLE_LENGTH.toString())
})
