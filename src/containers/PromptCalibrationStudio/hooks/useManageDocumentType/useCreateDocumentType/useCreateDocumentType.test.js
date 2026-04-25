
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { renderHook } from '@testing-library/react-hooks'
import { createDocumentType } from '@/api/documentTypesApi'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { ExtractionType } from '@/enums/ExtractionType'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { useCreateDocumentType } from './useCreateDocumentType'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/api/documentTypesApi', () => ({
  createDocumentType: jest.fn(() => Promise.resolve({
    documentTypeId: mockDocumentTypeId,
  })),
}))

const mockDocumentTypeId = 'doc-type-123'
const mockDocumentTypeName = 'Test Document Type'

beforeEach(() => {
  jest.clearAllMocks()
})

test('creates document type and returns id and name', async () => {
  const { result } = renderHook(() => useCreateDocumentType())

  const response = await result.current.createDocType(mockDocumentTypeName)

  expect(createDocumentType).toHaveBeenCalledWith({
    name: mockDocumentTypeName,
    extractorType: ExtractionType.AI_PROMPTED,
  })
  expect(response).toEqual({
    documentTypeId: mockDocumentTypeId,
    documentTypeName: mockDocumentTypeName,
  })
})

test('shows error notification with specific error code message when API fails', async () => {
  jest.clearAllMocks()

  const mockErrorCode = 'DOCUMENT_TYPE_ALREADY_EXISTS'
  const mockErrorMessage = 'Document type already exists'

  const mockError = {
    data: {
      code: mockErrorCode,
    },
  }

  RESOURCE_ERROR_TO_DISPLAY[mockErrorCode] = mockErrorMessage

  createDocumentType.mockRejectedValueOnce(mockError)

  const { result } = renderHook(() => useCreateDocumentType())

  try {
    await result.current.createDocType(mockDocumentTypeName)
  } catch {
    expect(notifyWarning).toHaveBeenCalledWith(mockErrorMessage)
  }
})

test('shows default error message when error code is not in RESOURCE_ERROR_TO_DISPLAY', async () => {
  jest.clearAllMocks()

  const mockError = {
    data: {
      code: 'UNKNOWN_ERROR',
    },
  }

  createDocumentType.mockRejectedValueOnce(mockError)

  const { result } = renderHook(() => useCreateDocumentType())

  try {
    await result.current.createDocType(mockDocumentTypeName)
  } catch {
    expect(notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
  }
})

test('re-throws error after handling it', async () => {
  jest.clearAllMocks()

  const mockError = new Error('API Error')
  createDocumentType.mockRejectedValueOnce(mockError)

  const { result } = renderHook(() => useCreateDocumentType())

  await expect(result.current.createDocType(mockDocumentTypeName)).rejects.toThrow('API Error')
})
