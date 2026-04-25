import PropTypes from 'prop-types'
import { useCallback, useRef } from 'react'
import { ResponseType } from '@/enums/ResponseType'
import { StatusCode } from '@/enums/StatusCode'
import { localize, Localization } from '@/localization/i18n'
import { apiRequest } from '@/utils/apiRequest'
import { notifyWarning } from '@/utils/notification'
import { childrenShape } from '@/utils/propTypes'
import { Link } from './DownloadLink.styles'

const RequestConfig = {
  responseType: ResponseType.BLOB,
}

const DownloadLink = ({
  children,
  fileName,
  apiUrl,
  disabled,
  getBlob,
}) => {
  const linkRef = useRef()

  const download = useCallback(async () => {
    if (linkRef.current?.href || disabled) {
      return
    }

    try {
      let blob

      if (getBlob) {
        blob = await getBlob()
      } else {
        blob = await apiRequest.get(apiUrl, RequestConfig)
      }

      const href = URL.createObjectURL(blob)

      linkRef.current.href = href
      linkRef.current.click()
      linkRef.current.removeAttribute('href')

      URL.revokeObjectURL(href)
    } catch (e) {
      if (e.response?.status === StatusCode.NOT_FOUND) {
        notifyWarning(localize(Localization.DOWNLOAD_FAILURE_404))
      } else {
        notifyWarning(localize(Localization.DOWNLOAD_FAILURE))
      }
    }
  }, [apiUrl, disabled, getBlob])

  return (
    <Link
      ref={linkRef}
      disabled={disabled}
      download={fileName}
      onClick={download}
    >
      {children}
    </Link>
  )
}

DownloadLink.propTypes = {
  children: childrenShape,
  apiUrl: PropTypes.string,
  disabled: PropTypes.bool,
  fileName: PropTypes.string,
  getBlob: PropTypes.func,
}

export {
  DownloadLink,
}
