
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryNode } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { AddPromptModal } from './AddPromptModal'

jest.mock('@/utils/env', () => mockEnv)

const mockOnClose = jest.fn()
const mockOnSave = jest.fn()

const defaultProps = {
  onClose: mockOnClose,
  onSave: mockOnSave,
  node: null,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders AddPromptModal with input fields', () => {
  render(<AddPromptModal {...defaultProps} />)

  const nameInput = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_NAME))
  const valueTextarea = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_VALUE))

  expect(nameInput).toBeInTheDocument()
  expect(valueTextarea).toBeInTheDocument()
})

test('renders Cancel and Save buttons', () => {
  render(<AddPromptModal {...defaultProps} />)

  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(cancelButton).toBeInTheDocument()
  expect(saveButton).toBeInTheDocument()
})

test('disables Save button when name is empty', () => {
  render(<AddPromptModal {...defaultProps} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(saveButton).toBeDisabled()
})

test('disables Save button when value is empty', async () => {
  render(<AddPromptModal {...defaultProps} />)

  const nameInput = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_NAME))
  await userEvent.type(nameInput, 'Test Name')

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(saveButton).toBeDisabled()
})

test('enables Save button when both name and value are filled', async () => {
  render(<AddPromptModal {...defaultProps} />)

  const nameInput = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_NAME))
  const valueTextarea = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_VALUE))

  await userEvent.type(nameInput, 'Test Name')
  await userEvent.type(valueTextarea, 'Test Value')

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(saveButton).not.toBeDisabled()
})

test('calls onClose when Cancel button is clicked', async () => {
  render(<AddPromptModal {...defaultProps} />)

  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  await userEvent.click(cancelButton)

  expect(mockOnClose).toHaveBeenCalledTimes(1)
})

test('calls onSave with correct values when Save button is clicked', async () => {
  render(<AddPromptModal {...defaultProps} />)

  const nameInput = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_NAME))
  const valueTextarea = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_VALUE))

  await userEvent.type(nameInput, 'Test Name')
  await userEvent.type(valueTextarea, 'Test Value')

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })
  await userEvent.click(saveButton)

  expect(mockOnSave).toHaveBeenCalledWith('Test Name', 'Test Value')
})

test('populates fields with node data when editing', () => {
  const mockNode = new QueryNode({
    id: 'node-1',
    name: 'Existing Name',
    prompt: 'Existing Prompt',
  })

  const props = {
    ...defaultProps,
    node: mockNode,
  }

  render(<AddPromptModal {...props} />)

  const nameInput = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_NAME))
  const valueTextarea = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_VALUE))

  expect(nameInput).toHaveValue('Existing Name')
  expect(valueTextarea).toHaveValue('Existing Prompt')
})

test('allows updating existing node values', async () => {
  const mockNode = new QueryNode({
    id: 'node-1',
    name: 'Existing Name',
    prompt: 'Existing Prompt',
  })

  const props = {
    ...defaultProps,
    node: mockNode,
  }

  render(<AddPromptModal {...props} />)

  const nameInput = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_NAME))
  const valueTextarea = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_VALUE))

  await userEvent.clear(nameInput)
  await userEvent.type(nameInput, 'Updated Name')

  await userEvent.clear(valueTextarea)
  await userEvent.type(valueTextarea, 'Updated Prompt')

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })
  await userEvent.click(saveButton)

  expect(mockOnSave).toHaveBeenCalledWith('Updated Name', 'Updated Prompt')
})

test('calls onSave when Shift+Enter is pressed in textarea with valid inputs', async () => {
  render(<AddPromptModal {...defaultProps} />)

  const nameInput = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_NAME))
  const valueTextarea = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_VALUE))

  await userEvent.type(nameInput, 'Test Name')
  await userEvent.type(valueTextarea, 'Test Value')
  await userEvent.keyboard('{Shift>}{Enter}{/Shift}')

  expect(mockOnSave).toHaveBeenCalledWith('Test Name', 'Test Value')
})

test('does not call onSave when Shift+Enter is pressed with empty name', async () => {
  render(<AddPromptModal {...defaultProps} />)

  const valueTextarea = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_VALUE))

  await userEvent.type(valueTextarea, 'Test Value')
  await userEvent.keyboard('{Shift>}{Enter}{/Shift}')

  expect(mockOnSave).not.toHaveBeenCalled()
})

test('does not call onSave when Shift+Enter is pressed with empty value', async () => {
  render(<AddPromptModal {...defaultProps} />)

  const nameInput = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_NAME))

  await userEvent.type(nameInput, 'Test Name')
  await userEvent.keyboard('{Shift>}{Enter}{/Shift}')

  expect(mockOnSave).not.toHaveBeenCalled()
})

test('does not show tooltip when Save button is disabled due to empty fields', async () => {
  render(<AddPromptModal {...defaultProps} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })
  await userEvent.hover(saveButton)

  const tooltip = screen.queryByText(localize(Localization.SHIFT_ENTER_SHORTCUT_HINT))
  expect(tooltip).not.toBeInTheDocument()
})

test('does not show tooltip when Save button is enabled but not hovered', async () => {
  render(<AddPromptModal {...defaultProps} />)

  const nameInput = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_NAME))
  const valueTextarea = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_VALUE))

  await userEvent.type(nameInput, 'Test Name')
  await userEvent.type(valueTextarea, 'Test Value')

  const tooltip = screen.queryByText(localize(Localization.SHIFT_ENTER_SHORTCUT_HINT))
  expect(tooltip).not.toBeInTheDocument()
})

test('shows tooltip with shortcut hint when Save button is enabled and hovered', async () => {
  render(<AddPromptModal {...defaultProps} />)

  const nameInput = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_NAME))
  const valueTextarea = screen.getByPlaceholderText(localize(Localization.ENTER_PROMPT_VALUE))

  await userEvent.type(nameInput, 'Test Name')
  await userEvent.type(valueTextarea, 'Test Value')

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })
  await userEvent.hover(saveButton)

  const tooltip = screen.getByText(localize(Localization.SHIFT_ENTER_SHORTCUT_HINT))
  expect(tooltip).toBeInTheDocument()
})
