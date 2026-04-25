
import { useSelector } from 'react-redux'
import { documentsApi } from '@/api/documentsApi'
import { authenticationProvider } from '@/authentication'
import { ApplicationLogo } from '@/containers/ApplicationLogo'
import { userSelector } from '@/selectors/authorization'
import { navigationMap } from '@/utils/navigationMap'
import {
  notifyError,
  notifyProgress,
  notifySuccess,
  notifyWarning,
} from '@/utils/notification'
import { goTo } from '@/utils/routerActions'

const notifications = {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  progress: notifyProgress,
}

const documentApi = {
  createSession: documentsApi.createMultiUploadSession,
  uploadDocument: documentsApi.createDocumentLegacy,
  runPipeline: documentsApi.runPipeline,
}

const CustomApplicationPage = ({ renderChild }) => {
  const user = useSelector(userSelector)

  const childProps = {
    user,
    renderApplicationLogo: () => <ApplicationLogo />,
    onLogOut: authenticationProvider.signOut,
    notifications,
    api: documentApi,
    goTo: {
      documentsPage: () => goTo(navigationMap.documents()),
    },
  }

  return renderChild(childProps)
}

export {
  CustomApplicationPage,
}
