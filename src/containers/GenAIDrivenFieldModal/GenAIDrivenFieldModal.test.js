
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import {
  LLMQueryCardinality,
  LLMQueryDataType,
  LLMExtractor,
  LLMExtractionParams,
  LLMExtractionQuery,
  LLMExtractionQueryNode,
  LLMReference,
} from '@/models/LLMExtractor'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { render } from '@/utils/rendererRTL'
import { GenAIDrivenFieldModal } from './GenAIDrivenFieldModal'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentType')

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    getValues: jest.fn(() => mockFormValues),
    formState: {
      isValid: true,
    },
    handleSubmit: jest.fn(),
    reset: mockReset,
  })),
}))

jest.mock('./GenAIDrivenFieldForm', () => ({
  GenAIDrivenFieldForm: () => <form data-testid={'field-form'} />,
}))

const mockReset = jest.fn()

const mockFieldCode = 'code 1'
const mockPrompt = 'prompt 1'

const mockField = new DocumentTypeField(
  mockFieldCode,
  'Field Name',
  {},
  FieldType.STRING,
  false,
  0,
  'dtCode',
  725,
  false,
  false,
)

const mockLLMExtractor1 = new LLMExtractor({
  extractorId: 'id1',
  name: 'LLM Extractor Name 1',
  extractionParams: new LLMExtractionParams({
    customInstruction: 'Test Instructions 1',
    groupingFactor: 1,
    temperature: 0.5,
    topP: 0.3,
  }),
  llmReference: new LLMReference({
    model: 'mockModel',
    provider: 'mockProvider',
  }),
  queries: [
    new LLMExtractionQuery({
      code: mockFieldCode,
      shape: {
        dataType: LLMQueryDataType.STRING,
        cardinality: LLMQueryCardinality.SCALAR,
        includeAliases: false,
      },
      workflow: {
        startNodeId: 'node1',
        endNodeId: 'node2',
        nodes: [
          new LLMExtractionQueryNode({
            id: 'nodeId',
            name: 'node name',
            prompt: mockPrompt,
          }),
        ],
      },
    }),
    new LLMExtractionQuery({
      code: 'code 2',
      shape: {
        dataType: LLMQueryDataType.STRING,
        cardinality: LLMQueryCardinality.SCALAR,
        includeAliases: false,
      },
      workflow: {
        startNodeId: 'node1',
        endNodeId: 'node2',
        nodes: [
          new LLMExtractionQueryNode({
            id: 'nodeId',
            name: 'node name',
            prompt: 'prompt 2',
          }),
        ],
      },
    }),
  ],
})

const mockLLMExtractor2 = new LLMExtractor({
  extractorId: 'id2',
  name: 'LLM Extractor Name 2',
  extractionParams: new LLMExtractionParams({
    customInstruction: 'Test Instructions 2',
    groupingFactor: 1,
    temperature: 0.5,
    topP: 0.3,
  }),
  llmReference: new LLMReference({
    model: 'mockModel',
    provider: 'mockProvider',
  }),
  queries: [
    new LLMExtractionQuery({
      code: 'code 3',
      shape: {
        dataType: LLMQueryDataType.STRING,
        cardinality: LLMQueryCardinality.SCALAR,
        includeAliases: false,
      },
      workflow: {
        startNodeId: 'node1',
        endNodeId: 'node2',
        nodes: [
          new LLMExtractionQueryNode({
            id: 'nodeId',
            name: 'node name',
            prompt: 'prompt 3',
          }),
        ],
      },
    }),
  ],
})

const mockDocumentTypeCode = 'Doc type code'

const mockDocumentType = new ExtendedDocumentType({
  code: mockDocumentTypeCode,
  name: 'Doc Type 1',
  llmExtractors: [mockLLMExtractor1, mockLLMExtractor2],
})

const mockFormValues = {
  name: mockField.name,
  fieldType: mockField.fieldType,
  promptValue: mockField.promptValue,
  required: false,
  extractorId: mockLLMExtractor1.extractorId,
  confidential: true,
  displayCharLimit: 5,
  cardinality: LLMQueryCardinality.SCALAR,
  readOnly: true,
  includeAliases: false,
}

beforeEach(() => {
  jest.clearAllMocks()
  documentTypeStateSelector.mockReturnValue(mockDocumentType)
})

test('renders Modal correctly', async () => {
  const props = {
    isLoading: false,
    onSubmit: jest.fn(),
    closeModal: jest.fn(),
    visible: true,
  }

  render(<GenAIDrivenFieldModal {...props} />)

  expect(screen.getByText(localize(Localization.ADD_GEN_AI_DRIVEN_FIELD))).toBeInTheDocument()
  expect(screen.getByRole('button', { name: localize(Localization.CANCEL) })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: localize(Localization.CREATE) })).toBeInTheDocument()
})

test('renders Modal correctly if field prop is provided', async () => {
  const props = {
    isLoading: false,
    onSubmit: jest.fn(),
    closeModal: jest.fn(),
    visible: true,
    field: mockField,
  }

  render(<GenAIDrivenFieldModal {...props} />)

  expect(screen.getByText(localize(Localization.EDIT_GEN_AI_DRIVEN_FIELD))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.CANCEL))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.SUBMIT))).toBeInTheDocument()
})

test('calls closeModal when click on cancel button', async () => {
  const props = {
    isLoading: false,
    onSubmit: jest.fn(),
    closeModal: jest.fn(),
    visible: true,
    field: mockField,
  }

  render(<GenAIDrivenFieldModal {...props} />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.CANCEL) }))

  expect(props.closeModal).toHaveBeenCalled()
})

test('calls onSubmit with correct arguments when click on create button while field adding', async () => {
  const props = {
    isLoading: false,
    onSubmit: jest.fn(),
    closeModal: jest.fn(),
    visible: true,
  }

  render(<GenAIDrivenFieldModal {...props} />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.CREATE) }))

  expect(props.onSubmit).toHaveBeenNthCalledWith(1, mockFormValues)
})

test('calls onSubmit with correct arguments when click on submit button while field editing', async () => {
  const props = {
    field: mockField,
    isLoading: false,
    onSubmit: jest.fn(),
    closeModal: jest.fn(),
    visible: true,
  }

  render(<GenAIDrivenFieldModal {...props} />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.SUBMIT) }))

  expect(props.onSubmit).toHaveBeenNthCalledWith(1, mockFormValues)
})

test('sets submitted values as the new default values on field submit', async () => {
  const props = {
    isLoading: false,
    onSubmit: jest.fn(),
    closeModal: jest.fn(),
    visible: true,
    field: mockField,
  }

  render(<GenAIDrivenFieldModal {...props} />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.SUBMIT) }))

  expect(mockReset).toHaveBeenNthCalledWith(1, mockFormValues)
})
