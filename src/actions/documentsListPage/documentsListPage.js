
import { createAction } from 'redux-actions'
import { storeDocuments } from '@/actions/documents'
import { createRequestAction } from '@/actions/requests'
import { documentsApi } from '@/api/documentsApi'
import { DOCUMENTS_PER_PAGE } from '@/constants/storage'
import { Pagination } from '@/models/Pagination'
import { navigationSelector } from '@/selectors/navigation'
import { navigationMap } from '@/utils/navigationMap'
import {
  notifyWarning,
} from '@/utils/notification'

export const FEATURE_NAME = 'DOCUMENTS_LIST_PAGE'

export const storeDocumentsIds = createAction(
  `${FEATURE_NAME}/STORE_DOCUMENTS_IDS`,
)

export const fetchDocumentsByFilter = createRequestAction(
  'fetchDocumentsByFilter',
  (filterConfig) => async (dispatch) => {
    const { documents, meta } = await documentsApi.getDocumentList(filterConfig)

    const updatedDocuments = documents.map((document) => ({
      ...document,
      status: document.validationStatus ? document.validationStatus.title : '',
      labels: document.labels ? document.labels : [],
    }))

    dispatch(storeDocuments(updatedDocuments))
    dispatch(storeDocumentsIds({
      ids: updatedDocuments.map((doc) => doc._id),
      total: meta.total,
    }))
  },
  () => {
    notifyWarning('Something went wrong. Please try again')
  },
)

export const refreshDocuments = () => (dispatch, getState) => {
  const state = getState()
  const navigation = navigationSelector(
    state,
    navigationMap.documents(),
  )
  const initialPagination = Pagination.getInitialPagination(DOCUMENTS_PER_PAGE)

  const filterConfig = {
    ...navigation.filters,
    ...initialPagination,
    ...navigation.pagination,
  }

  dispatch(
    fetchDocumentsByFilter(filterConfig))
}

export const updateDocumentsType = createRequestAction(
  'updateDocumentsType',
  (type, checkedDocuments) => async (dispatch) => {
    const documents = await documentsApi.assignDocumentType(checkedDocuments, type)
    dispatch(storeDocuments(documents))
    return documents
  },
)
