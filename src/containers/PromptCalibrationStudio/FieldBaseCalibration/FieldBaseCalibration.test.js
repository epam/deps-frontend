
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { useFieldCalibration } from '../hooks'
import { mapNodesToRequestedInsights } from '../mappers/mapNodesToRequestedInsights'
import { Extractor, Field, Query, QueryNode } from '../viewModels'
import { FieldBaseCalibration } from './FieldBaseCalibration'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('lodash/debounce', () =>
  jest.fn((fn) => {
    fn.cancel = jest.fn()
    return fn
  }),
)

jest.mock('../InsightsComparison', () => ({
  InsightsComparison: ({ executedValue, field }) => (
    <div data-testid="InsightsComparison">
      <span>InsightsComparison</span>
      <span data-testid="executed-value">{JSON.stringify(executedValue)}</span>
      <span data-testid="field-id">{field.id}</span>
    </div>
  ),
}))
jest.mock('../InsightsErrorBoundary', () => ({
  InsightsErrorBoundary: ({ children }) => (
    <div data-testid="InsightsErrorBoundary">{children}</div>
  ),
}))

const mockSetActiveField = jest.fn()
const mockSetCalibrationMode = jest.fn()
const mockCloseCalibrationMode = jest.fn()

jest.mock('../hooks', () => ({
  useFieldCalibration: jest.fn(() => ({
    activeField: mockField,
    setActiveField: mockSetActiveField,
    setCalibrationMode: mockSetCalibrationMode,
    closeCalibrationMode: mockCloseCalibrationMode,
  })),
  useRetrieveInsights: jest.fn(() => [
    mockRetrieveInsights,
    false,
  ]),
}))

jest.mock('@/hooks/useExpandableText', () => ({
  useExpandableText: jest.fn(() => ({
    ExpandableContainer: ({ children }) => (
      <div>{children}</div>
    ),
    ToggleExpandIcon: () => <span />,
  })),
}))

const mockContent = { value: 'INV-67890' }

const mockField = new Field({
  id: 'invoice_number',
  name: 'Invoice Number',
  value: 'INV-12345',
  fieldType: FieldType.STRING,
  extractorId: 'extractor-1',
  multiplicity: 'single',
  query: new Query({
    nodes: [
      new QueryNode({
        name: 'Node 1',
        prompt: 'Extract the data',
      }),
    ],
    value: null,
  }),
})

const mockRetrieveInsights = jest.fn(() => ({
  unwrap: () => Promise.resolve({
    [mockField.id]: {
      content: mockContent,
      errorOccurred: false,
    },
  }),
}))

const mockLLMExtractor = new Extractor({
  customInstruction: 'Extract the data',
  groupingFactor: 1,
  model: 'gpt-4',
  name: 'Test Extractor',
  pageSpan: null,
  temperature: 0.5,
  topP: 0.9,
  id: 'extractor-1',
})

const defaultProps = {
  field: mockField,
  llmExtractor: mockLLMExtractor,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders FieldBaseCalibration component correctly', async () => {
  render(<FieldBaseCalibration {...defaultProps} />)

  const calibrationAdapter = screen.getByText('InsightsComparison', { exact: false })
  const userPrompt = screen.getByText(localize(Localization.PROMPT))
  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(calibrationAdapter).toBeInTheDocument()
  expect(userPrompt).toBeInTheDocument()
  expect(saveButton).toBeInTheDocument()
})

test('calls closeCalibrationMode when close button is clicked', async () => {
  render(<FieldBaseCalibration {...defaultProps} />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE) })
  await userEvent.click(closeButton)

  expect(mockCloseCalibrationMode).toHaveBeenCalled()
})

test('calls retrieveInsights with correct parameters when executing prompt', async () => {
  render(<FieldBaseCalibration {...defaultProps} />)

  const textarea = screen.getByRole('textbox')
  const testValue = 'test'

  await userEvent.clear(textarea)
  await userEvent.type(textarea, testValue)

  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })
  await userEvent.click(executeButton)

  await waitFor(() => {
    const {
      model,
      customInstruction,
      ...params
    } = mockLLMExtractor

    expect(mockRetrieveInsights).toHaveBeenCalledWith({
      model,
      customInstructions: customInstruction,
      requestedInsights: mapNodesToRequestedInsights(mockField, [{ prompt: testValue }]),
      params,
    })
  })
})

test('save button is disabled when value has not changed', async () => {
  render(<FieldBaseCalibration {...defaultProps} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(saveButton).toBeDisabled()
})

test('disables Save button when executedValue is null', () => {
  useFieldCalibration.mockReturnValueOnce({
    activeField: mockField,
    setActiveField: mockSetActiveField,
    setCalibrationMode: mockSetCalibrationMode,
    closeCalibrationMode: mockCloseCalibrationMode,
  })

  render(<FieldBaseCalibration {...defaultProps} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(saveButton).toBeDisabled()
})

test('save button is disabled when executedValue is undefined', () => {
  const mockFieldWithUndefinedValue = new Field({
    ...mockField,
    query: {
      ...mockField.query,
      value: undefined,
    },
  })

  useFieldCalibration.mockReturnValueOnce({
    activeField: mockFieldWithUndefinedValue,
    setActiveField: mockSetActiveField,
    setCalibrationMode: mockSetCalibrationMode,
    closeCalibrationMode: mockCloseCalibrationMode,
  })

  render(<FieldBaseCalibration {...defaultProps} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(saveButton).toBeDisabled()
})

test('updates activeField when execution is successful', async () => {
  render(<FieldBaseCalibration {...defaultProps} />)

  const promptTextarea = screen.getByRole('textbox')
  const testPrompt = 'New prompt for extraction'

  await userEvent.clear(promptTextarea)
  await userEvent.type(promptTextarea, testPrompt)

  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })
  await userEvent.click(executeButton)

  await waitFor(() => {
    expect(mockSetActiveField).toHaveBeenCalled()
  })

  expect(mockSetActiveField).toHaveBeenCalledWith(expect.objectContaining({
    id: mockField.id,
    name: mockField.name,
    fieldType: mockField.fieldType,
    extractorId: mockField.extractorId,
    multiplicity: mockField.multiplicity,
    query: expect.objectContaining({
      value: 'INV-67890',
      nodes: expect.arrayContaining([
        expect.objectContaining({
          name: 'Default',
          prompt: testPrompt,
        }),
      ]),
    }),
  }))
})

test('shows warning notification when retrieveInsights fails with error', async () => {
  mockRetrieveInsights.mockImplementationOnce(() => ({
    unwrap: () => Promise.reject(new Error('UNKNOWN_ERROR')),
  }))

  render(<FieldBaseCalibration {...defaultProps} />)

  const promptTextarea = screen.getByRole('textbox')
  const testPrompt = 'Different prompt'

  await userEvent.clear(promptTextarea)
  await userEvent.type(promptTextarea, testPrompt)

  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })
  await userEvent.click(executeButton)

  await waitFor(() => {
    expect(notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
  })
})

test('shows warning notification when retrieveInsights returns errorOccurred', async () => {
  const errorMessage = 'Field extraction failed'
  mockRetrieveInsights.mockImplementationOnce(() => ({
    unwrap: () => Promise.resolve({
      [mockField.id]: {
        content: errorMessage,
        errorOccurred: true,
      },
    }),
  }))

  render(<FieldBaseCalibration {...defaultProps} />)

  const promptTextarea = screen.getByRole('textbox')
  const testPrompt = 'Another prompt'

  await userEvent.clear(promptTextarea)
  await userEvent.type(promptTextarea, testPrompt)

  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })
  await userEvent.click(executeButton)

  await waitFor(() => {
    expect(notifyWarning).toHaveBeenCalledWith(errorMessage)
  })
})

test('renders InsightsComparison with activeField and executedValue', () => {
  render(<FieldBaseCalibration {...defaultProps} />)

  const fieldId = screen.getByTestId('field-id')
  const executedValue = screen.getByTestId('executed-value')

  expect(fieldId).toHaveTextContent('invoice_number')
  expect(executedValue).toBeInTheDocument()
})

test('updates activeField with parsed JSON response when content is JSON string', async () => {
  const jsonContent = '{"value": "INV-99999"}'
  mockRetrieveInsights.mockImplementationOnce(() => ({
    unwrap: () => Promise.resolve({
      [mockField.id]: {
        content: jsonContent,
        errorOccurred: false,
      },
    }),
  }))

  render(<FieldBaseCalibration {...defaultProps} />)

  const promptTextarea = screen.getByRole('textbox')
  const testPrompt = 'Extract invoice number'

  await userEvent.clear(promptTextarea)
  await userEvent.type(promptTextarea, testPrompt)

  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })
  await userEvent.click(executeButton)

  await waitFor(() => {
    expect(mockSetActiveField).toHaveBeenCalledWith(expect.objectContaining({
      id: mockField.id,
      name: mockField.name,
      fieldType: mockField.fieldType,
      extractorId: mockField.extractorId,
      multiplicity: mockField.multiplicity,
      query: expect.objectContaining({
        value: 'INV-99999',
        nodes: expect.arrayContaining([
          expect.objectContaining({
            name: 'Default',
            prompt: testPrompt,
          }),
        ]),
      }),
    }))
  })
})

test('updates activeField with array value for multiple field type', async () => {
  const arrayContent = {
    value: ['item1', 'item2', 'item3'],
  }
  mockRetrieveInsights.mockImplementationOnce(() => ({
    unwrap: () => Promise.resolve({
      [mockField.id]: {
        content: arrayContent,
        errorOccurred: false,
      },
    }),
  }))

  render(<FieldBaseCalibration {...defaultProps} />)

  const promptTextarea = screen.getByRole('textbox')
  const testPrompt = 'Extract multiple items'

  await userEvent.clear(promptTextarea)
  await userEvent.type(promptTextarea, testPrompt)

  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })
  await userEvent.click(executeButton)

  await waitFor(() => {
    expect(mockSetActiveField).toHaveBeenCalledWith(expect.objectContaining({
      id: mockField.id,
      name: mockField.name,
      fieldType: mockField.fieldType,
      extractorId: mockField.extractorId,
      multiplicity: mockField.multiplicity,
      query: expect.objectContaining({
        value: ['item1', 'item2', 'item3'],
        nodes: expect.arrayContaining([
          expect.objectContaining({
            name: 'Default',
            prompt: testPrompt,
          }),
        ]),
      }),
    }))
  })
})

test('updates activeField with key-value pair for dictionary field type', async () => {
  const dictContent = {
    value: {
      key: 'invoice_type',
      value: 'commercial',
    },
  }
  mockRetrieveInsights.mockImplementationOnce(() => ({
    unwrap: () => Promise.resolve({
      [mockField.id]: {
        content: dictContent,
        errorOccurred: false,
      },
    }),
  }))

  render(<FieldBaseCalibration {...defaultProps} />)

  const promptTextarea = screen.getByRole('textbox')
  const testPrompt = 'Extract key-value pair'

  await userEvent.clear(promptTextarea)
  await userEvent.type(promptTextarea, testPrompt)

  const executeButton = screen.getByRole('button', { name: new RegExp(localize(Localization.EXECUTE)) })
  await userEvent.click(executeButton)

  await waitFor(() => {
    expect(mockSetActiveField).toHaveBeenCalledWith(expect.objectContaining({
      id: mockField.id,
      name: mockField.name,
      fieldType: mockField.fieldType,
      extractorId: mockField.extractorId,
      multiplicity: mockField.multiplicity,
      query: expect.objectContaining({
        value: {
          key: 'invoice_type',
          value: 'commercial',
        },
        nodes: expect.arrayContaining([
          expect.objectContaining({
            name: 'Default',
            prompt: testPrompt,
          }),
        ]),
      }),
    }))
  })
})

test('wraps InsightsComparison with InsightsErrorBoundary', () => {
  render(<FieldBaseCalibration {...defaultProps} />)

  const errorBoundary = screen.getByTestId('InsightsErrorBoundary')
  const insightsComparison = screen.getByTestId('InsightsComparison')

  expect(errorBoundary).toBeInTheDocument()
  expect(insightsComparison).toBeInTheDocument()
  expect(errorBoundary).toContainElement(insightsComparison)
})
