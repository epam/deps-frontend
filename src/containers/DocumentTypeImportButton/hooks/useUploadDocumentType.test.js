
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { act, renderHook } from '@testing-library/react-hooks'
import { documentTypesApi } from '@/api/documentTypesApi'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { ExtractionType, RESOURCE_EXTRACTION_TYPE } from '@/enums/ExtractionType'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { mockDocumentTypeData } from '../__mocks__/mockDocumentTypeData'
import { CREATE_DOCUMENT_TYPE_REQUEST_COUNT, CREATE_GEN_AI_FIELD_REQUESTS_COUNT } from '../constants'
import { useCreateLLMExtractors } from './useCreateLLMExtractors'
import { useUploadDocumentType } from './useUploadDocumentType'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/api/documentTypesApi', () => ({
  documentTypesApi: {
    fetchDocumentTypes: jest.fn(() => Promise.resolve(mockFetchDocumentTypesResponse)),
  },
}))

jest.mock('./useCreateCrossFieldValidators', () => ({
  useCreateCrossFieldValidators: jest.fn(() => mockCreateCrossFieldValidatorsHookData),
}))

jest.mock('./useCreateDocumentType', () => ({
  useCreateDocumentType: jest.fn(() => mockCreateDocumentTypeHookData),
}))

jest.mock('./useCreateGenAIFields', () => ({
  useCreateGenAIFields: jest.fn(() => mockCreateGenAIFieldsHookData),
}))

jest.mock('./useCreateLLMExtractors', () => ({
  useCreateLLMExtractors: jest.fn(() => mockCreateLLMExtractorsHookData),
}))

const mockFetchDocumentTypesResponse = [
  { name: 'Doc Type 2' },
]

const mockCreateCrossFieldValidatorsHookData = {
  createCrossFieldValidators: jest.fn(),
}

const mockCreateDocumentTypeHookData = {
  CREATE_DOCUMENT_TYPE_REQUEST: {
    [ExtractionType.PROTOTYPE]: jest.fn(),
    [ExtractionType.AI_PROMPTED]: jest.fn(),
  },
}

const mockCreateGenAIFieldsHookData = {
  createGenAIFields: jest.fn(),
}

const mockCreateLLMExtractorsHookData = {
  createLLMExtractors: jest.fn(),
}
const defaultProps = {
  onAfterUpload: jest.fn(),
  onBeforeImport: jest.fn(),
}

const renderAndCallHook = async (props) => {
  const { result } = renderHook(() => useUploadDocumentType({ ...defaultProps }))
  const { onUpload } = result.current
  await act(async () => await onUpload(props))
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('hook returns correct values', () => {
  const { result } = renderHook(() => useUploadDocumentType({ ...defaultProps }))

  expect(result.current).toEqual({
    isValidatingDocumentTypeName: expect.any(Boolean),
    isUploading: expect.any(Boolean),
    onUpload: expect.any(Function),
    currentRequestsCount: expect.any(Number),
    totalRequestsCount: expect.any(Number),
  })
})

test('calls fetchDocumentTypes before document type uploading', async () => {
  await renderAndCallHook(mockDocumentTypeData)

  expect(documentTypesApi.fetchDocumentTypes).toHaveBeenCalled()
})

test('calls notifyWarning and does not proceed uploading if fetchDocumentTypes failed', async () => {
  documentTypesApi.fetchDocumentTypes.mockImplementationOnce(jest.fn(() => Promise.reject(new Error(''))))

  await renderAndCallHook(mockDocumentTypeData)

  expect(defaultProps.onBeforeImport).not.toHaveBeenCalled()
  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})

test('calls notifyWarning with correct message and does not proceed uploading if document type with passed name already exists', async () => {
  documentTypesApi.fetchDocumentTypes.mockImplementationOnce(() => Promise.resolve([
    ...mockFetchDocumentTypesResponse,
    { name: mockDocumentTypeData.name },
  ]))

  await renderAndCallHook(mockDocumentTypeData)

  expect(defaultProps.onBeforeImport).not.toHaveBeenCalled()
  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DOCUMENT_TYPE_DUPLICATE_NAME_NOTIFICATION),
  )
})

test('calls onBeforeImport before document type uploading', async () => {
  await renderAndCallHook(mockDocumentTypeData)

  expect(defaultProps.onBeforeImport).toHaveBeenCalled()
})

test('calls createDocumentType request for passed extraction type while document type uploading', async () => {
  await renderAndCallHook(mockDocumentTypeData)

  const { CREATE_DOCUMENT_TYPE_REQUEST } = mockCreateDocumentTypeHookData
  const createDocumentTypeRequest = CREATE_DOCUMENT_TYPE_REQUEST[mockDocumentTypeData.extractionType]

  expect(createDocumentTypeRequest).toHaveBeenCalled()
})

test('calls createLLMExtractors requests while document type uploading', async () => {
  await renderAndCallHook(mockDocumentTypeData)

  const { createLLMExtractors } = mockCreateLLMExtractorsHookData

  expect(createLLMExtractors).toHaveBeenCalled()
})

test('calls createGenAIFields requests while document type uploading', async () => {
  await renderAndCallHook(mockDocumentTypeData)

  const { createGenAIFields } = mockCreateGenAIFieldsHookData

  expect(createGenAIFields).toHaveBeenCalled()
})

test('calls createCrossFieldValidators requests while document type uploading', async () => {
  await renderAndCallHook(mockDocumentTypeData)

  const { createCrossFieldValidators } = mockCreateCrossFieldValidatorsHookData

  expect(createCrossFieldValidators).toHaveBeenCalled()
})

test('calls notifySuccess on successful document type uploading', async () => {
  await renderAndCallHook(mockDocumentTypeData)

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.DOCUMENT_TYPE_IMPORT_SUCCESS),
  )
})

test('calls notifyWarning with correct message and does not proceed uploading if passed extraction type is incorrect', async () => {
  const documentTypeData = {
    ...mockDocumentTypeData,
    extractionType: ExtractionType.TEMPLATE,
  }

  await renderAndCallHook(documentTypeData)

  expect(defaultProps.onBeforeImport).not.toHaveBeenCalled()
  expect(notifyWarning).nthCalledWith(
    1,
    localize(
      Localization.EXTRACTION_TYPE_UNSUPPORTED,
      { extractionType: RESOURCE_EXTRACTION_TYPE[documentTypeData.extractionType] },
    ),
  )
})

test('calls notifyWarning with correct message if document type uploading failed with known error code', async () => {
  const errorCode = ErrorCode.alreadyExistsError
  const mockError = {
    data: {
      code: errorCode,
    },
  }

  useCreateLLMExtractors.mockImplementationOnce(() => ({
    createLLMExtractors: jest.fn(() => Promise.reject(mockError)),
  }))

  await renderAndCallHook(mockDocumentTypeData)

  expect(notifyWarning).nthCalledWith(
    1,
    RESOURCE_ERROR_TO_DISPLAY[errorCode],
  )
})

test('calls notifyWarning with default message if document type uploading failed with unknown error code', async () => {
  const mockUnknownError = new Error('')

  useCreateLLMExtractors.mockImplementationOnce(() => ({
    createLLMExtractors: jest.fn(() => Promise.reject(mockUnknownError)),
  }))

  await renderAndCallHook(mockDocumentTypeData)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})

test('calls onAfterUpload after document type uploading finish', async () => {
  await renderAndCallHook(mockDocumentTypeData)

  expect(defaultProps.onAfterUpload).toHaveBeenCalled()
})

test('returns correct current and total request counts if upload document type was called', async () => {
  useCreateLLMExtractors.mockImplementationOnce(({ increaseRequestCount }) => ({
    createLLMExtractors: jest.fn(() => {
      increaseRequestCount(increaseCount)
    }),
  }))

  const increaseCount = 4
  const { crossFieldValidators, genAIFields, llmExtractors } = mockDocumentTypeData

  const totalCount = llmExtractors.length +
    genAIFields.length * CREATE_GEN_AI_FIELD_REQUESTS_COUNT +
    crossFieldValidators.length +
    CREATE_DOCUMENT_TYPE_REQUEST_COUNT

  const { result } = renderHook(() => useUploadDocumentType({ ...defaultProps }))
  await act(async () => await result.current.onUpload(mockDocumentTypeData))

  expect(result.current.currentRequestsCount).toEqual(increaseCount)
  expect(result.current.totalRequestsCount).toEqual(totalCount)
})
