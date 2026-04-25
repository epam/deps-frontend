
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { Extractor, Field, Query, QueryNode } from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { LLMExtractorDrawer } from './LLMExtractorDrawer'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./LLMExtractorDescription', () => ({
  LLMExtractorDescription: () => <div data-testid="llm-extractor-description">Description</div>,
}))

jest.mock('./ManageLLMExtractorDrawer', () => ({
  ManageLLMExtractorDrawer: ({ isVisible, onClose }) => {
    if (!isVisible) return null

    return (
      <div data-testid="manage-llm-extractor-drawer">
        <button onClick={onClose}>Close Manage Drawer</button>
      </div>
    )
  },
}))

jest.mock('./LLMExtractorsDropdown', () => ({
  LLMExtractorsDropdown: ({ onSelectExtractor, onCreateExtractor }) => (
    <div>
      <button
        data-testid={mockDropdownId}
        onClick={() => onSelectExtractor(mockExtractor2.id)}
      />
      <button
        data-testid="create-extractor-button"
        onClick={onCreateExtractor}
      >
        Create
      </button>
    </div>
  ),
}))

jest.mock('@/components/Icons/PenIcon', () => ({
  PenIcon: () => <div data-testid="pen-icon" />,
}))

const mockSetActiveField = jest.fn()
const mockUpdateFields = jest.fn()
const mockDropdownId = 'select-extractor-button'

jest.mock('@/containers/PromptCalibrationStudio/hooks', () => ({
  useFieldCalibration: jest.fn(() => mockCalibrationState),
}))

const mockExtractor1 = new Extractor({
  id: 'extractor-1',
  name: 'GPT-4 Extractor',
  model: 'openai@gpt-4',
  customInstruction: 'Test instruction 1',
  groupingFactor: 1,
  temperature: 0.5,
  topP: 1,
})

const mockExtractor2 = new Extractor({
  id: 'extractor-2',
  name: 'Claude Extractor',
  model: 'anthropic@claude-3',
  customInstruction: 'Test instruction 2',
  groupingFactor: 2,
  temperature: 0.7,
  topP: 0.9,
})

const mockExtractors = [mockExtractor1, mockExtractor2]

const mockActiveField = new Field({
  id: 'field-1',
  name: 'Test Field',
  extractorId: mockExtractor1.id,
  fieldType: FieldType.STRING,
  multiplicity: 'single',
  confidential: false,
  readOnly: false,
  aliases: [],
  query: new Query({
    nodes: [
      new QueryNode({
        id: 'node-1',
        name: 'Node 1',
        prompt: 'Test prompt',
      }),
    ],
  }),
})

const mockCalibrationState = {
  extractors: mockExtractors,
  activeField: mockActiveField,
  setActiveField: mockSetActiveField,
  updateFields: mockUpdateFields,
}

const mockSetField = async () => {
  const button = screen.getByRole('button', { name: localize(Localization.LLM_EXTRACTOR) })
  await userEvent.click(button)

  const dropdownButton = screen.getByTestId(mockDropdownId)
  await userEvent.click(dropdownButton)
}

const defaultProps = {
  onExecute: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders trigger button correctly', () => {
  render(<LLMExtractorDrawer {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.LLM_EXTRACTOR),
  })

  expect(button).toBeInTheDocument()
})

test('opens drawer when button is clicked', async () => {
  render(<LLMExtractorDrawer {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.LLM_EXTRACTOR) })

  await userEvent.click(button)

  await waitFor(() => {
    const title = screen.getAllByText(localize(Localization.LLM_EXTRACTOR))
    expect(title.length).toBe(2)
  })

  await waitFor(() => {
    const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
    expect(cancelButton).toBeInTheDocument()
  })

  await waitFor(() => {
    const submitButton = screen.getByRole('button', { name: localize(Localization.SUBMIT) })
    expect(submitButton).toBeInTheDocument()
  })
})

test('disables Submit button when current extractor matches active field extractor', async () => {
  render(<LLMExtractorDrawer {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.LLM_EXTRACTOR) })

  await userEvent.click(button)

  await waitFor(() => {
    const submitButton = screen.getByRole('button', { name: localize(Localization.SUBMIT) })
    expect(submitButton).toBeDisabled()
  })
})

test('enables Submit button when current extractor differs from active field extractor', async () => {
  render(<LLMExtractorDrawer {...defaultProps} />)

  await mockSetField()

  await waitFor(() => {
    const submitButton = screen.getByRole('button', { name: localize(Localization.SUBMIT) })
    expect(submitButton).toBeEnabled()
  })
})

test('calls setActiveField when Submit button is clicked if no nodes in field', async () => {
  jest.clearAllMocks()

  const mockActiveFieldWithNoNodes = new Field({
    ...mockActiveField,
    query: {
      ...mockActiveField.query,
      nodes: [],
    },
  })

  useFieldCalibration.mockReturnValue({
    ...mockCalibrationState,
    activeField: mockActiveFieldWithNoNodes,
  })

  render(<LLMExtractorDrawer {...defaultProps} />)

  await mockSetField()

  const submitButton = screen.getByRole('button', { name: localize(Localization.SUBMIT) })
  await userEvent.click(submitButton)

  await waitFor(() => {
    expect(mockSetActiveField).toHaveBeenCalled()
  })

  useFieldCalibration.mockReturnValue(mockCalibrationState)
})

test('calls onExecute when Submit button is clicked', async () => {
  render(<LLMExtractorDrawer {...defaultProps} />)

  await mockSetField()

  const submitButton = screen.getByRole('button', { name: localize(Localization.SUBMIT) })
  await userEvent.click(submitButton)

  expect(defaultProps.onExecute).toHaveBeenCalled()
})

test('closes drawer when Cancel button is clicked', async () => {
  render(<LLMExtractorDrawer {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.LLM_EXTRACTOR) })
  await userEvent.click(button)

  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  await userEvent.click(cancelButton)

  await waitFor(() => {
    const cancelButton = screen.queryByRole('button', { name: localize(Localization.CANCEL) })
    expect(cancelButton).not.toBeInTheDocument()
  })
})
