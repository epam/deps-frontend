
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import {
  Extractor,
  Field,
  Query,
  MULTIPLICITY,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ManageLLMExtractorDrawer } from './ManageLLMExtractorDrawer'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    getValues: mockGetValues,
    formState: {
      isValid: true,
      isDirty: true,
    },
  })),
}))

jest.mock('./ManageLLMExtractorForm', () => ({
  ManageLLMExtractorForm: () => <div data-testid="ManageLLMExtractorForm" />,
}))

jest.mock('@/containers/PromptCalibrationStudio/hooks', () => ({
  useFieldCalibration: jest.fn(() => ({
    extractors: [mockExtractor1, mockExtractor2],
    setExtractors: mockSetExtractors,
    activeField: mockField,
    setActiveField: mockSetActiveField,
    updateFields: mockUpdateFields,
  })),
  useManageExtractor: jest.fn(() => ({
    updateExtractorForAllFields: mockUpdateExtractorForAllFields,
    updateExtractorForActiveField: mockUpdateExtractorForActiveField,
    createNewExtractor: mockCreateNewExtractor,
    isRetrievingInsights: false,
  })),
}))

const mockExtractor1 = new Extractor({
  id: 'extractor-1',
  name: 'GPT-4 Extractor',
  model: 'gpt-4',
  customInstruction: 'Test instruction',
  groupingFactor: 5,
  temperature: 0.5,
  topP: 1,
  pageSpan: null,
})

const mockExtractor2 = new Extractor({
  id: 'extractor-2',
  name: 'Claude Extractor',
  model: 'claude-3',
  customInstruction: 'Test instruction 2',
  groupingFactor: 3,
  temperature: 0.7,
  topP: 0.9,
  pageSpan: null,
})

const mockField = new Field({
  id: 'field-1',
  name: 'Test Field',
  value: 'test value',
  extractorId: 'extractor-1',
  query: new Query({
    nodes: ['node-1', 'node-2'],
    value: 'test value',
  }),
  fieldType: FieldType.STRING,
  multiplicity: MULTIPLICITY.SINGLE,
})

const mockFormValues = {
  name: 'Test Extractor',
  model: 'gpt-4',
  customInstruction: 'Test instruction',
  groupingFactor: 5,
  temperature: 0.5,
  topP: 1,
  pageSpan: null,
}

const mockSetExtractors = jest.fn()
const mockSetExtractor = jest.fn()
const mockSetActiveField = jest.fn()
const mockUpdateFields = jest.fn()
const mockOnClose = jest.fn()
const mockOnExecute = jest.fn()
const mockGetValues = jest.fn(() => mockFormValues)
const mockUpdateExtractorForAllFields = jest.fn(() => Promise.resolve(mockExtractor1))
const mockUpdateExtractorForActiveField = jest.fn(() => mockExtractor1)
const mockCreateNewExtractor = jest.fn(() => mockExtractor1)

const defaultProps = {
  isVisible: true,
  extractor: null,
  setExtractor: mockSetExtractor,
  onClose: mockOnClose,
  onExecute: mockOnExecute,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders drawer with "Add LLM Extractor" title when creating new extractor', () => {
  render(<ManageLLMExtractorDrawer {...defaultProps} />)

  const title = screen.getByText(localize(Localization.ADD_LLM_EXTRACTOR))

  expect(title).toBeInTheDocument()
})

test('renders drawer with "Edit LLM Extractor" title when editing existing extractor', () => {
  const props = {
    ...defaultProps,
    extractor: mockExtractor1,
  }

  render(<ManageLLMExtractorDrawer {...props} />)

  const title = screen.getByText(localize(Localization.EDIT_LLM_EXTRACTOR))

  expect(title).toBeInTheDocument()
})

test('disables Save button when form is invalid', () => {
  useForm.mockImplementationOnce(() => ({
    getValues: mockGetValues,
    formState: {
      isValid: false,
      isDirty: true,
    },
  }))

  render(<ManageLLMExtractorDrawer {...defaultProps} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  expect(saveButton).toBeDisabled()
})

test('disables Save button when form is not dirty', () => {
  useForm.mockImplementationOnce(() => ({
    getValues: mockGetValues,
    formState: {
      isValid: true,
      isDirty: false,
    },
  }))

  render(<ManageLLMExtractorDrawer {...defaultProps} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  expect(saveButton).toBeDisabled()
})

test('calls onClose when Cancel button is clicked', async () => {
  render(<ManageLLMExtractorDrawer {...defaultProps} />)

  const cancelButton = screen.getByRole('button', {
    name: localize(Localization.CANCEL),
  })

  await userEvent.click(cancelButton)

  expect(mockOnClose).toHaveBeenCalledTimes(1)
})

test('creates new extractor when Save button is clicked without existing extractor', async () => {
  render(<ManageLLMExtractorDrawer {...defaultProps} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  expect(mockCreateNewExtractor).toHaveBeenCalledTimes(1)
  expect(mockSetExtractor).toHaveBeenCalledWith(mockExtractor1)
  expect(mockOnClose).toHaveBeenCalledTimes(1)
})

test('renders SaveExtractorModal component when click on Save button', async () => {
  const props = {
    ...defaultProps,
    extractor: mockExtractor1,
  }

  render(<ManageLLMExtractorDrawer {...props} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  const modalTitle = screen.getByText(localize(Localization.CONFIRM_SAVE_EXTRACTOR_CHANGES))

  expect(modalTitle).toBeInTheDocument()
})

test('renders ManageLLMExtractorForm component', () => {
  render(<ManageLLMExtractorDrawer {...defaultProps} />)

  const form = screen.getByTestId('ManageLLMExtractorForm')

  expect(form).toBeInTheDocument()
})

test('does not show drawer when isVisible is false', () => {
  const props = {
    ...defaultProps,
    isVisible: false,
  }

  render(<ManageLLMExtractorDrawer {...props} />)

  const title = screen.queryByText(localize(Localization.ADD_LLM_EXTRACTOR))

  expect(title).not.toBeInTheDocument()
})

test('enables Save button when form is valid', () => {
  render(<ManageLLMExtractorDrawer {...defaultProps} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  expect(saveButton).toBeEnabled()
})

test('calls createNewExtractor with form values when Save button is clicked without existing extractor', async () => {
  render(<ManageLLMExtractorDrawer {...defaultProps} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  expect(mockGetValues).toHaveBeenCalled()
  expect(mockCreateNewExtractor).nthCalledWith(1, mockFormValues)
})

test('calls updateExtractorForAllFields when Edit Existing Extractor button is clicked', async () => {
  const props = {
    ...defaultProps,
    extractor: mockExtractor1,
  }

  render(<ManageLLMExtractorDrawer {...props} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  const editExistingButton = screen.getByRole('button', {
    name: localize(Localization.EDIT_EXISTING_EXTRACTOR),
  })

  await userEvent.click(editExistingButton)

  expect(mockGetValues).toHaveBeenCalled()
  expect(mockUpdateExtractorForAllFields).nthCalledWith(1, mockFormValues, mockExtractor1.id)
})

test('calls updateExtractorForActiveField when Create New Extractor button is clicked', async () => {
  const props = {
    ...defaultProps,
    extractor: mockExtractor1,
  }

  render(<ManageLLMExtractorDrawer {...props} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  const createNewButton = screen.getByRole('button', {
    name: localize(Localization.CREATE_NEW_EXTRACTOR),
  })

  await userEvent.click(createNewButton)

  expect(mockGetValues).toHaveBeenCalled()
  expect(mockUpdateExtractorForActiveField).nthCalledWith(1, mockFormValues)
})

test('calls setExtractor with returned extractor after updateExtractorForAllFields', async () => {
  const props = {
    ...defaultProps,
    extractor: mockExtractor1,
  }

  render(<ManageLLMExtractorDrawer {...props} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  const editExistingButton = screen.getByRole('button', {
    name: localize(Localization.EDIT_EXISTING_EXTRACTOR),
  })

  await userEvent.click(editExistingButton)

  expect(mockSetExtractor).toHaveBeenCalledWith(mockExtractor1)
})

test('calls setExtractor with returned extractor after updateExtractorForActiveField', async () => {
  const props = {
    ...defaultProps,
    extractor: mockExtractor1,
  }

  render(<ManageLLMExtractorDrawer {...props} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  const createNewButton = screen.getByRole('button', {
    name: localize(Localization.CREATE_NEW_EXTRACTOR),
  })

  await userEvent.click(createNewButton)

  expect(mockSetExtractor).toHaveBeenCalledWith(mockExtractor1)
})

test('calls onExecute with nodes and extractor when active field has nodes after updateExtractorForAllFields', async () => {
  const props = {
    ...defaultProps,
    extractor: mockExtractor1,
  }

  render(<ManageLLMExtractorDrawer {...props} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  const editExistingButton = screen.getByRole('button', {
    name: localize(Localization.EDIT_EXISTING_EXTRACTOR),
  })

  await userEvent.click(editExistingButton)

  expect(mockOnExecute).toHaveBeenCalledWith({
    nodes: mockField.query.nodes,
    extractor: mockExtractor1,
  })
})

test('calls onExecute with nodes and extractor when active field has nodes after updateExtractorForActiveField', async () => {
  const props = {
    ...defaultProps,
    extractor: mockExtractor1,
  }

  render(<ManageLLMExtractorDrawer {...props} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  const createNewButton = screen.getByRole('button', {
    name: localize(Localization.CREATE_NEW_EXTRACTOR),
  })

  await userEvent.click(createNewButton)

  expect(mockOnExecute).toHaveBeenCalledWith({
    nodes: mockField.query.nodes,
    extractor: mockExtractor1,
  })
})

test('calls onClose after updateExtractorForAllFields completes', async () => {
  const props = {
    ...defaultProps,
    extractor: mockExtractor1,
  }

  render(<ManageLLMExtractorDrawer {...props} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  const editExistingButton = screen.getByRole('button', {
    name: localize(Localization.EDIT_EXISTING_EXTRACTOR),
  })

  await userEvent.click(editExistingButton)

  expect(mockOnClose).toHaveBeenCalledTimes(1)
})

test('calls onClose after updateExtractorForActiveField completes', async () => {
  const props = {
    ...defaultProps,
    extractor: mockExtractor1,
  }

  render(<ManageLLMExtractorDrawer {...props} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  const createNewButton = screen.getByRole('button', {
    name: localize(Localization.CREATE_NEW_EXTRACTOR),
  })

  await userEvent.click(createNewButton)

  expect(mockOnClose).toHaveBeenCalledTimes(1)
})

test('does not call onExecute when extractor id does not match active field extractor id', async () => {
  const mockExtractor3 = new Extractor({
    id: 'extractor-3',
    name: 'Different Extractor',
    model: 'gpt-3.5',
    customInstruction: 'Test',
    groupingFactor: 5,
    temperature: 0.5,
    topP: 1,
    pageSpan: null,
  })

  mockUpdateExtractorForAllFields.mockResolvedValueOnce(mockExtractor3)

  const props = {
    ...defaultProps,
    extractor: mockExtractor1,
  }

  render(<ManageLLMExtractorDrawer {...props} />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)

  const editExistingButton = screen.getByRole('button', {
    name: localize(Localization.EDIT_EXISTING_EXTRACTOR),
  })

  await userEvent.click(editExistingButton)

  expect(mockUpdateExtractorForAllFields).toHaveBeenCalledTimes(1)
  expect(mockOnExecute).not.toHaveBeenCalled()
  expect(mockOnClose).toHaveBeenCalledTimes(1)
})
