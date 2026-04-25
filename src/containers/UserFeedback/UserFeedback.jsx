
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { navigationMap } from '@/utils/navigationMap'
import { Wrapper } from './UserFeedback.styles'

const UserFeedback = () => {
  const customization = useSelector(customizationSelector)
  const user = useSelector(userSelector)
  const location = useLocation()
  const isVisible = location.pathname.includes(navigationMap.documents())

  if (customization.UserFeedback) {
    return (
      <ErrorBoundary
        localBoundary={() => null}
      >
        <Wrapper isVisible={isVisible}>
          <ModuleLoader
            url={
              customization.UserFeedback.getUrl(
                user.organisation.customizationUrl ||
                user.defaultCustomizationUrl,
              )
            }
          >
            {
              (UserFeedback) => (
                <UserFeedback />
              )
            }
          </ModuleLoader>
        </Wrapper>
      </ErrorBoundary>
    )
  }

  return null
}

export {
  UserFeedback,
}
