
import { mockEnv } from '@/mocks/mockEnv'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { LLMExtractionQueryNode } from '@/models/LLMExtractor'
import { render } from '@/utils/rendererRTL'
import { PromptChainCell } from './PromptChainCell'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/components/LongText', () => ({
  LongText: ({ text }) => <span data-testid="long-text">{text}</span>,
}))

const singlePromptChain = [
  new LLMExtractionQueryNode({
    id: '1',
    name: 'Prompt 1',
    prompt: 'Single prompt text',
  }),
]

const multiPromptChain = [
  new LLMExtractionQueryNode({
    id: '1',
    name: 'Prompt 1',
    prompt: 'First prompt',
  }),
  new LLMExtractionQueryNode({
    id: '2',
    name: 'Prompt 2',
    prompt: 'Second prompt',
  }),
]

test('renders prompt text if promptChain contains only one item', async () => {
  render(
    <PromptChainCell
      promptChain={singlePromptChain}
    />,
  )

  expect(screen.getByTestId('long-text')).toHaveTextContent(singlePromptChain[0].prompt)
})

test('renders tag with tooltip when there are multiple prompts', async () => {
  render(
    <PromptChainCell
      promptChain={multiPromptChain}
    />,
  )

  const [firstNode, secondNode] = multiPromptChain
  const tag = screen.getByTestId('tag')

  expect(within(tag).getByText(localize(Localization.PROMPTS))).toBeInTheDocument()
  expect(within(tag).getByText(multiPromptChain.length)).toBeInTheDocument()

  await userEvent.hover(tag)

  const tooltip = await screen.findByRole('tooltip')

  expect(tooltip).toHaveTextContent(`1. ${firstNode.name}`)
  expect(tooltip).toHaveTextContent(firstNode.prompt)
  expect(tooltip).toHaveTextContent(`2. ${secondNode.name}`)
  expect(tooltip).toHaveTextContent(secondNode.prompt)
})
