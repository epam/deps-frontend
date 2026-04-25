
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { localize, Localization } from '@/localization/i18n'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { apiRequest } from '@/utils/apiRequest'
import { notifyWarning } from '@/utils/notification'

const DownloadDropdownButton = ({
  documentId,
  documentTypeCode,
  documentName,
}) => {
  const customization = useSelector(customizationSelector)
  const user = useSelector(userSelector)

  const showErrorMessage = useCallback(() => {
    notifyWarning(localize(Localization.DOWNLOAD_FAILURE))
  }, [])

  if (customization.DownloadDropdownButton) {
    return (
      <ErrorBoundary
        localBoundary={() => null}
      >
        <ModuleLoader
          url={
            customization.DownloadDropdownButton.getUrl(
              user.organisation.customizationUrl ||
              user.defaultCustomizationUrl,
            )
          }
        >
          {
            (DownloadDropdownButton) => (
              <DownloadDropdownButton
                apiGetRequest={apiRequest.get}
                documentId={documentId}
                documentName={documentName}
                documentTypeCode={documentTypeCode}
                showErrorMessage={showErrorMessage}
              />
            )
          }
        </ModuleLoader>
      </ErrorBoundary>
    )
  }

  return null
}

DownloadDropdownButton.propTypes = {
  documentId: PropTypes.string,
  documentName: PropTypes.string,
  documentTypeCode: PropTypes.string,
}

export {
  DownloadDropdownButton,
}
