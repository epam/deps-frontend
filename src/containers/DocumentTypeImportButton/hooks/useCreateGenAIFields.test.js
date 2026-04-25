
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { mockDocumentTypeData } from '../__mocks__/mockDocumentTypeData'
import { CREATE_GEN_AI_FIELD_REQUESTS_COUNT, initialValues } from '../constants'
import { useCreateGenAIFields } from './useCreateGenAIFields'

jest.mock('@/utils/env', () => mockEnv)

const mockCreateExtractionField = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({ code: mockExtractionFieldCode })),
}))

const mockCreateLLMExtractorQuery = jest.fn(() => ({
  unwrap: jest.fn(),
}))

jest.mock('@/apiRTK/extractionFieldsApi', () => ({
  useCreateExtractionFieldMutation: jest.fn(() => ([mockCreateExtractionField])),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useCreateLLMExtractorQueryMutation: jest.fn(() => ([mockCreateLLMExtractorQuery])),
}))

const mockDocumentTypeId = 'Doc Type Id'
const mockExtractionFieldCode = 'fieldCode'

const llmExtractorsIdsMapping = mockDocumentTypeData.llmExtractors.reduce((acc, llmExtractor) => {
  acc[llmExtractor.extractorId] = `created-${llmExtractor.extractorId}`

  return acc
}, {})

const defaultProps = {
  documentTypeDataRef: {
    current: {
      ...mockDocumentTypeData,
      documentTypeId: mockDocumentTypeId,
    },
  },
  fieldsCodesMappingRef: {
    current: initialValues.fieldsCodesMapping,
  },
  increaseRequestCount: jest.fn(),
  llmExtractorsIdsMappingRef: {
    current: llmExtractorsIdsMapping,
  },
}

test('hook returns correct values', () => {
  const { result } = renderHook(() => useCreateGenAIFields(defaultProps))

  expect(result.current).toEqual({
    createGenAIFields: expect.any(Function),
  })
})

test('calls createExtractionField with correct arguments on GenAI fields creation', async () => {
  const { result } = renderHook(() => useCreateGenAIFields(defaultProps))
  const { createGenAIFields } = result.current
  await createGenAIFields()

  mockDocumentTypeData.genAIFields.forEach((field, index) => {
    const {
      confidential,
      fieldMeta,
      fieldType,
      extractorId,
      name,
      order,
      readOnly,
      required,
    } = field

    const llmExtractor = mockDocumentTypeData.llmExtractors.find((extractor) => extractor.extractorId === extractorId)

    expect(mockCreateExtractionField).nthCalledWith(
      index + 1,
      {
        documentTypeCode: mockDocumentTypeId,
        field: {
          confidential,
          fieldMeta,
          fieldType,
          extractorId: llmExtractorsIdsMapping[llmExtractor.extractorId],
          name,
          order,
          readOnly,
          required,
        },
      },
    )
  })
})

test('calls createLLMExtractorQuery with correct arguments on GenAI fields creation', async () => {
  const { result } = renderHook(() => useCreateGenAIFields(defaultProps))
  const { createGenAIFields } = result.current
  await createGenAIFields()

  mockDocumentTypeData.genAIFields.forEach((field, index) => {
    const llmExtractor = mockDocumentTypeData.llmExtractors.find((extractor) => extractor.extractorId === field.extractorId)
    const query = llmExtractor.queries.find((query) => query.code === field.code)

    expect(mockCreateLLMExtractorQuery).nthCalledWith(
      index + 1,
      {
        documentTypeId: mockDocumentTypeId,
        extractorId: llmExtractorsIdsMapping[llmExtractor.extractorId],
        data: {
          code: mockExtractionFieldCode,
          shape: query.shape,
          workflow: query.workflow,
        },
      },
    )
  })
})

test('calls increaseRequestCount after every GenAI field and query creation', async () => {
  jest.clearAllMocks()

  const { result } = renderHook(() => useCreateGenAIFields(defaultProps))
  const { createGenAIFields } = result.current
  await createGenAIFields()

  mockDocumentTypeData.genAIFields.forEach((field, index) => {
    expect(defaultProps.increaseRequestCount).nthCalledWith(index + 1, CREATE_GEN_AI_FIELD_REQUESTS_COUNT)
  })
})
