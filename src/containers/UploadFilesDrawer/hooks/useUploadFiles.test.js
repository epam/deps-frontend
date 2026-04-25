
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { DefaultFormValues, FIELD_FORM_CODE } from '../constants'
import { useUploadFiles } from './useUploadFiles'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/filesApi', () => ({
  useUploadRawFileMutation: jest.fn(() => [mockUploadFileToStorage]),
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn((val) => [val, jest.fn()]),
}))

jest.mock('@/utils/notification', () => mockNotification)

const mockUploadFileToStorage = jest.fn(() => ({
  unwrap: () => ({
    path: 'some/path',
  }),
}))

test('returns correct values', async () => {
  const { result } = renderHook(() => useUploadFiles())

  await waitFor(() => {
    expect(result.current).toEqual({
      uploadFiles: expect.any(Function),
      areFilesUploading: false,
      completedRequests: 0,
    })
  })
})

test('calls uploadFileToStorage with correct args when call uploadFiles', async () => {
  const { result } = renderHook(() => useUploadFiles())

  const mockFiles = [
    {
      name: 'file1',
      uid: 'uid1',
    }, {
      name: 'file2',
      uid: 'file2',
    },
  ]

  const fileData = {
    [FIELD_FORM_CODE.FILES]: mockFiles,
    [FIELD_FORM_CODE.LABELS]: [],
    [FIELD_FORM_CODE.PARSING_FEATURES]: [KnownParsingFeature.TEXT],
    [FIELD_FORM_CODE.ENGINE]: null,
  }

  const { uploadFiles } = result.current

  await uploadFiles(fileData)

  expect(mockUploadFileToStorage).toHaveBeenNthCalledWith(1, {
    ...DefaultFormValues,
    file: mockFiles[0],
  })

  expect(mockUploadFileToStorage).toHaveBeenNthCalledWith(2, {
    ...DefaultFormValues,
    file: mockFiles[1],
  })
})

test('shows success notification when files were uploaded successfully', async () => {
  jest.clearAllMocks()

  const { result } = renderHook(() => useUploadFiles())

  const mockFiles = [
    {
      name: 'file1',
      uid: 'uid1',
    }, {
      name: 'file2',
      uid: 'file2',
    },
  ]

  const fileData = {
    [FIELD_FORM_CODE.FILES]: mockFiles,
    [FIELD_FORM_CODE.LABELS]: [],
    [FIELD_FORM_CODE.PARSING_FEATURES]: [KnownParsingFeature.TEXT],
    [FIELD_FORM_CODE.ENGINE]: null,
  }

  const { uploadFiles } = result.current

  await uploadFiles(fileData)

  expect(notifySuccess).nthCalledWith(1, localize(Localization.FILES_WERE_UPLOADED))
})

test('shows warning notification when files upload fails', async () => {
  jest.clearAllMocks()

  const mockError = new Error('')

  mockUploadFileToStorage.mockImplementation(() => ({
    unwrap: () => Promise.reject(mockError),
  }))

  const { result } = renderHook(() => useUploadFiles())

  const mockFiles = [
    {
      name: 'file1',
      uid: 'uid1',
    }, {
      name: 'file2',
      uid: 'file2',
    },
  ]

  const fileData = {
    [FIELD_FORM_CODE.FILES]: mockFiles,
    [FIELD_FORM_CODE.LABELS]: [],
    [FIELD_FORM_CODE.PARSING_FEATURES]: [KnownParsingFeature.TEXT],
    [FIELD_FORM_CODE.ENGINE]: null,
  }

  const { uploadFiles } = result.current

  await uploadFiles(fileData)

  expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
})
