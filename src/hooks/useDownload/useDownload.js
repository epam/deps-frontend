
import { useState } from 'react'
import { ResponseType } from '@/enums/ResponseType'
import { StatusCode } from '@/enums/StatusCode'
import { Localization, localize } from '@/localization/i18n'
import { apiRequest } from '@/utils/apiRequest'
import { notifyWarning } from '@/utils/notification'

const RequestConfig = {
  responseType: ResponseType.BLOB,
}

const useDownload = () => {
  const [isLoading, setIsLoading] = useState(false)

  const downloadOutput = async (apiUrl, fileName) => {
    try {
      setIsLoading(true)
      const blob = await apiRequest.get(apiUrl, RequestConfig)
      const href = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.download = fileName
      link.href = href
      link.click()
      link.remove()

      URL.revokeObjectURL(href)
    } catch (e) {
      if (e.response?.status === StatusCode.NOT_FOUND) {
        notifyWarning(localize(Localization.DOWNLOAD_FAILURE_404))
      } else {
        notifyWarning(localize(Localization.DOWNLOAD_FAILURE))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    downloadOutput,
  }
}

export {
  useDownload,
}
