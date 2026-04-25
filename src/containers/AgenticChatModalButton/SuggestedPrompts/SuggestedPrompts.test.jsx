
import { mockEnv } from '@/mocks/mockEnv'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { SuggestedPrompts } from './SuggestedPrompts'

jest.mock('@/utils/env', () => mockEnv)

const promptKeys = [
  Localization.AGENTIC_CHAT_PROMPT_OVERVIEW,
  Localization.AGENTIC_CHAT_PROMPT_CREATE_DOCUMENT_TYPE,
  Localization.AGENTIC_CHAT_PROMPT_CONTEXT,
  Localization.AGENTIC_CHAT_PROMPT_EXTRACTION,
]

test('renders title and localized prompts list', () => {
  render(<SuggestedPrompts onPromptClick={jest.fn()} />)

  expect(
    screen.getByText(localize(Localization.AGENTIC_CHAT_POPULAR_PROMPTS_TITLE)),
  ).toBeInTheDocument()

  const list = screen.getByRole('list')
  const prompts = within(list).getAllByRole('listitem')
  expect(prompts).toHaveLength(promptKeys.length)

  promptKeys.forEach((promptKey, index) => {
    expect(prompts[index]).toHaveTextContent(localize(promptKey))
  })
})

test('invokes handler with localized prompt text when clicked', async () => {
  const onPromptClick = jest.fn()
  const user = userEvent.setup()

  render(<SuggestedPrompts onPromptClick={onPromptClick} />)

  const targetPromptText = localize(Localization.AGENTIC_CHAT_PROMPT_CONTEXT)
  await user.click(screen.getByText(targetPromptText))

  expect(onPromptClick).toHaveBeenCalledTimes(1)
  expect(onPromptClick).toHaveBeenCalledWith(targetPromptText)
})
