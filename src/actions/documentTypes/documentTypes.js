
import { createAction } from 'redux-actions'
import { createRequestAction } from '@/actions/requests'
import { documentTypesApi } from '@/api/documentTypesApi'

const FEATURE_NAME = 'DOCUMENT_TYPES'

const storeDocumentTypes = createAction(
  `${FEATURE_NAME}/STORE_DOCUMENT_TYPES`,
)

const fetchDocumentTypes = createRequestAction(
  'fetchDocumentTypes',
  () => async (dispatch) => {
    const documentTypes = await documentTypesApi.fetchDocumentTypes()
    dispatch(storeDocumentTypes(documentTypes))
  },
)

export {
  storeDocumentTypes,
  fetchDocumentTypes,
}
