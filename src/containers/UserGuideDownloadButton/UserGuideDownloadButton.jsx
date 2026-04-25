
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { localize, Localization } from '@/localization/i18n'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { notifyWarning } from '@/utils/notification'
import { StyledIcon } from './UserGuideDownloadButton.styles'

const UserGuideDownloadButton = () => {
  const customization = useSelector(customizationSelector)
  const user = useSelector(userSelector)

  const showErrorMessage = useCallback(() => {
    notifyWarning(localize(Localization.DOWNLOAD_FAILURE))
  }, [])

  if (customization.UserGuideDownloadButton) {
    return (
      <ErrorBoundary
        localBoundary={() => null}
      >
        <ModuleLoader
          url={
            customization.UserGuideDownloadButton.getUrl(
              user.organisation.customizationUrl ||
              user.defaultCustomizationUrl,
            )
          }
        >
          {
            (UserGuideDownloadButton) => (
              <UserGuideDownloadButton
                icon={<StyledIcon />}
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

export {
  UserGuideDownloadButton,
}
