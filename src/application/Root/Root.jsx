
import { Suspense, useCallback } from 'react'
import { Switch } from 'react-router-dom'
import { GlobalStylesLoader } from '@/application/GlobalStylesLoader'
import { ErrorBoundRoute } from '@/components/ErrorBoundRoute'
import { Spin } from '@/components/Spin'
import { ENV } from '@/utils/env'
import { lazy } from '@/utils/lazy'
import { navigationMap } from '@/utils/navigationMap'
import { ApplicationRootRoutes } from './ApplicationRootRoutes'

const ServiceUnavailablePage = lazy(() => import('@/application/ApplicationError/ServiceUnavailable'), 'ServiceUnavailable')
const DocumentLabelingToolPage = lazy(() => import('@/pages/DocumentLabelingToolPage'), 'DocumentLabelingToolPage')
const TemplateLabelingToolPage = lazy(() => import('@/pages/TemplateLabelingToolPage'), 'TemplateLabelingToolPage')
const ServicesVersionsPage = lazy(() => import('@/pages/ServicesVersionsPage'), 'ServicesVersionsPage')
const WaitingApprovalPage = lazy(() => import('@/pages/WaitingApprovalPage'), 'WaitingApprovalPage')
const JoiningPage = lazy(() => import('@/pages/JoiningPage'), 'JoiningPage')
const NotFound = lazy(() => import('@/pages/ErrorPages/NotFound'), 'NotFound')

const Root = () => {
  const renderApplicationRootRoutes = useCallback(() => <ApplicationRootRoutes />, [])

  return (
    <Suspense fallback={<Spin.Centered spinning />}>
      <Switch>
        <ErrorBoundRoute path={navigationMap.error.serviceUnavailable()}>
          <ServiceUnavailablePage />
        </ErrorBoundRoute>
        {
          ENV.FEATURE_LABELING_TOOL && (
            <ErrorBoundRoute path={navigationMap.labelingTool.document.path()}>
              <GlobalStylesLoader>
                <DocumentLabelingToolPage />
              </GlobalStylesLoader>
            </ErrorBoundRoute>
          )
        }
        {
          ENV.FEATURE_LABELING_TOOL &&
          ENV.FEATURE_TEMPLATES && (
            <ErrorBoundRoute path={navigationMap.templates.labelingTool.path()}>
              <GlobalStylesLoader>
                <TemplateLabelingToolPage />
              </GlobalStylesLoader>
            </ErrorBoundRoute>
          )
        }
        <ErrorBoundRoute path={navigationMap.versions()}>
          <ServicesVersionsPage />
        </ErrorBoundRoute>
        <ErrorBoundRoute path={navigationMap.join.organisation()}>
          <JoiningPage />
        </ErrorBoundRoute>
        <ErrorBoundRoute
          path={navigationMap.waitingApproval()}
        >
          <WaitingApprovalPage />
        </ErrorBoundRoute>
        <ErrorBoundRoute path={navigationMap.error.rootNotFound()}>
          <NotFound />
        </ErrorBoundRoute>
        <ErrorBoundRoute
          render={renderApplicationRootRoutes}
        />
      </Switch>
    </Suspense>
  )
}

export {
  Root,
}
