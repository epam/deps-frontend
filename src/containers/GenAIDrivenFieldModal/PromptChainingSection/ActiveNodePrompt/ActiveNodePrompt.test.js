
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { REQUIRED_FIELD_MARKER } from '@/containers/GenAIDrivenFieldModal/constants'
import { Localization, localize } from '@/localization/i18n'
import { LLMExtractionQueryNode } from '@/models/LLMExtractor'
import { render } from '@/utils/rendererRTL'
import { ActiveNodePrompt } from './ActiveNodePrompt'

jest.mock('@/utils/env', () => mockEnv)

test('renders with empty value and shows required mark with tooltip', async () => {
  const mockNode = new LLMExtractionQueryNode({
    id: 'test-id',
    name: 'test-name',
    prompt: '',
  })

  render(
    <ActiveNodePrompt
      activeNode={mockNode}
      onChange={jest.fn()}
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.PROMPT_PLACEHOLDER))
  const requiredMark = screen.getByText(REQUIRED_FIELD_MARKER)

  expect(input).toHaveValue('')
  expect(requiredMark).toBeInTheDocument()

  await userEvent.hover(input)

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(localize(Localization.REQUIRED_FIELD))
  })
})

test('renders with a prompt value and without required mark', () => {
  const mockPrompt = 'This is a test prompt'

  const mockNode = new LLMExtractionQueryNode({
    id: 'test-id',
    name: 'test-name',
    prompt: mockPrompt,
  })

  render(
    <ActiveNodePrompt
      activeNode={mockNode}
      onChange={jest.fn()}
    />,
  )

  const input = screen.getByDisplayValue(mockPrompt)
  expect(input).toBeInTheDocument()
  expect(screen.queryByTestId('required-mark')).not.toBeInTheDocument()
})

test('calls onChange when input changes', async () => {
  const handleChange = jest.fn()
  const mockNode = new LLMExtractionQueryNode({
    id: 'test-id',
    name: 'test-name',
    prompt: '',
  })

  render(
    <ActiveNodePrompt
      activeNode={mockNode}
      onChange={handleChange}
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.PROMPT_PLACEHOLDER))
  await userEvent.type(input, 'New prompt text')

  expect(handleChange).toHaveBeenCalled()
})
