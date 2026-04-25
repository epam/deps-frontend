
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { renderHook } from '@testing-library/react-hooks'
import { useManageFields } from './useManageFields'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('./useCreateFields', () => ({
  useCreateFields: jest.fn(() => ({
    createFields: mockCreateFields,
  })),
}))

jest.mock('./useUpdateFields', () => ({
  useUpdateFields: jest.fn(() => ({
    updateFields: mockUpdateFields,
  })),
}))

const mockCreateFields = jest.fn(() => Promise.resolve())
const mockUpdateFields = jest.fn(() => Promise.resolve())
const mockDocumentTypeCode = 'doc-type-123'

const mockCreatedFields = [
  {
    id: 'new-field-1',
    name: 'New Field 1',
    extractorId: 'extractor-1',
  },
  {
    id: 'new-field-2',
    name: 'New Field 2',
    extractorId: 'extractor-2',
  },
]

const mockUpdatedFields = [
  {
    code: 'field-code-1',
    name: 'Updated Field 1',
    extractorId: 'extractor-1',
  },
]

const mockDeletedFields = [
  {
    code: 'field-code-2',
    name: 'Deleted Field',
  },
]

const mockInitialFields = [
  {
    code: 'field-code-1',
    name: 'Field 1',
  },
  {
    code: 'field-code-2',
    name: 'Field 2',
  },
]

const mockExtractorIdMapping = {
  'extractor-1': 'mapped-extractor-1',
  'extractor-2': 'mapped-extractor-2',
}

const mockManageFields = {
  documentTypeId: mockDocumentTypeCode,
  categorizedFields: {
    created: mockCreatedFields,
    updated: mockUpdatedFields,
    deleted: mockDeletedFields,
  },
  initialFields: mockInitialFields,
  extractorIdMapping: mockExtractorIdMapping,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('calls all operations when all categories have items', async () => {
  const { result } = renderHook(() => useManageFields())

  await result.current.manageFields(mockManageFields)

  expect(mockCreateFields).toHaveBeenCalledWith(
    mockDocumentTypeCode,
    [
      {
        ...mockCreatedFields[0],
        extractorId: mockExtractorIdMapping[mockCreatedFields[0].extractorId],
      },
      {
        ...mockCreatedFields[1],
        extractorId: mockExtractorIdMapping[mockCreatedFields[1].extractorId],
      },
    ],
  )
  expect(mockUpdateFields).toHaveBeenCalledWith(
    mockDocumentTypeCode,
    [
      {
        ...mockUpdatedFields[0],
        extractorId: mockExtractorIdMapping[mockUpdatedFields[0].extractorId],
      },
    ],
    mockInitialFields,
  )
})

test('does not call any operations when only deleted fields exist', async () => {
  const { result } = renderHook(() => useManageFields())

  await result.current.manageFields({
    ...mockManageFields,
    categorizedFields: {
      ...mockManageFields.categorizedFields,
      updated: [],
      created: [],
    },
  })

  expect(mockCreateFields).not.toHaveBeenCalled()
  expect(mockUpdateFields).not.toHaveBeenCalled()
})

test('only calls create when only created fields exist', async () => {
  const { result } = renderHook(() => useManageFields())

  await result.current.manageFields({
    ...mockManageFields,
    categorizedFields: {
      ...mockManageFields.categorizedFields,
      updated: [],
      deleted: [],
    },
  })

  expect(mockCreateFields).toHaveBeenCalledTimes(1)
  expect(mockUpdateFields).not.toHaveBeenCalled()
})

test('only calls update when only updated fields exist', async () => {
  const { result } = renderHook(() => useManageFields())

  await result.current.manageFields({
    ...mockManageFields,
    categorizedFields: {
      ...mockManageFields.categorizedFields,
      created: [],
      deleted: [],
    },
  })

  expect(mockCreateFields).not.toHaveBeenCalled()
  expect(mockUpdateFields).toHaveBeenCalledTimes(1)
})

test('propagates errors from manageFields operation', async () => {
  const mockError = new Error('Create failed')
  mockCreateFields.mockRejectedValueOnce(mockError)

  const { result } = renderHook(() => useManageFields())

  await expect(
    result.current.manageFields({
      documentTypeId: mockDocumentTypeCode,
      categorizedFields: {
        created: mockCreatedFields,
        updated: [],
        deleted: [],
      },
      initialFields: mockInitialFields,
      extractorIdMapping: mockExtractorIdMapping,
    }),
  ).rejects.toThrow()
})
