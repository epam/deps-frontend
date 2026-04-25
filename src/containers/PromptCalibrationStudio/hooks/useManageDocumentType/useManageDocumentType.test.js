
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { renderHook, act } from '@testing-library/react-hooks'
import { Extractor, Field, Query } from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { useManageDocumentType } from './useManageDocumentType'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('../useManageFields', () => ({
  useManageFields: jest.fn(() => ({
    manageFields: mockManageFields,
  })),
}))

jest.mock('../useManageExtractors', () => ({
  useManageExtractors: jest.fn(() => ({
    manageExtractors: mockManageExtractors,
  })),
}))

jest.mock('./useCreateDocumentType', () => ({
  useCreateDocumentType: jest.fn(() => ({
    createDocType: mockCreateDocType,
  })),
}))

jest.mock('@/containers/PromptCalibrationStudio/mappers', () => ({
  mapFieldsAndExtractorsToCategorized: jest.fn(({ currentFields, currentExtractors }) => ({
    categorizedFields: {
      created: currentFields.filter((f) => f.isNew),
      updated: currentFields.filter((f) => !f.isNew && f.name !== 'Unchanged Field'),
      untouched: currentFields.filter((f) => !f.isNew && f.name === 'Unchanged Field'),
    },
    categorizedExtractors: {
      created: currentExtractors.filter((e) => e.id.includes('new')),
      updated: currentExtractors.filter((e) => !e.id.includes('new') && e.name !== 'Unchanged Extractor'),
      untouched: currentExtractors.filter((e) => !e.id.includes('new') && e.name === 'Unchanged Extractor'),
    },
  })),
}))

const mockManageFields = jest.fn(() => Promise.resolve())
const mockManageExtractors = jest.fn(() => Promise.resolve({}))
const mockCreateDocType = jest.fn(() => Promise.resolve({ documentTypeId: mockDocumentTypeCode }))

const mockDocumentTypeCode = 'doc-type-123'

const mockFields = [
  new Field({
    id: 'field-1',
    name: 'Field 1',
    fieldType: FieldType.STRING,
    extractorId: 'extractor-1',
    multiplicity: 'single',
    query: new Query(),
  }),
]

const mockInitialFields = [
  new Field({
    id: 'field-1',
    name: 'Original Field 1',
    fieldType: FieldType.STRING,
    extractorId: 'extractor-1',
    multiplicity: 'single',
    query: new Query(),
  }),
]

const mockExtractors = [
  new Extractor({
    id: 'extractor-1',
    name: 'Extractor 1',
    model: 'openai/gpt-4',
    temperature: 0.7,
    topP: 0.9,
    groupingFactor: 1,
  }),
]

const mockInitialExtractors = [
  new Extractor({
    id: 'extractor-1',
    name: 'Original Extractor 1',
    model: 'openai/gpt-4',
    temperature: 0.7,
    topP: 0.9,
    groupingFactor: 1,
  }),
]

const mockExtractorIdMapping = {
  'extractor-1': 'mapped-extractor-1',
}

beforeEach(() => {
  jest.clearAllMocks()
  mockManageExtractors.mockResolvedValue(mockExtractorIdMapping)
})

test('successfully creates document type when documentTypeId is not provided', async () => {
  jest.clearAllMocks()

  mockManageExtractors.mockResolvedValue(mockExtractorIdMapping)

  const documentTypeName = 'Test Document Type'

  const mockData = {
    documentTypeName,
    fields: mockFields,
    initialFields: mockInitialFields,
    extractors: mockExtractors,
    initialExtractors: mockInitialExtractors,
  }

  const { result } = renderHook(() => useManageDocumentType())

  await act(async () => {
    await result.current.manageDocumentType(mockData)
  })

  expect(mockCreateDocType).toHaveBeenCalledWith(documentTypeName)
  expect(mockManageExtractors).toHaveBeenCalledWith(
    expect.objectContaining({
      documentTypeId: mockDocumentTypeCode,
      documentTypeName,
      initialExtractors: mockInitialExtractors,
    }),
  )
  expect(mockManageFields).toHaveBeenCalledWith(
    expect.objectContaining({
      documentTypeId: mockDocumentTypeCode,
      initialFields: mockInitialFields,
      extractorIdMapping: mockExtractorIdMapping,
    }),
  )
})

test('successfully updates document type when documentTypeId is provided', async () => {
  jest.clearAllMocks()

  mockManageExtractors.mockResolvedValue(mockExtractorIdMapping)

  const existingDocumentTypeId = 'existing-doc-type-123'
  const documentTypeName = 'Test Document Type'

  const mockData = {
    documentTypeId: existingDocumentTypeId,
    documentTypeName,
    fields: mockFields,
    initialFields: mockInitialFields,
    extractors: mockExtractors,
    initialExtractors: mockInitialExtractors,
  }

  const { result } = renderHook(() => useManageDocumentType())

  await act(async () => {
    await result.current.manageDocumentType(mockData)
  })

  expect(mockCreateDocType).not.toHaveBeenCalled()
  expect(mockManageExtractors).toHaveBeenCalledWith(
    expect.objectContaining({
      documentTypeId: existingDocumentTypeId,
      documentTypeName,
      initialExtractors: mockInitialExtractors,
    }),
  )
  expect(mockManageFields).toHaveBeenCalledWith(
    expect.objectContaining({
      documentTypeId: existingDocumentTypeId,
      initialFields: mockInitialFields,
      extractorIdMapping: mockExtractorIdMapping,
    }),
  )
})

test('calls manageExtractors before manageFields', async () => {
  jest.clearAllMocks()

  const callOrderCodes = []
  const manageExtractorsCode = 'manageExtractors-123'
  const manageFieldsCode = 'manageFields-123'

  mockManageExtractors.mockImplementation(async () => {
    callOrderCodes.push(manageExtractorsCode)
    return mockExtractorIdMapping
  })

  mockManageFields.mockImplementation(async () => {
    callOrderCodes.push(manageFieldsCode)
  })

  const mockData = {
    documentTypeId: mockDocumentTypeCode,
    documentTypeName: 'Test Document Type',
    fields: mockFields,
    initialFields: mockInitialFields,
    extractors: mockExtractors,
    initialExtractors: mockInitialExtractors,
  }

  const { result } = renderHook(() => useManageDocumentType())

  await act(async () => {
    await result.current.manageDocumentType(mockData)
  })

  expect(callOrderCodes).toEqual([
    manageExtractorsCode,
    manageFieldsCode,
  ])
})

test('shows success notification after completion', async () => {
  jest.clearAllMocks()

  const { result } = renderHook(() => useManageDocumentType())

  const mockData = {
    documentTypeId: mockDocumentTypeCode,
    documentTypeName: 'Test Document Type',
    fields: mockFields,
    initialFields: mockInitialFields,
    extractors: mockExtractors,
    initialExtractors: mockInitialExtractors,
  }

  await act(async () => {
    await result.current.manageDocumentType(mockData)
  })

  expect(mockNotification.notifySuccess).toHaveBeenCalledWith(
    localize(Localization.DOCUMENT_TYPE_COMMIT_SUCCESS_MESSAGE),
  )
})

test('sets isManaging to false after completion', async () => {
  jest.clearAllMocks()

  const { result } = renderHook(() => useManageDocumentType())

  const mockData = {
    documentTypeId: mockDocumentTypeCode,
    documentTypeName: 'Test Document Type',
    fields: mockFields,
    initialFields: mockInitialFields,
    extractors: mockExtractors,
    initialExtractors: mockInitialExtractors,
  }

  expect(result.current.isManaging).toBe(false)

  await act(async () => {
    await result.current.manageDocumentType(mockData)
  })

  expect(result.current.isManaging).toBe(false)
})

test('shows error notification when manageExtractors fails', async () => {
  jest.clearAllMocks()

  const mockData = {
    documentTypeId: mockDocumentTypeCode,
    documentTypeName: 'Test Document Type',
    fields: mockFields,
    initialFields: mockInitialFields,
    extractors: mockExtractors,
    initialExtractors: mockInitialExtractors,
  }

  mockManageExtractors.mockRejectedValueOnce(new Error('API Error'))

  const { result } = renderHook(() => useManageDocumentType())

  await act(async () => {
    await result.current.manageDocumentType(mockData)
  })

  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(localize(Localization.DOCUMENT_TYPE_COMMIT_ERROR_MESSAGE))
})

test('does not call manageFields when manageExtractors fails', async () => {
  jest.clearAllMocks()

  mockManageExtractors.mockRejectedValueOnce(new Error('API Error'))

  const mockData = {
    documentTypeId: mockDocumentTypeCode,
    documentTypeName: 'Test Document Type',
    fields: mockFields,
    initialFields: mockInitialFields,
    extractors: mockExtractors,
    initialExtractors: mockInitialExtractors,
  }

  const { result } = renderHook(() => useManageDocumentType())

  await act(async () => {
    await result.current.manageDocumentType(mockData)
  })

  expect(mockManageFields).not.toHaveBeenCalled()
})

test('assigns order to fields based on array position', async () => {
  jest.clearAllMocks()

  const mockFieldsWithQueries = [
    new Field({
      id: 'field-1',
      name: 'First Field',
      fieldType: FieldType.STRING,
      extractorId: 'extractor-1',
      multiplicity: 'single',
      query: new Query({
        nodes: [{ id: 'node-1' }],
      }),
    }),
    new Field({
      id: 'field-2',
      name: 'Second Field',
      fieldType: FieldType.STRING,
      extractorId: 'extractor-1',
      multiplicity: 'single',
      query: new Query({
        nodes: [{ id: 'node-2' }],
      }),
    }),
    new Field({
      id: 'field-3',
      name: 'Third Field',
      fieldType: FieldType.STRING,
      extractorId: 'extractor-1',
      multiplicity: 'single',
      query: new Query({
        nodes: [{ id: 'node-3' }],
      }),
    }),
  ]

  const mockData = {
    documentTypeId: mockDocumentTypeCode,
    documentTypeName: 'Test Document Type',
    fields: mockFieldsWithQueries,
    initialFields: [],
    extractors: mockExtractors,
    initialExtractors: [],
  }

  const { result } = renderHook(() => useManageDocumentType())

  await act(async () => {
    await result.current.manageDocumentType(mockData)
  })

  const manageFieldsCall = mockManageFields.mock.calls[0][0]
  const categorizedFields = manageFieldsCall.categorizedFields

  const allFields = [
    ...categorizedFields.created,
    ...categorizedFields.updated,
    ...categorizedFields.untouched,
  ]

  expect(allFields[0].order).toBe(0)
  expect(allFields[1].order).toBe(1)
  expect(allFields[2].order).toBe(2)
})

test('filters out fields without query nodes', async () => {
  jest.clearAllMocks()

  const mockFieldsWithAndWithoutQueries = [
    new Field({
      id: 'field-1',
      name: 'Field With Query',
      fieldType: FieldType.STRING,
      extractorId: 'extractor-1',
      multiplicity: 'single',
      query: new Query({
        nodes: [{ id: 'node-1' }],
      }),
    }),
    new Field({
      id: 'field-2',
      name: 'Field Without Query',
      fieldType: FieldType.STRING,
      extractorId: 'extractor-1',
      multiplicity: 'single',
      query: new Query({
        nodes: [],
      }),
    }),
    new Field({
      id: 'field-3',
      name: 'Another Field With Query',
      fieldType: FieldType.STRING,
      extractorId: 'extractor-1',
      multiplicity: 'single',
      query: new Query({
        nodes: [{ id: 'node-3' }],
      }),
    }),
  ]

  const mockData = {
    documentTypeId: mockDocumentTypeCode,
    documentTypeName: 'Test Document Type',
    fields: mockFieldsWithAndWithoutQueries,
    initialFields: [],
    extractors: mockExtractors,
    initialExtractors: [],
  }

  const { result } = renderHook(() => useManageDocumentType())

  await act(async () => {
    await result.current.manageDocumentType(mockData)
  })

  const manageFieldsCall = mockManageFields.mock.calls[0][0]
  const categorizedFields = manageFieldsCall.categorizedFields

  const allFields = [
    ...categorizedFields.created,
    ...categorizedFields.updated,
    ...categorizedFields.untouched,
  ]

  expect(allFields).toHaveLength(2)
  expect(allFields.find((f) => f.id === 'field-2')).toBeUndefined()
})
