
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { LLMExtractionQueryNode } from '@/models/LLMExtractor'
import { ENV } from '@/utils/env'
import { render } from '@/utils/rendererRTL'
import { PromptPreviewButton } from './PromptPreviewButton'

jest.mock('@/utils/env', () => mockEnv)

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

test('renders nothing if no promptChain', () => {
  const { container } = render(
    <PromptPreviewButton
      promptChain={undefined}
    />,
  )

  expect(container).toBeEmptyDOMElement()
})

test('renders nothing if feature flag FEATURE_LLM_EXTRACTORS is off', () => {
  ENV.FEATURE_LLM_EXTRACTORS = false

  const { container } = render(
    <PromptPreviewButton
      promptChain={singlePromptChain}
    />,
  )

  expect(container).toBeEmptyDOMElement()

  ENV.FEATURE_LLM_EXTRACTORS = true
})

test('renders single prompt button with tooltip', async () => {
  render(
    <PromptPreviewButton
      promptChain={singlePromptChain}
    />,
  )

  const actionButton = screen.getByRole('button', {
    name: localize(Localization.PROMPT),
  })

  await userEvent.hover(actionButton)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(singlePromptChain[0].prompt)
  })
})

test('renders multi-prompt button with tooltip', async () => {
  render(
    <PromptPreviewButton
      promptChain={multiPromptChain}
    />,
  )

  const [firstNode, secondNode] = multiPromptChain
  const actionButton = screen.getByRole('button', {
    name: localize(Localization.PROMPTS),
  })

  await userEvent.hover(actionButton)

  const tooltip = await screen.findByRole('tooltip')

  expect(tooltip).toHaveTextContent(`1. ${firstNode.name}`)
  expect(tooltip).toHaveTextContent(firstNode.prompt)
  expect(tooltip).toHaveTextContent(`2. ${secondNode.name}`)
  expect(tooltip).toHaveTextContent(secondNode.prompt)
})
