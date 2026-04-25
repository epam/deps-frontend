
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { AiAnswer } from './AiAnswer'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/ShortLogoIcon', () => ({
  ShortLogoIcon: () => <span data-testid='short-logo-icon' />,
}))

jest.mock('./CopyToClipboardButton', () => ({
  CopyToClipboardButton: () => (
    <button data-testid='copy-to-clipboard-button'>Copy</button>
  ),
}))
jest.mock('./SaveToFieldButton', () => ({
  SaveToFieldButton: () => (
    <button data-testid='save-to-field-button' />
  ),
}))

const mockMessage = 'Test AI answer'
const mockTime = '11:12'
const mockPrompt = 'prompt'

test('renders AiAnswer with answer and time', () => {
  render(
    <AiAnswer
      allowSave={false}
      answer={mockMessage}
      time={mockTime}
    />,
  )

  expect(screen.getByText(mockMessage)).toBeInTheDocument()
  expect(screen.getByText(mockTime)).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.DEPS_GEN_AI))).toBeInTheDocument()
  expect(screen.getByTestId('short-logo-icon')).toBeInTheDocument()
})

test('shows copy to clipboard button on mouse enter for string answer', async () => {
  render(
    <AiAnswer
      allowSave={false}
      answer={mockMessage}
      time={mockTime}
    />,
  )

  expect(screen.queryByTestId('copy-to-clipboard-button')).not.toBeInTheDocument()

  await userEvent.hover(screen.getByText(mockMessage))

  expect(screen.getByTestId('copy-to-clipboard-button')).toBeInTheDocument()
})

test('hides copy to clipboard button on mouse leave', async () => {
  render(
    <AiAnswer
      allowSave={false}
      answer={mockMessage}
      time={mockTime}
    />,
  )

  await userEvent.hover(screen.getByText(mockMessage))
  expect(screen.getByTestId('copy-to-clipboard-button')).toBeInTheDocument()

  await userEvent.unhover(screen.getByText(mockMessage))
  expect(screen.queryByTestId('copy-to-clipboard-button')).not.toBeInTheDocument()
})

test('does not show copy to clipboard button when answer is a React node', async () => {
  render(
    <AiAnswer
      allowSave={false}
      answer={<div data-testid='react-node-answer'>React Node Message</div>}
      time={mockTime}
    />,
  )

  await userEvent.hover(screen.getByTestId('react-node-answer'))

  expect(screen.queryByTestId('copy-to-clipboard-button')).not.toBeInTheDocument()
})

test('renders SaveToFieldButton when saving is available', () => {
  render(
    <AiAnswer
      allowSave={true}
      answer={mockMessage}
      prompt={mockPrompt}
      time={mockTime}
    />,
  )

  expect(screen.getByTestId('save-to-field-button')).toBeInTheDocument()
})
