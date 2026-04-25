
import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'
import { rootApi } from '@/apiRTK/rootApi'
import { agenticChatReducer } from '@/reducers/agenticChat'
import { authorizationReducer } from '@/reducers/authorization'
import { customizationReducer } from '@/reducers/customization'
import { documentNavigationInfoReducer } from '@/reducers/documentNavigationInfo'
import { documentReviewPageReducer } from '@/reducers/documentReviewPage'
import { documentsReducer } from '@/reducers/documents'
import { documentsListPageReducer } from '@/reducers/documentsListPage'
import { documentStatesReducer } from '@/reducers/documentStates'
import { documentTypeReducer } from '@/reducers/documentType'
import { documentTypePageReducer } from '@/reducers/documentTypePage'
import { documentTypesReducer } from '@/reducers/documentTypes'
import { documentTypesListPageReducer } from '@/reducers/documentTypesListPage'
import { enginesReducer } from '@/reducers/engines'
import { fileReviewPageReducer } from '@/reducers/fileReviewPage'
import { genAiChatReducer } from '@/reducers/genAiChat'
import { genAiDataReducer } from '@/reducers/genAiData'
import { labelsReducer } from '@/reducers/labels'
import { languagesReducer } from '@/reducers/languages'
import { navigationReducer } from '@/reducers/navigation'
import { organisationsReducer } from '@/reducers/organisations'
import { orgUserManagementReducer } from '@/reducers/orgUserManagement'
import { orgUserManagementPageReducer } from '@/reducers/orgUserManagementPage'
import { prototypePageReducer } from '@/reducers/prototypePage'
import { requestsReducer } from '@/reducers/requests'
import { systemReducer } from '@/reducers/system'
import { trialReducer } from '@/reducers/trial'

const createReducers = (history) => combineReducers({
  documents: documentsReducer,
  documentsListPage: documentsListPageReducer,
  documentNavigationInfo: documentNavigationInfoReducer,
  documentReviewPage: documentReviewPageReducer,
  documentStates: documentStatesReducer,
  documentTypes: documentTypesReducer,
  documentType: documentTypeReducer,
  documentTypePage: documentTypePageReducer,
  documentTypesListPage: documentTypesListPageReducer,
  fileReviewPage: fileReviewPageReducer,
  engines: enginesReducer,
  labels: labelsReducer,
  languages: languagesReducer,
  navigation: navigationReducer,
  requests: requestsReducer,
  router: connectRouter(history),
  system: systemReducer,
  organisations: organisationsReducer,
  customization: customizationReducer,
  authorization: authorizationReducer,
  orgUserManagementPage: orgUserManagementPageReducer,
  orgUserManagement: orgUserManagementReducer,
  trial: trialReducer,
  genAiChat: genAiChatReducer,
  genAiData: genAiDataReducer,
  prototypePage: prototypePageReducer,
  agenticChat: agenticChatReducer,
  [rootApi.reducerPath]: rootApi.reducer,
})

export {
  createReducers,
}
