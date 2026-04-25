
import { renderHook } from '@testing-library/react-hooks/dom'
import { useUploadFiles } from './useUploadFiles'

const mockUploadFileToStorage = jest.fn(() => ({
  unwrap: () => ({
    path: mockPath,
  }),
}))

jest.mock('@/apiRTK/batchesApi', () => ({
  useUploadFileMutation: jest.fn(() => [mockUploadFileToStorage, { isLoading: false }]),
}))

const mockPath = 'some/path'

const mockFileData = {
  file: 'mockFile',
  name: 'mockName',
  documentTypeId: 'documentTypeId',
}

test('returns correct values', async () => {
  const { result } = renderHook(() => useUploadFiles())

  expect(result.current).toEqual(
    {
      uploadFiles: expect.any(Function),
    },
  )
})

test('returns correct data from uploadFiles', async () => {
  const { result } = renderHook(() => useUploadFiles())

  const data = await result.current.uploadFiles([mockFileData])

  expect(data).toEqual(
    [
      {
        name: mockFileData.name,
        path: mockPath,
        processingParams: {},
        documentTypeId: mockFileData.documentTypeId,
      },
    ],
  )
})
