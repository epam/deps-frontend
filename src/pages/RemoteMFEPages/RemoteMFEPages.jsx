
import { Switch } from 'react-router-dom'
import { ErrorBoundRoute } from '@/components/ErrorBoundRoute'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { NotFound } from '@/pages/ErrorPages/NotFound'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'

const MFE_PREFIX = 'MFE'

const RemoteMFEPages = () => {
  const remoteMFEUrls = (
    Object.keys(ENV)
      .filter((key) => key.startsWith(MFE_PREFIX) && ENV[key])
      .map((key) => ENV[key])
  )

  const renderRoutes = (module) => (
    module.map((m) => (
      <ErrorBoundRoute
        key={m.path}
        exact={m.exact}
        localBoundary={m.pageFallback}
        path={m.path}
      >
        {m.component}
      </ErrorBoundRoute>
    ))
  )

  return (
    <Switch>
      {
        remoteMFEUrls.map((url) => (
          <ModuleLoader
            key={url}
            url={url}
          >
            {renderRoutes}
          </ModuleLoader>
        ))
      }
      <ErrorBoundRoute path={navigationMap.notMatch()}>
        <NotFound />
      </ErrorBoundRoute>
    </Switch>
  )
}

export {
  RemoteMFEPages,
}
