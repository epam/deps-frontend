
import { useSelector } from 'react-redux'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { goTo } from '@/utils/routerActions'
import { openInNewTarget } from '@/utils/window'

const StartTourButton = () => {
  const customization = useSelector(customizationSelector)
  const user = useSelector(userSelector)

  const onClick = (event, path) => {
    openInNewTarget(
      event,
      path,
      () => goTo(path),
    )
  }

  if (customization.StartTourButton) {
    return (
      <ErrorBoundary
        localBoundary={() => null}
      >
        <ModuleLoader
          url={
            customization.StartTourButton.getUrl(
              user.organisation.customizationUrl ||
              user.defaultCustomizationUrl,
            )
          }
        >
          {
            (StartTourButton) => (
              <StartTourButton
                onClick={onClick}
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
  StartTourButton,
}
