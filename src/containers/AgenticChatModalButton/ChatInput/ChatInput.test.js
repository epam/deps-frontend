
import { mockEnv } from '@/mocks/mockEnv'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KeyCode } from '@/enums/KeyCode'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ChatInput } from './ChatInput'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/PaperPlaneIcon', () => ({
  PaperPlaneIcon: () => <span data-testid='paper-plane-icon' />,
}))

jest.mock('@/components/Icons/XMarkIcon', () => ({
  XMarkIcon: () => <span data-testid='cancel-icon' />,
}))

const enterKey = {
  key: 'Enter',
  code: 'Enter',
  keyCode: KeyCode.ENTER,
}

test('renders input and send button', () => {
  render(
    <ChatInput
      disabled={false}
      prompt=''
      saveDialog={jest.fn()}
      setPrompt={jest.fn()}
    />,
  )

  expect(screen.getByRole('textbox')).toBeInTheDocument()
  expect(screen.getByPlaceholderText(localize(Localization.TYPE_MESSAGE))).toBeInTheDocument()
  expect(screen.getByRole('button')).toBeInTheDocument()
  expect(screen.getByTestId('paper-plane-icon')).toBeInTheDocument()
})

test('calls setPrompt on textarea change', async () => {
  const setPrompt = jest.fn()

  render(
    <ChatInput
      disabled={false}
      prompt=''
      saveDialog={jest.fn()}
      setPrompt={setPrompt}
    />,
  )

  await userEvent.type(screen.getByRole('textbox'), 'test')
  expect(setPrompt).toHaveBeenCalled()
})

test('Send message button is disabled if prompt is empty or whitespace', () => {
  const { rerender } = render(
    <ChatInput
      disabled={false}
      prompt=''
      saveDialog={jest.fn()}
      setPrompt={jest.fn()}
    />,
  )
  expect(screen.getByRole('button')).toBeDisabled()

  rerender(
    <ChatInput
      disabled={false}
      prompt='   '
      saveDialog={jest.fn()}
      setPrompt={jest.fn()}
    />,
  )
  expect(screen.getByRole('button')).toBeDisabled()
})

test('textarea and send button are disabled if disabled prop is true', () => {
  render(
    <ChatInput
      disabled={true}
      prompt='test'
      saveDialog={jest.fn()}
      setPrompt={jest.fn()}
    />,
  )

  expect(screen.getByRole('button')).toBeDisabled()
  expect(screen.getByRole('textbox')).toBeDisabled()
})

test('calls saveDialog on send button click', async () => {
  const saveDialog = jest.fn()

  render(
    <ChatInput
      disabled={false}
      prompt='test'
      saveDialog={saveDialog}
      setPrompt={jest.fn()}
    />,
  )

  await userEvent.click(screen.getByRole('button'))
  expect(saveDialog).toHaveBeenCalled()
})

test('calls saveDialog on Enter key (without shift) in textarea', () => {
  const saveDialog = jest.fn()

  render(
    <ChatInput
      disabled={false}
      prompt='test'
      saveDialog={saveDialog}
      setPrompt={jest.fn()}
    />,
  )

  fireEvent.keyDown(screen.getByRole('textbox'), enterKey)
  expect(saveDialog).toHaveBeenCalled()
})

test('does not call saveDialog on Shift+Enter in textarea', () => {
  const saveDialog = jest.fn()
  render(
    <ChatInput
      disabled={false}
      prompt='test'
      saveDialog={saveDialog}
      setPrompt={jest.fn()}
    />,
  )

  fireEvent.keyDown(screen.getByRole('textbox'), {
    ...enterKey,
    shiftKey: true,
  })
  expect(saveDialog).not.toHaveBeenCalled()
})

test('renders Cancel button and calls onCancel on click if onCancel prop is passed', async () => {
  const onCancel = jest.fn()

  render(
    <ChatInput
      disabled={false}
      onCancel={onCancel}
      prompt='test'
      saveDialog={jest.fn()}
      setPrompt={jest.fn()}
    />,
  )

  await userEvent.click(screen.getByTestId('cancel-icon'))
  expect(onCancel).toHaveBeenCalled()
})
