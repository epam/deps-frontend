
import { Suspense } from 'react'
import { Switch } from 'react-router-dom'
import { BackendServicesGuard } from '@/application/BackendServicesGuard'
import { OrganisationSettings } from '@/application/OrganisationSettings'
import { Root } from '@/application/Root'
import { TrialNotifier } from '@/application/TrialNotifier'
import { ErrorBoundRoute } from '@/components/ErrorBoundRoute'
import { Spin } from '@/components/Spin'
import { ENV } from '@/utils/env'
import { lazy } from '@/utils/lazy'
import { navigationMap } from '@/utils/navigationMap'
import { AuthorizationGuard } from './AuthorizationGuard'

const UnauthorizedPage = lazy(() => import('@/application/ApplicationError/Unauthorized'), 'Unauthorized')
const NoUserOrganisationPage = lazy(() => import('@/application/ApplicationError/NoUserOrganisation'), 'NoUserOrganisation')
const MissedCoreServices = lazy(() => import('@/application/ApplicationError/MissedCoreServices'), 'MissedCoreServices')

const Authorization = () => {
  return (
    <Suspense fallback={<Spin.Centered spinning />}>
      <Switch>
        <ErrorBoundRoute
          exact
          path={navigationMap.error.noUserOrganisation()}
        >
          <NoUserOrganisationPage />
        </ErrorBoundRoute>
        <ErrorBoundRoute
          exact
          path={navigationMap.error.unauthorized()}
        >
          <UnauthorizedPage />
        </ErrorBoundRoute>
        <ErrorBoundRoute
          exact
          path={navigationMap.error.missedCoreServices()}
        >
          <MissedCoreServices />
        </ErrorBoundRoute>
        <ErrorBoundRoute
          path={navigationMap.base()}
        >
          <AuthorizationGuard>
            <BackendServicesGuard>
              <OrganisationSettings>
                <Root />
                {
                  ENV.FEATURE_TRIAL_VERSION &&
                  <TrialNotifier />
                }
              </OrganisationSettings>
            </BackendServicesGuard>
          </AuthorizationGuard>
        </ErrorBoundRoute>
      </Switch>
    </Suspense>
  )
}

export {
  Authorization,
}
