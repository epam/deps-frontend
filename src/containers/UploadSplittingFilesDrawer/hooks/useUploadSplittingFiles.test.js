
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { waitFor } from '@testing-library/dom'
import { act, renderHook } from '@testing-library/react-hooks'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { useUploadSplittingFiles } from './useUploadSplittingFiles'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/batchesApi', () => ({
  useUploadFileMutation: jest.fn(() => [mockUploadFileToStorage]),
}))

jest.mock('@/utils/notification', () => mockNotification)

const mockUploadFileToStorage = jest.fn(() => ({
  unwrap: () => ({
    path: 'some/path',
  }),
}))

test('returns correct values', async () => {
  const { result } = renderHook(() => useUploadSplittingFiles())

  await waitFor(() => {
    expect(result.current).toEqual(
      {
        uploadSplittingFiles: expect.any(Function),
        completedRequests: 0,
        resetRequestsCounter: expect.any(Function),
      },
    )
  })
})

test('calls uploadFile with correct args when call uploadSplittingFiles', async () => {
  const { result } = renderHook(() => useUploadSplittingFiles())

  const mockFiles = [
    {
      file: {
        name: 'file1',
        uid: 'uid1',
      },
      documentTypeId: null,
    },
    {
      file: {
        name: 'file2',
        uid: 'uid2',
      },
      documentTypeId: null,
    },
  ]

  await act(async () => {
    await result.current.uploadSplittingFiles(mockFiles)
  })

  mockFiles.forEach(({ file }, index) => {
    expect(mockUploadFileToStorage).nthCalledWith(index + 1, file)
  })
})

test('returns correct data from uploadSplittingFiles', async () => {
  const { result } = renderHook(() => useUploadSplittingFiles())

  const mockFiles = [
    {
      file: {
        name: 'file1',
        uid: 'uid1',
      },
      documentTypeId: null,
    },
    {
      file: {
        name: 'file2',
        uid: 'uid2',
      },
      documentTypeId: null,
    },
  ]

  let data

  await act(async () => {
    data = await result.current.uploadSplittingFiles(mockFiles)
  })

  expect(data).toEqual(
    [
      {
        name: mockFiles[0].file.name,
        documentTypeId: null,
        path: 'some/path',
      },
      {
        name: mockFiles[1].file.name,
        documentTypeId: null,
        path: 'some/path',
      },
    ],
  )
})

test('calls notifyWarning with expected message in case upload file error', async () => {
  jest.clearAllMocks()

  const mockError = new Error('')

  mockUploadFileToStorage.mockImplementation(() => ({
    unwrap: () => Promise.reject(mockError),
  }))

  const files = [
    {
      file: {
        prop: 'someValue',
        name: 'file1',
      },
      documentTypeId: null,
    },
  ]

  const { result } = renderHook(() => useUploadSplittingFiles())

  const { uploadSplittingFiles } = result.current

  await act(async () => {
    await uploadSplittingFiles(files)
  })

  expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
})
