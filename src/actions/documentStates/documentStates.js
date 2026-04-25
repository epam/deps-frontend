
import { createAction } from 'redux-actions'
import { createRequestAction } from '@/actions/requests'
import { documentStatesApi } from '@/api/documentStatesApi'

const FEATURE_NAME = 'DOCUMENT_STATES'

export const storeDocumentStates = createAction(
  `${FEATURE_NAME}/STORE`,
)
export const fetchDocumentStates = createRequestAction(
  'fetchDocumentStates',
  () => async (dispatch) => {
    const states = await documentStatesApi.getDocumentStates()
    const uiStates = Object.values(states).reduce((acc, status) => {
      const { name, title } = status
      return {
        ...acc,
        [name]: title,
      }
    }, {})
    dispatch(storeDocumentStates(uiStates))
  },
)
