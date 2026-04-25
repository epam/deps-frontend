
import { useCallback } from 'react'
import { useUploadFileMutation } from '@/apiRTK/batchesApi'

const BULK_REQUESTS_LIMIT = 3

export const useUploadFiles = () => {
  const [uploadFileToStorage] = useUploadFileMutation()

  const uploadFile = useCallback(async ({
    file,
    name,
    documentTypeId,
  }) => {
    const { path } = await uploadFileToStorage(file).unwrap()

    return {
      path,
      name,
      documentTypeId: documentTypeId ?? null,
      processingParams: {},
    }
  }, [uploadFileToStorage])

  const uploadFiles = useCallback(async (filesData) => {
    const promiseToUploadCallbacks = filesData.reduce((acc, fileData, index) => {
      const chunkIndex = Math.floor(index / BULK_REQUESTS_LIMIT)

      if (!acc[chunkIndex]) {
        acc[chunkIndex] = []
      }

      acc[chunkIndex].push(() => uploadFile(fileData))

      return acc
    }, [])

    const allFilesWithPaths = []

    for (const uploadChunk of promiseToUploadCallbacks) {
      const filesWithPaths = await Promise.all(uploadChunk.map((upload) => upload()))
      allFilesWithPaths.push(...filesWithPaths)
    }

    return allFilesWithPaths
  }, [uploadFile])

  return {
    uploadFiles,
  }
}
