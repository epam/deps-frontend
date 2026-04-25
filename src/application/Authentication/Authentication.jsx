
import { Suspense } from 'react'
import { Switch } from 'react-router-dom'
import { Authorization } from '@/application/Authorization'
import { ErrorBoundRoute } from '@/components/ErrorBoundRoute'
import { Spin } from '@/components/Spin'
import { lazy } from '@/utils/lazy'
import { navigationMap } from '@/utils/navigationMap'
import { AuthenticationGuard } from './AuthenticationGuard'

const ServiceUnavailablePage = lazy(() => import('@/application/ApplicationError/ServiceUnavailable'), 'ServiceUnavailable')
const SilentRenewPage = lazy(() => import('@/application/Authentication/SilentRenew'), 'SilentRenew')
const SignInCallbackPage = lazy(() => import('@/application/Authentication/SignInCallback'), 'SignInCallback')
const SignInPage = lazy(() => import('@/application/Authentication/SignIn'), 'SignIn')

const Authentication = () => (
  <Suspense fallback={<Spin.Centered spinning />}>
    <Switch>
      <ErrorBoundRoute
        exact
        path={navigationMap.auth.silentRenew()}
      >
        <SilentRenewPage />
      </ErrorBoundRoute>
      <ErrorBoundRoute
        exact
        path={navigationMap.auth.signInCallback()}
      >
        <SignInCallbackPage />
      </ErrorBoundRoute>
      <ErrorBoundRoute
        exact
        path={navigationMap.auth.signIn()}
      >
        <SignInPage />
      </ErrorBoundRoute>
      <ErrorBoundRoute path={navigationMap.error.serviceUnavailable()}>
        <ServiceUnavailablePage />
      </ErrorBoundRoute>
      <ErrorBoundRoute
        path={navigationMap.base()}
      >
        <AuthenticationGuard>
          <Authorization />
        </AuthenticationGuard>
      </ErrorBoundRoute>
    </Switch>
  </Suspense>
)

export {
  Authentication,
}
