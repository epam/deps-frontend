
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/dom'
import { DocumentConsolidatedField } from '@/containers/DocumentConsolidatedData/DocumentConsolidatedField'
import { DocumentState } from '@/enums/DocumentState'
import { ExtractionType } from '@/enums/ExtractionType'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import { ExtractedDataField, FieldData } from '@/models/ExtractedData'
import {
  LLMQueryDataType,
  LLMExtractor,
  LLMExtractionParams,
  LLMExtractionQuery,
  LLMExtractionQueryNode,
  LLMReference,
  LLMExtractionQueryWorkflow,
  LLMExtractionQueryEdge,
  LLMQueryCardinality,
  LLMExtractionQueryFormat,
} from '@/models/LLMExtractor'
import { render } from '@/utils/rendererRTL'
import { mapExtractedDataFieldToConsolidatedField } from './mapExtractedDataFieldToConsolidatedField'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/FieldAdapter', () => ({
  FieldAdapter: ({ disabled, promptChain }) => (
    <>
      <input disabled={disabled} />
      {
        promptChain?.map((p, i) => (
          <span key={i}>{p.prompt}</span>
        ))
      }
    </>
  ),
}))

const mockDocumentTypeCode = 'mockDocumentTypeCode'
const pk1 = 'stringPk1'
const pk2 = 'stringPk2'
const mockPrompt = 'Test Prompt'

const docTypeField1 = new DocumentTypeField(
  'stringFieldCode1',
  'String Field 1',
  {},
  FieldType.STRING,
  false,
  1,
  mockDocumentTypeCode,
  pk1,
)

const docTypeField2 = new DocumentTypeField(
  'stringFieldCode2',
  'String Field 2',
  {},
  FieldType.STRING,
  false,
  1,
  mockDocumentTypeCode,
  pk2,
)

const mockEdField = new ExtractedDataField(
  pk1,
  new FieldData(
    'string',
  ),
)

const mockLLMExtractor = new LLMExtractor({
  extractorId: 'extractorId',
  name: 'LLM Extractor Name',
  extractionParams: new LLMExtractionParams({
    customInstruction: 'Test Instructions',
    groupingFactor: 1,
    temperature: 0.5,
    topP: 0.3,
  }),
  llmReference: new LLMReference({
    model: 'mockModel',
    provider: 'mockProvider',
  }),
  queries: [],
})

const mockExtractionQuery = new LLMExtractionQuery({
  code: docTypeField1.code,
  shape: new LLMExtractionQueryFormat({
    dataType: LLMQueryDataType.STRING,
    cardinality: LLMQueryCardinality.SCALAR,
    includeAliases: false,
  }),
  workflow: new LLMExtractionQueryWorkflow({
    startNodeId: 'code1',
    endNodeId: 'code2',
    nodes: [
      new LLMExtractionQueryNode({
        id: 'nodeId',
        name: 'node name',
        prompt: mockPrompt,
      }),
    ],
    edges: [
      new LLMExtractionQueryEdge({
        sourceId: 'code1',
        targetId: 'nodeId',
      }),
    ],
  }),
})

const mockDocumentType = new ExtendedDocumentType({
  code: mockDocumentTypeCode,
  name: 'Test Doc Type',
  engine: 'mockEngineCode',
  extractionType: ExtractionType.TEMPLATE,
  fields: [docTypeField1, docTypeField2],
  llmExtractors: [mockLLMExtractor],
})

test('returns correct result', () => {
  const args = {
    edField: mockEdField,
    documentValidation: {},
    documentType: mockDocumentType,
    activeFieldPk: pk1,
    documentState: DocumentState.IN_REVIEW,
  }

  const result = mapExtractedDataFieldToConsolidatedField(args)

  expect(result).toEqual(new DocumentConsolidatedField({
    code: docTypeField1.code,
    name: docTypeField1.name,
    order: docTypeField1.order,
    type: docTypeField1.fieldType,
    render: expect.any(Function),
  }))
})

test('renders extracted data field when call render method', async () => {
  const args = {
    edField: mockEdField,
    documentValidation: {},
    documentType: mockDocumentType,
    activeFieldPk: pk1,
    documentState: DocumentState.IN_REVIEW,
  }

  const result = mapExtractedDataFieldToConsolidatedField(args)

  render(<div>{result.render()}</div>)

  await waitFor(() => {
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})

test('disabled field adapter if document is not in review state', async () => {
  const args = {
    edField: mockEdField,
    documentValidation: {},
    documentType: mockDocumentType,
    activeFieldPk: pk1,
    documentState: DocumentState.NEW,
  }

  const result = mapExtractedDataFieldToConsolidatedField(args)

  render(<div>{result.render()}</div>)

  await waitFor(() => {
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})

test('disabled field adapter if field is read only', async () => {
  const args = {
    edField: mockEdField,
    documentValidation: {},
    documentType: {
      ...mockDocumentType,
      fields: [
        {
          ...docTypeField1,
          readOnly: true,
        },
      ],
    },
    activeFieldPk: pk1,
    documentState: DocumentState.IN_REVIEW,
  }

  const result = mapExtractedDataFieldToConsolidatedField(args)

  render(<div>{result.render()}</div>)

  await waitFor(() => {
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})

test('renders field prompts in case field has llm extractor', async () => {
  const documentTypeOverride = {
    ...mockDocumentType,
    llmExtractors: [
      {
        ...mockLLMExtractor,
        queries: [mockExtractionQuery],
      },
    ],
  }

  const args = {
    edField: mockEdField,
    documentValidation: {},
    documentType: documentTypeOverride,
    activeFieldPk: pk1,
    documentState: DocumentState.IN_REVIEW,
  }

  const result = mapExtractedDataFieldToConsolidatedField(args)

  render(<div>{result.render()}</div>)

  expect(screen.getByText(mockPrompt)).toBeInTheDocument()
})
