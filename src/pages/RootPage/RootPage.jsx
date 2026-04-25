
import { Suspense } from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { ErrorBoundRoute } from '@/components/ErrorBoundRoute'
import { Spin } from '@/components/Spin'
import { ENV } from '@/utils/env'
import { lazy } from '@/utils/lazy'
import { navigationMap } from '@/utils/navigationMap'

const BatchesPage = lazy(() => import('@/pages/BatchesPage'), 'BatchesPage')
const BatchPage = lazy(() => import('@/pages/BatchPage'), 'BatchPage')
const DocumentReviewPage = lazy(() => import('@/pages/DocumentReviewPage'), 'DocumentReviewPage')
const DocumentsPage = lazy(() => import('@/pages/DocumentsPage'), 'DocumentsPage')
const DocumentTypesPage = lazy(() => import('@/pages/DocumentTypesPage'), 'DocumentTypesPage')
const DocumentTypesGroupsPage = lazy(() => import('@/pages/DocumentTypesGroupsPage'), 'DocumentTypesGroupsPage')
const DocumentTypesGroupDetailsPage = lazy(() => import('@/pages/DocumentTypesGroupDetailsPage'), 'DocumentTypesGroupDetailsPage')
const DocumentTypeViewPage = lazy(() => import('@/pages/DocumentTypeViewPage'), 'DocumentTypeViewPage')
const HelpPage = lazy(() => import('@/pages/HelpPage'), 'HelpPage')
const NotFound = lazy(() => import('@/pages/ErrorPages/NotFound'), 'NotFound')
const UsersManagementPage = lazy(() => import('@/pages/UsersManagementPage'), 'UsersManagementPage')
const PermissionDeniedPage = lazy(() => import('@/pages/ErrorPages/PermissionDeniedPage'), 'PermissionDeniedPage')
const DashboardPage = lazy(() => import('@/pages/DashboardPage'), 'DashboardPage')
const PrototypeDetailsPage = lazy(() => import('@/pages/PrototypeDetailsPage'), 'PrototypeDetailsPage')
const CreatePrototypePage = lazy(() => import('@/pages/CreatePrototypePage'), 'CreatePrototypePage')
const RemoteMFEPages = lazy(() => import('@/pages/RemoteMFEPages'), 'RemoteMFEPages')
const TemplateVersionsPage = lazy(() => import('@/pages/TemplateVersionsPage'), 'TemplateVersionsPage')
const FilesPage = lazy(() => import('@/pages/FilesPage'), 'FilesPage')
const FileReviewPage = lazy(() => import('@/pages/FileReviewPage'), 'FileReviewPage')

const RootPage = () => (
  <Suspense fallback={<Spin.Centered spinning />}>
    <Switch>
      <Redirect
        exact
        from={navigationMap.base()}
        to={navigationMap.home()}
      />
      <ErrorBoundRoute path={navigationMap.documents()}>
        <DocumentsPage />
      </ErrorBoundRoute>
      <ErrorBoundRoute path={navigationMap.documentView.path()}>
        <DocumentReviewPage />
      </ErrorBoundRoute>
      <ErrorBoundRoute
        exact
        path={navigationMap.documentTypes()}
      >
        <DocumentTypesPage />
      </ErrorBoundRoute>
      <ErrorBoundRoute path={navigationMap.documentTypes.path()}>
        <DocumentTypeViewPage />
      </ErrorBoundRoute>
      {
        ENV.FEATURE_DOCUMENT_TYPES_GROUPS && (
          <ErrorBoundRoute
            exact
            path={navigationMap.documentTypesGroups()}
          >
            <DocumentTypesGroupsPage />
          </ErrorBoundRoute>
        )
      }
      {
        ENV.FEATURE_DOCUMENT_TYPES_GROUPS && (
          <ErrorBoundRoute
            exact
            path={navigationMap.documentTypesGroups.path()}
          >
            <DocumentTypesGroupDetailsPage />
          </ErrorBoundRoute>
        )
      }
      {
        ENV.FEATURE_FILES_BATCH && (
          <ErrorBoundRoute
            exact
            path={navigationMap.batches()}
          >
            <BatchesPage />
          </ErrorBoundRoute>
        )
      }
      {
        ENV.FEATURE_FILES && (
          <ErrorBoundRoute
            exact
            path={navigationMap.files()}
          >
            <FilesPage />
          </ErrorBoundRoute>
        )
      }
      {
        ENV.FEATURE_FILES && (
          <ErrorBoundRoute
            path={navigationMap.files.file.path()}
          >
            <FileReviewPage />
          </ErrorBoundRoute>
        )
      }
      {
        ENV.FEATURE_FILES_BATCH && (
          <ErrorBoundRoute
            exact
            path={navigationMap.batches.batch.path()}
          >
            <BatchPage />
          </ErrorBoundRoute>
        )
      }
      <ErrorBoundRoute path={navigationMap.help()}>
        <HelpPage />
      </ErrorBoundRoute>
      {
        ENV.FEATURE_USER_MANAGEMENT && (
          <Redirect
            exact
            from={navigationMap.management()}
            to={navigationMap.management.organisationUsers()}
          />
        )
      }
      {
        ENV.FEATURE_USER_MANAGEMENT && (
          <ErrorBoundRoute
            exact
            path={
              [
                navigationMap.management.organisationUsers(),
                navigationMap.management.invitees(),
                navigationMap.management.waitingForApproval(),
              ]
            }
          >
            <UsersManagementPage />
          </ErrorBoundRoute>
        )
      }
      {
        ENV.FEATURE_DASHBOARD && (
          <ErrorBoundRoute path={navigationMap.dashboard()}>
            <DashboardPage />
          </ErrorBoundRoute>
        )
      }
      {
        ENV.FEATURE_PROTOTYPES && (
          <ErrorBoundRoute
            exact
            path={navigationMap.prototypes.createPrototype()}
          >
            <CreatePrototypePage />
          </ErrorBoundRoute>
        )
      }
      {
        ENV.FEATURE_PROTOTYPES && (
          <ErrorBoundRoute
            exact
            path={navigationMap.prototypes.prototype.path()}
          >
            <PrototypeDetailsPage />
          </ErrorBoundRoute>
        )
      }
      {
        ENV.FEATURE_MANAGE_TEMPLATE_VERSIONS && (
          <ErrorBoundRoute
            exact
            path={navigationMap.templates.template.path()}
          >
            <TemplateVersionsPage />
          </ErrorBoundRoute>
        )
      }
      <ErrorBoundRoute path={navigationMap.error.permissionDenied()}>
        <PermissionDeniedPage />
      </ErrorBoundRoute>
      <ErrorBoundRoute path={navigationMap.error.notFound()}>
        <NotFound />
      </ErrorBoundRoute>
      <RemoteMFEPages />
    </Switch>
  </Suspense>
)

export {
  RootPage,
}
