
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { renderHook } from '@testing-library/react-hooks'
import {
  Field,
  Query,
  QueryNode,
  MULTIPLICITY,
  Extractor,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { FieldType } from '@/enums/FieldType'
import { useFieldCalibration } from '../useFieldCalibration'
import { useExtractFieldsValues } from './useExtractFieldsValues'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('../useRetrieveInsights', () => ({
  useRetrieveInsights: jest.fn(() => [
    mockRetrieveInsights,
    false,
  ]),
}))

jest.mock('../useFieldCalibration', () => ({
  useFieldCalibration: jest.fn(() => ({
    fields: mockFields,
    batchUpdateFields: mockBatchUpdateFields,
    activeField: mockActiveField,
  })),
}))

const mockRetrieveInsights = jest.fn()
const mockBatchUpdateFields = jest.fn()

const mockFields = [
  new Field({
    id: 'field-1',
    name: 'Field 1',
    extractorId: 'extractor-1',
    fieldType: FieldType.STRING,
    multiplicity: MULTIPLICITY.SINGLE,
    value: 'existing value 1',
    query: new Query({
      nodes: [
        new QueryNode({
          id: 'node-1',
          name: 'Node 1',
          prompt: 'Extract field 1',
        }),
      ],
      value: 'old value 1',
    }),
  }),
  new Field({
    id: 'field-2',
    name: 'Field 2',
    extractorId: 'extractor-1',
    fieldType: FieldType.STRING,
    multiplicity: MULTIPLICITY.SINGLE,
    value: 'existing value 2',
    query: new Query({
      nodes: [
        new QueryNode({
          id: 'node-2',
          name: 'Node 2',
          prompt: 'Extract field 2',
        }),
      ],
      value: 'old value 2',
    }),
  }),
  new Field({
    id: 'field-3',
    name: 'Field 3',
    extractorId: 'extractor-2',
    fieldType: FieldType.STRING,
    multiplicity: MULTIPLICITY.SINGLE,
    value: 'existing value 3',
    query: new Query({
      nodes: [
        new QueryNode({
          id: 'node-3',
          name: 'Node 3',
          prompt: 'Extract field 3',
        }),
      ],
      value: 'old value 3',
    }),
  }),
]

const mockExtractor = new Extractor({
  id: 'extractor-1',
  model: 'gpt-4',
  customInstruction: 'Test instruction',
  temperature: 0.7,
  topP: 0.9,
  groupingFactor: 5,
})

const mockApiResponse = {
  'field-1': {
    content: JSON.stringify({
      value: 'new value 1',
      reasoning: 'reasoning 1',
    }),
    errorOccurred: false,
  },
  'field-2': {
    content: JSON.stringify({
      value: 'new value 2',
      reasoning: 'reasoning 2',
    }),
    errorOccurred: false,
  },
}

const mockActiveField = new Field({
  id: 'active-field-id',
  name: 'Active Field',
  extractorId: 'extractor-1',
  fieldType: FieldType.STRING,
  multiplicity: MULTIPLICITY.SINGLE,
  value: '',
  query: new Query({
    nodes: [],
    value: null,
  }),
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('updates fields with matching extractorId excluding activeField', async () => {
  mockRetrieveInsights.mockReturnValue({
    unwrap: jest.fn().mockResolvedValue(mockApiResponse),
  })

  const { result } = renderHook(() => useExtractFieldsValues())

  await result.current.extractFieldsValues(mockExtractor)

  expect(mockRetrieveInsights).toHaveBeenCalledWith(
    expect.objectContaining({
      model: mockExtractor.model,
      customInstructions: mockExtractor.customInstruction,
    }),
  )

  expect(mockBatchUpdateFields).toHaveBeenCalledTimes(1)

  const updatedFieldsMap = mockBatchUpdateFields.mock.calls[0][0]

  expect(updatedFieldsMap['field-1'].value).toEqual('new value 1')
  expect(updatedFieldsMap['field-2'].value).toEqual('new value 2')
})

test('does not call API when no fields match extractorId', async () => {
  const nonExistentExtractor = {
    ...mockExtractor,
    id: 'extractor-nonexistent',
  }

  const { result } = renderHook(() => useExtractFieldsValues())

  await result.current.extractFieldsValues(nonExistentExtractor)

  expect(mockRetrieveInsights).not.toHaveBeenCalled()
  expect(mockBatchUpdateFields).not.toHaveBeenCalled()
})

test('does not call API when fields have no query nodes', async () => {
  const mockFieldsWithoutNodes = [
    new Field({
      id: 'field-1',
      name: 'Field 1',
      extractorId: 'extractor-1',
      fieldType: FieldType.STRING,
      multiplicity: MULTIPLICITY.SINGLE,
      value: 'some value',
      query: new Query({
        nodes: [],
        value: null,
      }),
    }),
  ]

  useFieldCalibration.mockImplementationOnce(() => ({
    fields: mockFieldsWithoutNodes,
    batchUpdateFields: mockBatchUpdateFields,
    activeField: mockActiveField,
  }))

  const { result } = renderHook(() => useExtractFieldsValues())

  await result.current.extractFieldsValues(mockExtractor)

  expect(mockRetrieveInsights).not.toHaveBeenCalled()
  expect(mockBatchUpdateFields).not.toHaveBeenCalled()
})

test('shows warning when API returns error for a field', async () => {
  const mockApiResponseWithError = {
    'field-1': {
      content: 'Error processing field 1',
      errorOccurred: true,
    },
    'field-2': {
      content: JSON.stringify({
        value: 'new value 2',
        reasoning: 'reasoning 2',
      }),
      errorOccurred: false,
    },
  }

  mockRetrieveInsights.mockReturnValue({
    unwrap: jest.fn().mockResolvedValue(mockApiResponseWithError),
  })

  const { result } = renderHook(() => useExtractFieldsValues())

  await result.current.extractFieldsValues(mockExtractor)

  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(mockApiResponseWithError['field-1'].content)
})

test('shows warning when API call fails with error code', async () => {
  const errorCode = 'document_parsing_error'
  mockRetrieveInsights.mockReturnValue({
    unwrap: jest.fn().mockRejectedValue({
      data: { code: errorCode },
    }),
  })

  const { result } = renderHook(() => useExtractFieldsValues())

  await result.current.extractFieldsValues(mockExtractor)

  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(RESOURCE_ERROR_TO_DISPLAY[errorCode])
  expect(mockBatchUpdateFields).not.toHaveBeenCalled()
})

test('updates only fields with successful content responses', async () => {
  const mockApiResponsePartialSuccess = {
    'field-1': {
      content: JSON.stringify({
        value: 'new value 1',
        reasoning: 'reasoning 1',
      }),
      errorOccurred: false,
    },
    'field-2': {
      content: null,
      errorOccurred: false,
    },
  }

  mockRetrieveInsights.mockReturnValue({
    unwrap: jest.fn().mockResolvedValue(mockApiResponsePartialSuccess),
  })

  const { result } = renderHook(() => useExtractFieldsValues())

  await result.current.extractFieldsValues(mockExtractor)

  expect(mockBatchUpdateFields).toHaveBeenCalledTimes(1)
  const updatedFieldsMap = mockBatchUpdateFields.mock.calls[0][0]
  expect(updatedFieldsMap['field-1']).toBeDefined()
  expect(updatedFieldsMap['field-2']).toBeUndefined()
  expect(updatedFieldsMap['field-1'].value).toEqual('new value 1')
})
