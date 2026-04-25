
import { useSelector } from 'react-redux'
import { DefaultGlobalStyles } from '@/application/DefaultGlobalStyles'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { childrenShape } from '@/utils/propTypes'

const GlobalStylesLoader = ({ children }) => {
  const customization = useSelector(customizationSelector)
  const user = useSelector(userSelector)

  if (customization.GlobalStyles) {
    return (
      <ErrorBoundary
        localBoundary={() => children}
      >
        <ModuleLoader
          url={
            customization.GlobalStyles.getUrl(
              user.organisation.customizationUrl ||
              user.defaultCustomizationUrl,
            )
          }
        >
          {
            (customStyles) => (
              <>
                <DefaultGlobalStyles custom={customStyles} />
                {children}
              </>
            )
          }
        </ModuleLoader>
      </ErrorBoundary>
    )
  }

  return children
}

GlobalStylesLoader.propTypes = {
  children: childrenShape,
}

export {
  GlobalStylesLoader,
}
