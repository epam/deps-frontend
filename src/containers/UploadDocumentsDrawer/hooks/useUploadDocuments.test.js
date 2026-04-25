
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { createDocument } from '@/api/documentsApi'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { DefaultFormValues, FIELD_FORM_CODE } from '../constants'
import { useUploadDocuments } from './useUploadDocuments'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/api/documentsApi', () => ({
  createDocument: jest.fn(),
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn((val) => [val, jest.fn()]),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useClassifyFileMutation: jest.fn(() => [mockClassifyFile]),
}))

jest.mock('@/utils/notification', () => mockNotification)

const mockClassifyFile = jest.fn(() => ({
  unwrap: () => ({
    path: 'some/path',
  }),
}))

const { shouldClassify, ...FormValues } = DefaultFormValues

const mockDocumentTypeId = 'mock-document-type-id'

const formValuesWithDocumentType = {
  ...FormValues,
  documentType: mockDocumentTypeId,
}

test('returns correct values', async () => {
  const { result } = renderHook(() => useUploadDocuments())

  await waitFor(() => {
    expect(result.current).toEqual({
      uploadDocuments: expect.any(Function),
      areDocumentsUploading: false,
      completedRequests: 0,
    })
  })
})

test('calls createDocument with correct args when call uploadDocuments', async () => {
  const { result } = renderHook(() => useUploadDocuments())

  const mockFiles = [
    {
      name: 'file1',
      uid: 'uid1',
    }, {
      name: 'file2',
      uid: 'file2',
    },
  ]

  const documentData = {
    [FIELD_FORM_CODE.FILES]: mockFiles,
    ...formValuesWithDocumentType,
  }

  const { uploadDocuments } = result.current

  await uploadDocuments(documentData)

  const expectedDocumentData = (file) => ({
    ...formValuesWithDocumentType,
    documentTypeId: formValuesWithDocumentType.documentType?._id,
    labelIds: formValuesWithDocumentType.labels.map((l) => l._id),
    documentName: file.name,
  })

  expect(createDocument).toHaveBeenNthCalledWith(
    1,
    mockFiles[0],
    expectedDocumentData(mockFiles[0]),
    null,
    expect.any(Function),
  )
  expect(createDocument).toHaveBeenNthCalledWith(
    2,
    mockFiles[1],
    expectedDocumentData(mockFiles[1]),
    null,
    expect.any(Function),
  )
})

test('calls classifyFile with correct args when call uploadDocuments if shouldClassify is true', async () => {
  const { result } = renderHook(() => useUploadDocuments())

  const mockFiles = [
    {
      name: 'file1',
      uid: 'uid1',
    }, {
      name: 'file2',
      uid: 'file2',
    },
  ]

  const { uploadDocuments } = result.current

  await uploadDocuments({
    [FIELD_FORM_CODE.FILES]: mockFiles,
    ...FormValues,
    shouldClassify: true,
  })

  expect(mockClassifyFile).toHaveBeenNthCalledWith(1, {
    ...FormValues,
    file: mockFiles[0],
  })

  expect(mockClassifyFile).toHaveBeenNthCalledWith(2, {
    ...FormValues,
    file: mockFiles[1],
  })
})

test('shows success notification when documents were uploaded successfully', async () => {
  jest.clearAllMocks()

  const { result } = renderHook(() => useUploadDocuments())

  const mockFiles = [
    {
      name: 'file1',
      uid: 'uid1',
    }, {
      name: 'file2',
      uid: 'file2',
    },
  ]

  const documentData = {
    [FIELD_FORM_CODE.FILES]: mockFiles,
    ...formValuesWithDocumentType,
  }

  const { uploadDocuments } = result.current

  await uploadDocuments(documentData)

  expect(notifySuccess).nthCalledWith(1, localize(Localization.DOCUMENTS_WERE_UPLOADED))
})

test('shows warning notification when documents upload fails', async () => {
  jest.clearAllMocks()

  const mockError = new Error('')

  createDocument.mockRejectedValueOnce(mockError)

  const { result } = renderHook(() => useUploadDocuments())

  const mockFiles = [
    {
      name: 'file1',
      uid: 'uid1',
    }, {
      name: 'file2',
      uid: 'file2',
    },
  ]

  const documentData = {
    [FIELD_FORM_CODE.FILES]: mockFiles,
    ...formValuesWithDocumentType,
  }

  const { uploadDocuments } = result.current

  await uploadDocuments(documentData)

  expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
})
