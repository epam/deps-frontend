
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FIELD_FORM_CODE } from '@/containers/ManageBatch/constants'
import { render } from '@/utils/rendererRTL'
import { BulkEngineSelect } from './BulkEngineSelect'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)

jest.mock('@/containers/ManageBatch/ManageBatchFormFields/EngineSelect', () => ({
  EngineSelect: ({ onChange, ...props }) => (
    <select
      data-testid="EngineSelect"
      onChange={(e) => onChange(e.target.value)}
      {...props}
    >
      <option value="engine1">Engine 1</option>
      <option value="engine2">Engine 2</option>
    </select>
  ),
}))

const mockSetValue = jest.fn()
const mockGetValues = jest.fn()

jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(() => ({
    setValue: mockSetValue,
    getValues: mockGetValues,
  })),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders EngineSelect with enhanced onChange', () => {
  render(
    <BulkEngineSelect
      onChange={jest.fn()}
    />,
  )

  expect(screen.getByTestId('EngineSelect')).toBeInTheDocument()
})

test('calls original onChange and does not update files when no files exist', async () => {
  const onChange = jest.fn()
  mockGetValues.mockImplementation(() => undefined)

  render(<BulkEngineSelect onChange={onChange} />)

  await userEvent.selectOptions(screen.getByTestId('EngineSelect'), 'engine2')

  expect(onChange).toHaveBeenCalledWith('engine2')
  expect(mockSetValue).not.toHaveBeenCalled()
})

test('updates matching files with the new engine value', async () => {
  const onChange = jest.fn()
  const currentDocumentType = 'doc1'
  const currentEngine = 'engine1'
  const currentLlmType = 'llmA'
  const currentParsingFeatures = ['feature1', 'feature2']

  const files = [
    {
      settings: {
        documentType: currentDocumentType,
        engine: currentEngine,
        llmType: currentLlmType,
        parsingFeatures: currentParsingFeatures,
      },
    },
    {
      settings: {
        documentType: 'doc2',
        engine: currentEngine,
        llmType: currentLlmType,
        parsingFeatures: currentParsingFeatures,
      },
    },
    {
      settings: {
        documentType: currentDocumentType,
        engine: currentEngine,
        llmType: currentLlmType,
        parsingFeatures: currentParsingFeatures,
      },
    },
  ]

  mockGetValues.mockImplementation((key) => {
    if (key === FIELD_FORM_CODE.FILES) {
      return files
    }
    if (key === FIELD_FORM_CODE.DOCUMENT_TYPE) {
      return currentDocumentType
    }
    if (key === FIELD_FORM_CODE.ENGINE) {
      return currentEngine
    }
    if (key === FIELD_FORM_CODE.LLM_TYPE) {
      return currentLlmType
    }
    if (key === FIELD_FORM_CODE.PARSING_FEATURES) {
      return currentParsingFeatures
    }
    return undefined
  })

  render(<BulkEngineSelect onChange={onChange} />)

  await userEvent.selectOptions(screen.getByTestId('EngineSelect'), 'engine2')

  expect(onChange).toHaveBeenCalledWith('engine2')
  expect(mockSetValue).toHaveBeenCalledWith(`${FIELD_FORM_CODE.FILES}.0.settings.${FIELD_FORM_CODE.ENGINE}`, 'engine2')
  expect(mockSetValue).not.toHaveBeenCalledWith(`${FIELD_FORM_CODE.FILES}.1.settings.${FIELD_FORM_CODE.ENGINE}`, 'engine2')
  expect(mockSetValue).toHaveBeenCalledWith(`${FIELD_FORM_CODE.FILES}.2.settings.${FIELD_FORM_CODE.ENGINE}`, 'engine2')
})

test('does not update files with different parsing features', async () => {
  const onChange = jest.fn()
  const currentDocumentType = 'doc1'
  const currentEngine = 'engine1'
  const currentLlmType = 'llmA'
  const currentParsingFeatures = ['feature1', 'feature2']

  const files = [
    {
      settings: {
        documentType: currentDocumentType,
        engine: currentEngine,
        llmType: currentLlmType,
        parsingFeatures: ['feature1'],
      },
    },
  ]

  mockGetValues.mockImplementation((key) => {
    if (key === FIELD_FORM_CODE.FILES) {
      return files
    }
    if (key === FIELD_FORM_CODE.DOCUMENT_TYPE) {
      return currentDocumentType
    }
    if (key === FIELD_FORM_CODE.ENGINE) {
      return currentEngine
    }
    if (key === FIELD_FORM_CODE.LLM_TYPE) {
      return currentLlmType
    }
    if (key === FIELD_FORM_CODE.PARSING_FEATURES) {
      return currentParsingFeatures
    }
    return undefined
  })

  render(<BulkEngineSelect onChange={onChange} />)

  await userEvent.selectOptions(screen.getByTestId('EngineSelect'), 'engine2')

  expect(onChange).toHaveBeenCalledWith('engine2')
  expect(mockSetValue).not.toHaveBeenCalled()
})
