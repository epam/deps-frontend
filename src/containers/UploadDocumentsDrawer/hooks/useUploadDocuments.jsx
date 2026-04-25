
import { useCallback, useState } from 'react'
import { createDocument } from '@/api/documentsApi'
import { useClassifyFileMutation } from '@/apiRTK/filesApi'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const BULK_REQUESTS_LIMIT = 3

const onError = (e) => {
  throw e
}

export const useUploadDocuments = () => {
  const [areDocumentsUploading, setAreDocumentsUploading] = useState(false)
  const [completedRequests, setCompletedRequests] = useState(0)

  const [classifyFile] = useClassifyFileMutation()

  const classifyCallback = useCallback(async (file, formData) => {
    await classifyFile({
      file,
      ...formData,
    }).unwrap()

    setCompletedRequests((prev) => prev + 1)
  }, [classifyFile])

  const createDocumentCallback = useCallback(async (file, formData) => {
    const documentData = {
      ...formData,
      documentTypeId: formData.documentType._id,
      labelIds: formData.labels.map((l) => l._id),
      documentName: file.name,
    }

    await createDocument(
      file,
      documentData,
      null,
      onError,
    )

    setCompletedRequests((prev) => prev + 1)
  }, [])

  const uploadDocuments = useCallback(async ({
    files,
    shouldClassify,
    ...rest
  }) => {
    try {
      setAreDocumentsUploading(true)

      const promiseToUploadCallbacks = files.reduce((acc, file, index) => {
        const chunkIndex = Math.floor(index / BULK_REQUESTS_LIMIT)

        if (!acc[chunkIndex]) {
          acc[chunkIndex] = []
        }

        if (shouldClassify) {
          acc[chunkIndex].push(() => classifyCallback(file, rest))

          return acc
        }

        acc[chunkIndex].push(() => createDocumentCallback(file, rest))

        return acc
      }, [])

      for await (const uploadChunk of promiseToUploadCallbacks) {
        await Promise.all(uploadChunk.map((upload) => upload()))
      }

      notifySuccess(localize(Localization.DOCUMENTS_WERE_UPLOADED))
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    } finally {
      setAreDocumentsUploading(false)
      setCompletedRequests(0)
    }
  }, [classifyCallback, createDocumentCallback])

  return {
    uploadDocuments,
    areDocumentsUploading,
    completedRequests,
  }
}
