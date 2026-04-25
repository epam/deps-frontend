
import { Suspense } from 'react'
import { Switch } from 'react-router-dom'
import { ApplicationLayout } from '@/application/ApplicationLayout'
import { GlobalStylesLoader } from '@/application/GlobalStylesLoader'
import { ErrorBoundRoute } from '@/components/ErrorBoundRoute'
import { Spin } from '@/components/Spin'
import { UserFeedback } from '@/containers/UserFeedback'
import { useCustomModule } from '@/hooks/useCustomModule'
import { lazy } from '@/utils/lazy'

const RootPage = lazy(() => import('@/pages/RootPage'), 'RootPage')
const CustomApplicationPage = lazy(() => import('@/pages/CustomApplicationPage'), 'CustomApplicationPage')

const EXTERNAL_PAGES_MODULE_NAME = {
  EXTERNAL_PAGES: 'ExternalPages',
}

const renderRootPage = () => (
  <GlobalStylesLoader>
    <ApplicationLayout>
      <RootPage />
      <UserFeedback />
    </ApplicationLayout>
  </GlobalStylesLoader>
)

const mapPageConfigToRoute = ({ path, Component }) => (
  <ErrorBoundRoute
    key={path}
    path={path}
  >
    <GlobalStylesLoader>
      <CustomApplicationPage renderChild={(props) => <Component {...props} />} />
    </GlobalStylesLoader>
  </ErrorBoundRoute>
)

const useExternalPages = () => {
  const {
    module: externalPageConfigs,
    ready: areConfigsReady,
  } = useCustomModule(EXTERNAL_PAGES_MODULE_NAME.EXTERNAL_PAGES)

  return [
    areConfigsReady,
    externalPageConfigs?.map(mapPageConfigToRoute),
  ]
}

const ApplicationRootRoutes = () => {
  const [areConfigsReady, externalRoutes] = useExternalPages()

  if (!areConfigsReady) {
    return <Spin.Centered spinning />
  }

  return (
    <Suspense fallback={<Spin.Centered spinning />}>
      <Switch>
        {externalRoutes}
        <ErrorBoundRoute
          render={renderRootPage}
        />
      </Switch>
    </Suspense>
  )
}

export {
  ApplicationRootRoutes,
}
