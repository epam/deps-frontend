import { useSelector } from 'react-redux'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { Footer } from './ApplicationFooter.styles'

const ApplicationFooter = () => {
  const customization = useSelector(customizationSelector)
  const user = useSelector(userSelector)

  if (customization.ApplicationFooter) {
    return (
      <ErrorBoundary
        localBoundary={() => null}
      >
        <ModuleLoader
          url={
            customization.ApplicationFooter.getUrl(
              user.organisation.customizationUrl ||
              user.defaultCustomizationUrl,
            )
          }
        >
          {
            (CustomApplicationFooter) => (
              <Footer>
                <CustomApplicationFooter />
              </Footer>
            )
          }
        </ModuleLoader>
      </ErrorBoundary>
    )
  }

  return null
}

export {
  ApplicationFooter,
}
