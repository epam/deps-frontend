
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import {
  Field as FieldViewModel,
  MULTIPLICITY,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FieldName } from './FieldName'

jest.mock('@/utils/env', () => mockEnv)

const mockSetActiveField = jest.fn()
const mockUpdateFields = jest.fn()
const mockDeleteField = jest.fn()

jest.mock('@/containers/PromptCalibrationStudio/hooks', () => ({
  useFieldCalibration: jest.fn(),
}))

jest.mock('@/components/Modal', () => {
  const ActualModal = jest.requireActual('@/components/Modal').Modal
  return {
    Modal: Object.assign(ActualModal, {
      confirm: jest.fn(),
    }),
  }
})

jest.mock('@/containers/PromptCalibrationStudio/viewModels', () => ({
  ...jest.requireActual('@/containers/PromptCalibrationStudio/viewModels'),
  Field: {
    updateName: jest.fn((field, newName) => ({
      ...field,
      name: newName,
    })),
  },
}))

const mockField = {
  id: 'field-1',
  name: 'Test Field Name',
  isNew: false,
  extractorId: 'extractor-1',
  multiplicity: MULTIPLICITY.SINGLE,
  fieldType: FieldType.STRING,
}

const mockField2 = {
  id: 'field-2',
  name: 'Another Field',
  isNew: false,
  extractorId: 'extractor-2',
  multiplicity: MULTIPLICITY.SINGLE,
  fieldType: FieldType.STRING,
}

const defaultMockReturnValue = {
  activeField: mockField,
  setActiveField: mockSetActiveField,
  fields: [mockField, mockField2],
  updateFields: mockUpdateFields,
  deleteField: mockDeleteField,
}

beforeEach(() => {
  jest.clearAllMocks()
  FieldViewModel.updateName.mockImplementation((field, newName) => ({
    ...field,
    name: newName,
  }))
  useFieldCalibration.mockReturnValue(defaultMockReturnValue)
  Modal.confirm.mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
  }))
})

test('renders FieldName with field name', () => {
  render(<FieldName />)

  const longText = screen.getByText('Test Field Name')

  expect(longText).toBeInTheDocument()
})

test('renders NEW_FIELD hint when field isNew is true', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...defaultMockReturnValue,
    activeField: {
      ...mockField,
      isNew: true,
    },
  })

  render(<FieldName />)

  const newFieldHint = screen.getByText(localize(Localization.NEW_FIELD))

  expect(newFieldHint).toBeInTheDocument()
})

test('does not render NEW_FIELD hint when field isNew is false', () => {
  render(<FieldName />)

  const newFieldHint = screen.queryByText(localize(Localization.NEW_FIELD))

  expect(newFieldHint).not.toBeInTheDocument()
})

test('renders only edit button when field is not new', () => {
  render(<FieldName />)

  const buttons = screen.getAllByRole('button')

  expect(buttons.length).toBe(1)
})

test('renders edit and delete buttons when field is new', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...defaultMockReturnValue,
    activeField: {
      ...mockField,
      isNew: true,
    },
  })

  render(<FieldName />)

  const buttons = screen.getAllByRole('button')

  expect(buttons.length).toBe(2)
})

test('edit button has correct tooltip', async () => {
  render(<FieldName />)

  const [editButton] = screen.getAllByRole('button')

  await userEvent.hover(editButton)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.EDIT_FIELD_NAME))
  })
})

test('renders delete button when field is new', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...defaultMockReturnValue,
    activeField: {
      ...mockField,
      isNew: true,
    },
  })

  render(<FieldName />)

  const buttons = screen.getAllByRole('button')

  expect(buttons.length).toBe(2)
})

test('delete button has correct tooltip', async () => {
  useFieldCalibration.mockReturnValueOnce({
    ...defaultMockReturnValue,
    activeField: {
      ...mockField,
      isNew: true,
    },
  })

  render(<FieldName />)

  const [, deleteButton] = screen.getAllByRole('button')

  await userEvent.hover(deleteButton)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.DELETE_FIELD))
  })
})

test('opens TextEditorModal when edit button is clicked', async () => {
  render(<FieldName />)

  const [editButton] = screen.getAllByRole('button')

  await userEvent.click(editButton)

  await waitFor(() => {
    const textInput = screen.getByPlaceholderText(localize(Localization.ENTER_FIELD_NAME))
    expect(textInput).toBeInTheDocument()
  })
})

test('TextEditorModal displays current field name as value', async () => {
  render(<FieldName />)

  const [editButton] = screen.getAllByRole('button')

  await userEvent.click(editButton)

  await waitFor(() => {
    const textInput = screen.getByPlaceholderText(localize(Localization.ENTER_FIELD_NAME))
    expect(textInput).toHaveValue('Test Field Name')
  })
})

test('closes TextEditorModal when cancel is clicked', async () => {
  render(<FieldName />)

  const [editButton] = screen.getAllByRole('button')

  await userEvent.click(editButton)

  await waitFor(() => {
    expect(screen.getByPlaceholderText(localize(Localization.ENTER_FIELD_NAME))).toBeInTheDocument()
  })

  const cancelButton = screen.getByTestId('text-editor-modal-cancel')
  await userEvent.click(cancelButton)

  await waitFor(() => {
    expect(screen.queryByPlaceholderText(localize(Localization.ENTER_FIELD_NAME))).not.toBeInTheDocument()
  })
})

test('successfully updates field name with valid new name', async () => {
  render(<FieldName />)

  const [editButton] = screen.getAllByRole('button')

  await userEvent.click(editButton)

  const textInput = await screen.findByPlaceholderText(localize(Localization.ENTER_FIELD_NAME))

  await userEvent.clear(textInput)
  await userEvent.type(textInput, 'Updated Field Name')

  const submitButton = screen.getByTestId('text-editor-modal-submit')
  await userEvent.click(submitButton)

  await waitFor(() => {
    expect(FieldViewModel.updateName).toHaveBeenCalledWith(mockField, 'Updated Field Name')
  })

  expect(mockSetActiveField).toHaveBeenCalled()
  expect(mockUpdateFields).toHaveBeenCalled()
})

test('shows validation error for duplicate field name', async () => {
  render(<FieldName />)

  const [editButton] = screen.getAllByRole('button')

  await userEvent.click(editButton)

  const textInput = await screen.findByPlaceholderText(localize(Localization.ENTER_FIELD_NAME))

  await userEvent.clear(textInput)
  await userEvent.type(textInput, 'Another Field')

  const submitButton = screen.getByTestId('text-editor-modal-submit')
  await userEvent.click(submitButton)

  await waitFor(() => {
    const errorMessage = screen.getByText(localize(Localization.FIELD_NAME_DUPLICATE))
    expect(errorMessage).toBeInTheDocument()
  })

  expect(mockSetActiveField).not.toHaveBeenCalled()
  expect(mockUpdateFields).not.toHaveBeenCalled()
})

test('opens confirmation modal when delete button is clicked', async () => {
  useFieldCalibration.mockReturnValueOnce({
    ...defaultMockReturnValue,
    activeField: {
      ...mockField,
      isNew: true,
    },
  })

  render(<FieldName />)

  const [, deleteButton] = screen.getAllByRole('button')

  await userEvent.click(deleteButton)

  expect(Modal.confirm).toHaveBeenCalledWith(
    expect.objectContaining({
      title: localize(Localization.DELETE_CONFIRM_MESSAGE, { name: mockField.name }),
      centered: true,
      okText: localize(Localization.CONFIRM),
      cancelText: localize(Localization.CANCEL),
      onOk: expect.any(Function),
    }),
  )
})

test('calls deleteField when delete is confirmed', async () => {
  Modal.confirm.mockImplementation(({ onOk }) => {
    onOk()
    return {
      destroy: jest.fn(),
      update: jest.fn(),
    }
  })

  useFieldCalibration.mockReturnValueOnce({
    ...defaultMockReturnValue,
    activeField: {
      ...mockField,
      isNew: true,
    },
  })

  render(<FieldName />)

  const [, deleteButton] = screen.getAllByRole('button')

  await userEvent.click(deleteButton)

  expect(mockDeleteField).toHaveBeenCalledWith(mockField.id)
})
