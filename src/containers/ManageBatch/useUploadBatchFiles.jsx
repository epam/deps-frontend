
import { useCallback, useState } from 'react'
import { useUploadFileMutation } from '@/apiRTK/batchesApi'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'

const BULK_REQUESTS_LIMIT = 3

export const useUploadBatchFiles = () => {
  const [uploadFileToStorage] = useUploadFileMutation()

  const [completedRequests, setCompletedRequests] = useState(0)

  const resetRequestsCounter = useCallback(() => {
    setCompletedRequests(0)
  }, [])

  const uploadFile = useCallback(async (fileData) => {
    const { path } = await uploadFileToStorage(fileData.file).unwrap()

    setCompletedRequests((prev) => prev + 1)

    return {
      ...fileData,
      path,
      name: fileData.file.name,
    }
  }, [uploadFileToStorage])

  const uploadFiles = useCallback(async (files) => {
    try {
      const promiseToUploadCallbacks = files.reduce((acc, fileData, index) => {
        const chunkIndex = Math.floor(index / BULK_REQUESTS_LIMIT)
        if (!acc[chunkIndex]) {
          acc[chunkIndex] = []
        }
        acc[chunkIndex].push(() => uploadFile(fileData))
        return acc
      }, [])

      const allFilesWithPaths = []

      for await (const uploadChunk of promiseToUploadCallbacks) {
        const filesWithPaths = await Promise.all(uploadChunk.map((upload) => upload()))
        allFilesWithPaths.push(...filesWithPaths)
      }
      return allFilesWithPaths
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }, [uploadFile])

  return {
    uploadFiles,
    completedRequests,
    resetRequestsCounter,
  }
}
