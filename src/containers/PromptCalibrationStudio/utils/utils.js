
import { Modal } from '@/components/Modal'
import { Localization, localize } from '@/localization/i18n'

export const confirmHandler = (cb, condition, title) => {
  if (condition) {
    Modal.confirm({
      title,
      onOk: cb,
    })

    return
  }

  cb()
}

export const getTooltipConfig = (text) => ({
  title: text,
})

export const getActiveFieldIndex = (fields, activeField) => fields.findIndex((field) => field.id === activeField.id)

export const sendBatchRequests = async (requests, batchCount) => {
  const promiseToUploadCallbacks = requests.reduce((acc, request, index) => {
    const chunkIndex = Math.floor(index / batchCount)

    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []
    }

    acc[chunkIndex].push(request)

    return acc
  }, [])

  for await (const uploadChunk of promiseToUploadCallbacks) {
    await Promise.all(uploadChunk.map((upload) => upload()))
  }
}

export const parsePageSpanToContent = (pageSpan) => {
  if (!pageSpan) {
    return localize(Localization.ALL_PAGES)
  }

  return `${pageSpan.start} - ${pageSpan.end}`
}
