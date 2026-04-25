
import { createAction } from 'redux-actions'
import { documentsApi } from '@/api/documentsApi'
import { DOCUMENTS_PER_PAGE } from '@/constants/storage'
import { Pagination } from '@/models/Pagination'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { documentsIdsSelector, documentsTotalSelector } from '@/selectors/documentsListPage'
import { navigationSelector } from '@/selectors/navigation'
import { navigationMap } from '@/utils/navigationMap'

export const FEATURE_NAME = 'DOCUMENT_NAVIGATION_INFO'

export const storeCurrentDocIndex = createAction(
  `${FEATURE_NAME}/STORE_CURRENT_DOC_INDEX`,
)

export const storePagination = createAction(
  `${FEATURE_NAME}/STORE_CURRENT_PAGE`,
)

export const storeDocumentNavigationInfo = createAction(
  `${FEATURE_NAME}/STORE_DOCUMENT_NAVIGATION_INFO`,
)

export const updateDocumentNavigationInfo = createAction(
  `${FEATURE_NAME}/UPDATE_DOCUMENT_NAVIGATION_INFO`,
)

export const clearDocumentNavigationInfo = createAction(
  `${FEATURE_NAME}/CLEAR_DOCUMENT_NAVIGATION_INFO`,
)

export const initializeDocumentNavigationInfo = (documentId) => (dispatch, getState) => {
  const state = getState()
  const documentIds = documentsIdsSelector(state)
  const total = documentsTotalSelector(state)
  const currentDocIndex = documentIds.indexOf(documentId)

  const navigation = navigationSelector(
    state,
    navigationMap.documents(),
  )
  const initialPagination = Pagination.getInitialPagination(DOCUMENTS_PER_PAGE)

  const pagination = {
    ...DefaultPaginationConfig,
    ...initialPagination,
    ...navigation.pagination,
  }

  dispatch(storeDocumentNavigationInfo({
    currentDocIndex,
    documentIds,
    pagination,
    total,
  }))
}

export const fetchDocumentsForNavigationInfo = (pagination) => async (dispatch, getState) => {
  const state = getState()
  const navigation = navigationSelector(
    state,
    navigationMap.documents(),
  )

  const filterConfig = {
    ...navigation.filters,
    ...pagination,
  }

  const { documents, meta } = await documentsApi.getDocumentList(filterConfig)
  const documentIds = documents.map((doc) => doc._id)

  if (documentIds.length > 0) {
    dispatch(updateDocumentNavigationInfo({
      documentIds,
      total: meta.total,
    }))
  }

  return documentIds
}
