
import { mockEnv } from '@/mocks/mockEnv'
import {
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { TextEditorModal } from './TextEditorModal'

jest.mock('@/components/Icons/CheckIcon', () => ({
  CheckIcon: () => mockSubmitIconContent,
}))

jest.mock('@/components/Icons/XMarkIcon', () => ({
  XMarkIcon: () => mockCancelIconContent,
}))

jest.mock('@/utils/env', () => mockEnv)

const mockSubmitIconContent = 'SubmitIcon'
const mockCancelIconContent = 'ClearIcon'
const mockPlaceholder = 'mockPlaceholder'
const mockInitialValue = 'initialValue'
const newValue = 'enteredValue'
const addonAfterText = 'addonAfterText'

const INPUT_MAX_LENGTH = 255

test('shows correct layout', async () => {
  render(
    <TextEditorModal
      addonAfter={addonAfterText}
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={jest.fn()}
      placeholder={mockPlaceholder}
      value={mockInitialValue}
    />,
  )

  const textInput = screen.getByRole('textbox')
  const submitButton = screen.getByRole('button', {
    name: mockSubmitIconContent,
  })
  const cancelButton = screen.getByRole('button', {
    name: mockCancelIconContent,
  })

  expect(screen.getByRole('dialog')).toBeInTheDocument()
  expect(textInput).toBeInTheDocument()
  expect(textInput).toHaveValue(mockInitialValue)
  expect(textInput.placeholder).toEqual(mockPlaceholder)
  expect(submitButton).toBeInTheDocument()
  expect(cancelButton).toBeInTheDocument()
  expect(screen.getByText(addonAfterText)).toBeInTheDocument()
})

test('shows correct tooltip message if user hovers the Cancel button', async () => {
  render(
    <TextEditorModal
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={jest.fn()}
      placeholder={mockPlaceholder}
      value={mockInitialValue}
    />,
  )

  const cancelButton = screen.getByRole('button', {
    name: mockCancelIconContent,
  })
  await userEvent.hover(cancelButton)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.CANCEL))
  })
})

test('shows correct tooltip message if user hovers the Submit button', async () => {
  render(
    <TextEditorModal
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={jest.fn()}
      placeholder={mockPlaceholder}
      value={mockInitialValue}
    />,
  )

  const submitButton = screen.getByRole('button', {
    name: mockSubmitIconContent,
  })
  await userEvent.hover(submitButton)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.SUBMIT))
  })
})

test('disables Submit button if input value is empty', async () => {
  render(
    <TextEditorModal
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={jest.fn()}
      placeholder={mockPlaceholder}
      value={''}
    />,
  )

  const submitButton = screen.getByRole('button', {
    name: mockSubmitIconContent,
  })

  expect(submitButton).toBeDisabled()
})

test('calls onCancel prop and sets initial value for input if user clicks on Cancel button', async () => {
  const mockOnCancel = jest.fn()

  render(
    <TextEditorModal
      isLoading={false}
      onCancel={mockOnCancel}
      onSubmit={jest.fn()}
      placeholder={mockPlaceholder}
      value={mockInitialValue}
    />,
  )

  const input = screen.getByRole('textbox')
  await userEvent.clear(input)
  await userEvent.type(input, newValue)

  const cancelButton = screen.getByRole('button', {
    name: mockCancelIconContent,
  })
  await userEvent.click(cancelButton)

  expect(mockOnCancel).toHaveBeenCalledTimes(1)
  expect(input).toHaveValue(mockInitialValue)
})

test('calls onSubmit prop with entered input value if user clicks on Submit button', async () => {
  const mockOnSubmit = jest.fn()

  render(
    <TextEditorModal
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={mockOnSubmit}
      placeholder={mockPlaceholder}
      value={mockInitialValue}
    />,
  )

  const input = screen.getByRole('textbox')
  await userEvent.clear(input)
  await userEvent.type(input, newValue)

  const submitButton = screen.getByRole('button', {
    name: mockSubmitIconContent,
  })
  await userEvent.click(submitButton)

  expect(mockOnSubmit).nthCalledWith(
    1,
    newValue,
  )
})

test('trims entered input value when calls onSubmit prop', async () => {
  const mockOnSubmit = jest.fn()
  const mockInputValueWithSpace = ` ${newValue} `

  render(
    <TextEditorModal
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={mockOnSubmit}
      placeholder={mockPlaceholder}
      value={mockInitialValue}
    />,
  )

  const input = screen.getByRole('textbox')
  await userEvent.clear(input)
  await userEvent.type(input, mockInputValueWithSpace)

  const submitButton = screen.getByRole('button', {
    name: mockSubmitIconContent,
  })
  await userEvent.click(submitButton)

  expect(mockOnSubmit).nthCalledWith(
    1,
    newValue,
  )
})

test('calls onSubmit when pressing Enter with non-empty input', async () => {
  const mockOnSubmit = jest.fn()

  render(
    <TextEditorModal
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={mockOnSubmit}
      placeholder={mockPlaceholder}
      value={mockInitialValue}
    />,
  )

  const input = screen.getByRole('textbox')
  await userEvent.clear(input)
  await userEvent.type(input, newValue)
  await userEvent.keyboard('{Enter}')

  expect(mockOnSubmit).toHaveBeenCalledWith(newValue)
})

test('does not call onSubmit when pressing Enter with empty input', async () => {
  const mockOnSubmit = jest.fn()

  render(
    <TextEditorModal
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={mockOnSubmit}
      placeholder={mockPlaceholder}
      value={mockInitialValue}
    />,
  )

  const input = screen.getByRole('textbox')
  await userEvent.clear(input)
  await userEvent.keyboard('{Enter}')

  expect(mockOnSubmit).not.toHaveBeenCalled()
})

test('does not allow input longer than default maxLength', async () => {
  const longInput = 'a'.repeat(INPUT_MAX_LENGTH + 1)
  render(
    <TextEditorModal
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={jest.fn()}
      placeholder={mockPlaceholder}
      value=''
    />,
  )

  const input = screen.getByRole('textbox')

  await userEvent.type(input, longInput, { delay: 0 })

  expect(input).toHaveValue(longInput.slice(0, INPUT_MAX_LENGTH))
})

test('uses custom maxLength when provided', async () => {
  const customMaxLength = 50
  const longInput = 'a'.repeat(customMaxLength + 1)

  render(
    <TextEditorModal
      isLoading={false}
      maxLength={customMaxLength}
      onCancel={jest.fn()}
      onSubmit={jest.fn()}
      placeholder={mockPlaceholder}
      value=''
    />,
  )

  const input = screen.getByRole('textbox')

  await userEvent.type(input, longInput, { delay: 0 })

  expect(input).toHaveValue(longInput.slice(0, customMaxLength))
  expect(input).toHaveAttribute('maxLength', customMaxLength.toString())
})
