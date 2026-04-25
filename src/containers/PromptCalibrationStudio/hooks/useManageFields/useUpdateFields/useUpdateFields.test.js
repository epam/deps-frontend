
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { sendBatchRequests } from '@/containers/PromptCalibrationStudio/utils'
import {
  Field,
  Query,
  QueryNode,
  MULTIPLICITY,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { useUpdateFields } from './useUpdateFields'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/PromptCalibrationStudio/utils', () => ({
  sendBatchRequests: jest.fn(async (requests) => {
    for (const request of requests) {
      await request()
    }
  }),
}))

jest.mock('@/apiRTK/extractionFieldsApi', () => ({
  useUpdateExtractionFieldMutation: jest.fn(() => [mockUpdateExtractionField]),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useMoveLLMExtractorQueryMutation: jest.fn(() => [mockMoveLLMExtractorQuery]),
  useUpdateLLMExtractorQueryMutation: jest.fn(() => [mockUpdateLLMExtractorQuery]),
}))

const mockUnwrapUpdateField = jest.fn()
const mockUnwrapMoveQuery = jest.fn()
const mockUnwrapUpdateQuery = jest.fn()
const mockUpdateExtractionField = jest.fn(() => ({
  unwrap: mockUnwrapUpdateField,
}))
const mockMoveLLMExtractorQuery = jest.fn(() => ({
  unwrap: mockUnwrapMoveQuery,
}))
const mockUpdateLLMExtractorQuery = jest.fn(() => ({
  unwrap: mockUnwrapUpdateQuery,
}))

const mockDocumentTypeCode = 'doc-type-123'

const mockInitialField = new Field({
  id: 'field-1',
  name: 'Test Field 1',
  extractorId: 'extractor-1',
  multiplicity: MULTIPLICITY.SINGLE,
  fieldType: FieldType.STRING,
  confidential: false,
  readOnly: false,
  query: new Query({
    nodes: [
      new QueryNode({
        id: 'node-1',
        name: 'Node 1',
        prompt: 'Extract data',
      }),
    ],
  }),
})

const mockUpdatedFieldSameExtractor = new Field({
  id: 'field-1',
  name: 'Updated Field 1',
  extractorId: 'extractor-1',
  multiplicity: MULTIPLICITY.SINGLE,
  fieldType: FieldType.STRING,
  confidential: true,
  readOnly: true,
  query: new Query({
    nodes: [
      new QueryNode({
        id: 'node-1',
        name: 'Node 1',
        prompt: 'Extract updated data',
      }),
    ],
  }),
})

const mockUpdatedFieldDifferentExtractor = new Field({
  id: 'field-1',
  name: 'Updated Field 1',
  extractorId: 'extractor-2',
  multiplicity: MULTIPLICITY.SINGLE,
  fieldType: FieldType.STRING,
  confidential: false,
  readOnly: false,
  query: new Query({
    nodes: [
      new QueryNode({
        id: 'node-1',
        name: 'Node 1',
        prompt: 'Extract data',
      }),
    ],
  }),
})

const mockFieldWithoutQuery = new Field({
  id: 'field-2',
  name: 'Field Without Query',
  extractorId: 'extractor-1',
  multiplicity: MULTIPLICITY.SINGLE,
  fieldType: FieldType.STRING,
  confidential: false,
  readOnly: false,
  query: { nodes: [] },
})

test('successfully updates query without moving extractor', async () => {
  jest.clearAllMocks()

  mockUnwrapUpdateField.mockResolvedValue({})
  mockUnwrapUpdateQuery.mockResolvedValue({})

  const { result } = renderHook(() => useUpdateFields())

  await result.current.updateFields(
    mockDocumentTypeCode,
    [mockUpdatedFieldSameExtractor],
    [mockInitialField],
  )

  expect(mockMoveLLMExtractorQuery).not.toHaveBeenCalled()
  expect(mockUpdateExtractionField).toHaveBeenCalledWith({
    documentTypeCode: mockDocumentTypeCode,
    extractorId: mockUpdatedFieldSameExtractor.extractorId,
    fieldCode: mockUpdatedFieldSameExtractor.id,
    data: expect.objectContaining({
      name: mockUpdatedFieldSameExtractor.name,
    }),
  })
  expect(mockUpdateLLMExtractorQuery).toHaveBeenCalledTimes(1)
})

test('moves query and updates field when extractor changes', async () => {
  jest.clearAllMocks()

  mockUnwrapMoveQuery.mockResolvedValue({})
  mockUnwrapUpdateField.mockResolvedValue({})
  mockUnwrapUpdateQuery.mockResolvedValue({})

  const { result } = renderHook(() => useUpdateFields())

  await result.current.updateFields(
    mockDocumentTypeCode,
    [mockUpdatedFieldDifferentExtractor],
    [mockInitialField],
  )

  expect(mockMoveLLMExtractorQuery).toHaveBeenCalledWith({
    documentTypeId: mockDocumentTypeCode,
    data: {
      sourceExtractorId: mockInitialField.extractorId,
      targetExtractorId: mockUpdatedFieldDifferentExtractor.extractorId,
      fieldsCodes: [mockUpdatedFieldDifferentExtractor.id],
    },
  })
  expect(mockUpdateExtractionField).toHaveBeenCalledTimes(1)
  expect(mockUpdateLLMExtractorQuery).not.toHaveBeenCalled()
})

test('updates extraction field with correct data when extractor changes', async () => {
  jest.clearAllMocks()

  mockUnwrapMoveQuery.mockResolvedValue({})
  mockUnwrapUpdateField.mockResolvedValue({})
  mockUnwrapUpdateQuery.mockResolvedValue({})

  const { result } = renderHook(() => useUpdateFields())

  await result.current.updateFields(
    mockDocumentTypeCode,
    [mockUpdatedFieldDifferentExtractor],
    [mockInitialField],
  )

  expect(mockUpdateExtractionField).toHaveBeenCalledWith({
    documentTypeCode: mockDocumentTypeCode,
    extractorId: mockUpdatedFieldDifferentExtractor.extractorId,
    fieldCode: mockUpdatedFieldDifferentExtractor.id,
    data: expect.objectContaining({
      name: mockUpdatedFieldDifferentExtractor.name,
      confidential: mockUpdatedFieldDifferentExtractor.confidential,
      readOnly: mockUpdatedFieldDifferentExtractor.readOnly,
      fieldType: mockUpdatedFieldDifferentExtractor.fieldType,
      extractorId: mockUpdatedFieldDifferentExtractor.extractorId,
    }),
  })
})

test('updates LLM query when field has query nodes', async () => {
  jest.clearAllMocks()

  mockUnwrapUpdateField.mockResolvedValue({})
  mockUnwrapUpdateQuery.mockResolvedValue({})

  const { result } = renderHook(() => useUpdateFields())

  await result.current.updateFields(
    mockDocumentTypeCode,
    [mockUpdatedFieldSameExtractor],
    [mockInitialField],
  )

  expect(mockUpdateLLMExtractorQuery).toHaveBeenCalledWith({
    documentTypeId: mockDocumentTypeCode,
    extractorId: mockUpdatedFieldSameExtractor.extractorId,
    fieldCode: mockUpdatedFieldSameExtractor.id,
    data: expect.objectContaining({
      code: mockUpdatedFieldSameExtractor.id,
      shape: expect.any(Object),
      workflow: expect.any(Object),
    }),
  })
})

test('does not update LLM query when field has no query nodes', async () => {
  jest.clearAllMocks()

  mockUnwrapUpdateField.mockResolvedValue({})

  const { result } = renderHook(() => useUpdateFields())

  await result.current.updateFields(
    mockDocumentTypeCode,
    [mockFieldWithoutQuery],
    [mockFieldWithoutQuery],
  )

  expect(mockUpdateExtractionField).not.toHaveBeenCalled()
  expect(mockUpdateLLMExtractorQuery).not.toHaveBeenCalled()
})

test('processes multiple fields in batches', async () => {
  jest.clearAllMocks()

  mockUnwrapUpdateField.mockResolvedValue({})
  mockUnwrapUpdateQuery.mockResolvedValue({})

  const { result } = renderHook(() => useUpdateFields())

  const multipleFields = [mockUpdatedFieldSameExtractor, mockUpdatedFieldSameExtractor]
  const initialFields = [mockInitialField, mockInitialField]

  await result.current.updateFields(
    mockDocumentTypeCode,
    multipleFields,
    initialFields,
  )

  expect(sendBatchRequests).toHaveBeenCalledWith(
    expect.any(Array),
    3,
  )
  expect(mockUpdateLLMExtractorQuery).toHaveBeenCalledTimes(2)
})

test('calls sendBatchRequests when call updateFields', async () => {
  jest.clearAllMocks()

  const { result } = renderHook(() => useUpdateFields())

  await result.current.updateFields(
    mockDocumentTypeCode,
    [mockUpdatedFieldSameExtractor],
    [mockInitialField],
  )

  expect(sendBatchRequests).toHaveBeenCalledWith(
    expect.any(Array),
    3,
  )
})

test('updates extraction field when order changes', async () => {
  jest.clearAllMocks()

  const mockFieldWithUpdatedOrder = new Field({
    id: 'field-1',
    name: 'Test Field 1',
    extractorId: 'extractor-1',
    multiplicity: MULTIPLICITY.SINGLE,
    fieldType: FieldType.STRING,
    confidential: false,
    readOnly: false,
    order: 2,
    query: new Query({
      nodes: [
        new QueryNode({
          id: 'node-1',
          name: 'Node 1',
          prompt: 'Extract data',
        }),
      ],
    }),
  })

  const mockInitialFieldWithOrder = new Field({
    ...mockInitialField,
    order: 1,
  })

  mockUnwrapUpdateField.mockResolvedValue({})

  const { result } = renderHook(() => useUpdateFields())

  await result.current.updateFields(
    mockDocumentTypeCode,
    [mockFieldWithUpdatedOrder],
    [mockInitialFieldWithOrder],
  )

  expect(mockUpdateExtractionField).toHaveBeenCalledWith({
    documentTypeCode: mockDocumentTypeCode,
    extractorId: mockFieldWithUpdatedOrder.extractorId,
    fieldCode: mockFieldWithUpdatedOrder.id,
    data: expect.objectContaining({
      name: mockFieldWithUpdatedOrder.name,
      order: 2,
    }),
  })
})
