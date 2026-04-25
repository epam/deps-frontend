
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { waitFor } from '@testing-library/dom'
import { act, renderHook } from '@testing-library/react-hooks'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { useUploadBatchFiles } from './useUploadBatchFiles'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

const mockUploadFileToStorage = jest.fn(() => ({
  unwrap: () => ({
    path: 'some/path',
  }),
}))

jest.mock('@/apiRTK/batchesApi', () => ({
  useUploadFileMutation: jest.fn(() => [mockUploadFileToStorage, { isLoading: false }]),
}))

test('returns correct values', () => {
  const { result } = renderHook(() => useUploadBatchFiles())

  expect(result.current).toEqual({
    uploadFiles: expect.any(Function),
    completedRequests: 0,
    resetRequestsCounter: expect.any(Function),
  })
})

test('returns correct data from uploadFiles', async () => {
  const { result } = renderHook(() => useUploadBatchFiles())

  const files = [
    {
      file: {
        prop: 'someValue',
        name: 'file1',
      },
    }, {
      file: {
        prop: 'someValue',
        name: 'file2',
      },
    },
  ]

  const { uploadFiles } = result.current

  let data

  await act(async () => {
    data = await uploadFiles(files)
  })

  await waitFor(() => {
    expect(data).toEqual(
      [
        {
          file: {
            name: 'file1',
            prop: 'someValue',
          },
          name: 'file1',
          path: 'some/path',
        },
        {
          file: {
            name: 'file2',
            prop: 'someValue',
          },
          name: 'file2',
          path: 'some/path',
        },
      ],
    )
  })
})

test('calls notifyWarning with expected message in case create batch api error', async () => {
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
    },
  ]

  const { result } = renderHook(() => useUploadBatchFiles())

  const { uploadFiles } = result.current

  await act(async () => {
    await uploadFiles(files)
  })

  expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
})
