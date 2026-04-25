
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { useManageExtractors } from './useManageExtractors'

jest.mock('@/utils/env', () => mockEnv)

const mockCreateExtractors = jest.fn(() => mockExtractorIdMapping)
const mockUpdateExtractors = jest.fn(() => Promise.resolve({}))

jest.mock('./useCreateExtractors', () => ({
  useCreateExtractors: jest.fn(() => ({
    createExtractors: mockCreateExtractors,
  })),
}))

jest.mock('./useUpdateExtractors', () => ({
  useUpdateExtractors: jest.fn(() => ({
    updateExtractors: mockUpdateExtractors,
  })),
}))

const mockDocumentTypeId = 'doc-type-123'

const mockCreatedExtractors = [
  {
    id: 'new-extractor-1',
    name: 'New Extractor 1',
  },
  {
    id: 'new-extractor-2',
    name: 'New Extractor 2',
  },
]

const mockUpdatedExtractors = [
  {
    id: 'extractor-1',
    name: 'Updated Extractor 1',
  },
]

const mockInitialExtractors = [
  {
    id: 'extractor-1',
    name: 'Extractor 1',
  },
  {
    id: 'extractor-2',
    name: 'Extractor 2',
  },
]

const mockExtractorIdMapping = {
  [mockInitialExtractors[0].id]: mockInitialExtractors[0].id,
  [mockInitialExtractors[1].id]: mockInitialExtractors[1].id,
  [mockCreatedExtractors[0].id]: 'mapped-extractor-1',
  [mockCreatedExtractors[1].id]: 'mapped-extractor-2',
}

const mockDocumentTypeName = 'Test Document Type'

test('calls all operations when all categories have items', async () => {
  jest.clearAllMocks()

  const { result } = renderHook(() => useManageExtractors())

  const extractorIdMapping = await result.current.manageExtractors({
    documentTypeId: mockDocumentTypeId,
    documentTypeName: mockDocumentTypeName,
    categorizedExtractors: {
      created: mockCreatedExtractors,
      updated: mockUpdatedExtractors,
    },
    initialExtractors: mockInitialExtractors,
  })

  expect(mockCreateExtractors).toHaveBeenCalledWith(mockDocumentTypeName, mockCreatedExtractors)
  expect(mockUpdateExtractors).toHaveBeenCalledWith(
    mockDocumentTypeId,
    mockUpdatedExtractors,
    mockInitialExtractors,
  )
  expect(extractorIdMapping).toEqual(mockExtractorIdMapping)
})

test('only calls create when only created extractors exist', async () => {
  jest.clearAllMocks()

  const { result } = renderHook(() => useManageExtractors())

  const extractorIdMapping = await result.current.manageExtractors({
    documentTypeId: mockDocumentTypeId,
    documentTypeName: mockDocumentTypeName,
    categorizedExtractors: {
      created: mockCreatedExtractors,
      updated: [],
    },
    initialExtractors: mockInitialExtractors,
  })

  expect(mockCreateExtractors).toHaveBeenCalledTimes(1)
  expect(mockUpdateExtractors).not.toHaveBeenCalled()
  expect(extractorIdMapping).toEqual(mockExtractorIdMapping)
})

test('only calls update when only updated extractors exist', async () => {
  jest.clearAllMocks()

  const { result } = renderHook(() => useManageExtractors())

  const extractorIdMapping = await result.current.manageExtractors({
    documentTypeId: mockDocumentTypeId,
    documentTypeName: 'Test Document Type',
    categorizedExtractors: {
      created: [],
      updated: mockUpdatedExtractors,
    },
    initialExtractors: mockInitialExtractors,
  })

  expect(mockCreateExtractors).not.toHaveBeenCalled()
  expect(mockUpdateExtractors).toHaveBeenCalledTimes(1)
  expect(extractorIdMapping).toEqual({
    [mockInitialExtractors[0].id]: mockInitialExtractors[0].id,
    [mockInitialExtractors[1].id]: mockInitialExtractors[1].id,
  })
})

test('does not call any operations when all categories are empty', async () => {
  jest.clearAllMocks()

  const { result } = renderHook(() => useManageExtractors())

  const extractorIdMapping = await result.current.manageExtractors({
    documentTypeId: mockDocumentTypeId,
    documentTypeName: mockDocumentTypeName,
    categorizedExtractors: {
      created: [],
      updated: [],
    },
    initialExtractors: mockInitialExtractors,
  })

  expect(mockCreateExtractors).not.toHaveBeenCalled()
  expect(mockUpdateExtractors).not.toHaveBeenCalled()
  expect(extractorIdMapping).toEqual({
    [mockInitialExtractors[0].id]: mockInitialExtractors[0].id,
    [mockInitialExtractors[1].id]: mockInitialExtractors[1].id,
  })
})

test('propagates errors from create operation', async () => {
  jest.clearAllMocks()

  const mockError = new Error('Create failed')
  mockCreateExtractors.mockRejectedValue(mockError)

  const { result } = renderHook(() => useManageExtractors())

  await expect(
    result.current.manageExtractors({
      documentTypeId: mockDocumentTypeId,
      documentTypeName: mockDocumentTypeName,
      categorizedExtractors: {
        created: mockCreatedExtractors,
        updated: [],
      },
      initialExtractors: mockInitialExtractors,
    }),
  ).rejects.toThrow()
})

test('propagates errors from update operation', async () => {
  jest.clearAllMocks()

  const mockError = new Error('Update failed')
  mockUpdateExtractors.mockRejectedValue(mockError)

  const { result } = renderHook(() => useManageExtractors())

  await expect(
    result.current.manageExtractors({
      documentTypeId: mockDocumentTypeId,
      documentTypeName: mockDocumentTypeName,
      categorizedExtractors: {
        created: [],
        updated: mockUpdatedExtractors,
      },
      initialExtractors: mockInitialExtractors,
    }),
  ).rejects.toThrow()
})
