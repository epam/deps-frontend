
import { useCallback, useState } from 'react'
import { useUploadRawFileMutation } from '@/apiRTK/filesApi'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const BULK_REQUESTS_LIMIT = 3

export const useUploadFiles = () => {
  const [uploadFileToStorage] = useUploadRawFileMutation()
  const [areFilesUploading, setAreFilesUploading] = useState(false)
  const [completedRequests, setCompletedRequests] = useState(0)

  const uploadCallback = useCallback(async (file, formData) => {
    await uploadFileToStorage({
      file,
      ...formData,
    }).unwrap()

    setCompletedRequests((prev) => prev + 1)
  }, [uploadFileToStorage])

  const uploadFiles = useCallback(async ({ files, ...rest }) => {
    try {
      setAreFilesUploading(true)

      const promiseToUploadCallbacks = files.reduce((acc, file, index) => {
        const chunkIndex = Math.floor(index / BULK_REQUESTS_LIMIT)

        if (!acc[chunkIndex]) {
          acc[chunkIndex] = []
        }

        acc[chunkIndex].push(() => uploadCallback(file, rest))

        return acc
      }, [])

      for await (const uploadChunk of promiseToUploadCallbacks) {
        await Promise.all(uploadChunk.map((upload) => upload()))
      }

      notifySuccess(localize(Localization.FILES_WERE_UPLOADED))
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    } finally {
      setAreFilesUploading(false)
      setCompletedRequests(0)
    }
  }, [uploadCallback])

  return {
    uploadFiles,
    areFilesUploading,
    completedRequests,
  }
}
