
import { batch } from 'react-redux'
import { createAction } from 'redux-actions'
import { fetchDocumentsByFilter } from '@/actions/documentsListPage'
import { createRequestAction } from '@/actions/requests'
import { documentsApi } from '@/api/documentsApi'
import { UNIFIED_DATA_CELLS_BATCH_SIZE } from '@/constants/document'
import { DOCUMENTS_PER_PAGE } from '@/constants/storage'
import { Document } from '@/models/Document'
import { Pagination } from '@/models/Pagination'
import { documentsRootStateSelector } from '@/selectors/documents'
import { documentTypesStateSelector } from '@/selectors/documentTypes'
import { navigationSelector } from '@/selectors/navigation'
import { pathNameSelector } from '@/selectors/router'
import { chunkArray } from '@/utils/array'

export const FEATURE_NAME = 'DOCUMENTS'

export const storeDocuments = createAction(
  `${FEATURE_NAME}/STORE_DOCUMENTS`,
)

export const storeDocument = createAction(
  `${FEATURE_NAME}/STORE_DOCUMENT`,
)

export const storeComment = createAction(
  `${FEATURE_NAME}/STORE_COMMENT`,
  (documentId, comment) => ({
    documentId,
    comment,
  }),
)

export const setInitialDocumentData = createAction(
  `${FEATURE_NAME}/SET_INITIAL_DOCUMENT_DATA`,
)

export const storeValidation = createAction(
  `${FEATURE_NAME}/STORE_VALIDATION`,
  (documentId, validation) => ({
    documentId,
    validation,
  }),
)

export const updateExtractedData = createAction(
  `${FEATURE_NAME}/UPDATE_EXTRACTED_DATA`,
  (documentId, extractedData) => ({
    documentId,
    extractedData,
  }),
)

export const updateUnifiedDataTables = createAction(
  `${FEATURE_NAME}/UPDATE_UNIFIED_DATA_TABLES`,
  ({
    documentId,
    tablesData,
  }) => ({
    documentId,
    tablesData,
  }),
)

export const updateExtractedDataChunk = createAction(
  `${FEATURE_NAME}/UPDATE_EXTRACTED_DATA_CHUNK`,
  (documentId, fieldPk, extractedDataChunk) => ({
    documentId,
    fieldPk,
    extractedDataChunk,
  }),
)

export const storeFields = createAction(
  `${FEATURE_NAME}/STORE_FIELDS`,
  (documentId, fields) => ({
    documentId,
    fields,
  }),
)

export const setDataByProp = createAction(
  `${FEATURE_NAME}/SET_DATA_BY_PROPERTY`,
)

export const setStatesToDocuments = createAction(
  `${FEATURE_NAME}/SET_STATES_TO_DOCUMENTS`,
)

export const addLabel = createRequestAction(
  'addLabel',
  (labelId, documentIds) => async (dispatch, getState) => {
    const response = await documentsApi.addLabel(labelId, documentIds)
    const state = getState()
    const documentTypes = documentTypesStateSelector(state)
    const documents = response.map((document) => Document.fromDTO(document, Object.values(documentTypes)))
    dispatch(storeDocuments(documents))
  },
)

export const removeLabel = createRequestAction(
  'removeLabel',
  (labelId, documentId) => async (dispatch, getState) => {
    await documentsApi.removeLabel(labelId, documentId)

    const state = getState()
    let documents = documentsRootStateSelector(state)
    documents = [
      {
        ...documents[documentId],
        labels: documents[documentId]?.labels?.filter((label) => label._id !== labelId) ?? [],
      },
    ]

    dispatch(storeDocuments(documents))
  },
)

export const saveDocumentData = (document) => async (dispatch) => {
  if (!(document.communication && document.communication.comments)) {
    document.communication = {
      flagged: false,
      comments: [],
    }
  }

  batch(() => {
    dispatch(setInitialDocumentData(document))
    dispatch(storeDocument(document))
  })
}

export const fetchDocumentData = createRequestAction(
  'fetchDocumentData',
  (documentId, withoutPagination) => async (dispatch) => {
    const documentData = await documentsApi.getDocument(documentId, withoutPagination)
    dispatch(saveDocumentData(documentData))
    return documentData
  },
)

export const fetchDocument = createRequestAction(
  'fetchDocument',
  (documentId) => async (dispatch) => {
    const documentData = await documentsApi.getDocumentWithoutExtraction(documentId)
    dispatch(saveDocumentData(documentData))
    return documentData
  },
)

export const extractData = createRequestAction(
  'extractData',
  (checkedDocuments, engineCode) => async (dispatch) => {
    const documents = await documentsApi.extractData(checkedDocuments, engineCode)
    dispatch(storeDocuments(documents))
    return documents
  },
)

export const deleteDocuments = createRequestAction(
  'deleteDocuments',
  (documentIds, parentId) => async (dispatch, getState) => {
    await documentsApi.deleteDocuments(documentIds)

    const initialPagination = Pagination.getInitialPagination(DOCUMENTS_PER_PAGE)
    const state = getState()
    const pathname = pathNameSelector(state)
    const navigation = navigationSelector(state, pathname)

    dispatch(fetchDocumentsByFilter({
      ...navigation.filters,
      ...initialPagination,
      ...navigation.pagination,
      parentId,
    }))
  },
)

export const fetchPaginatedEdTable = createRequestAction(
  'fetchPaginatedEdTable',
  (documentPK, fieldPK, paginationConfig) => async (dispatch) => {
    const ed = await documentsApi.getPaginatedEdTable(documentPK, fieldPK, paginationConfig)
    dispatch(updateExtractedDataChunk(documentPK, fieldPK, ed))
  },
)

export const fetchUnifiedDataCells = createRequestAction(
  'fetchUnifiedDataCells',
  ({
    documentId,
    tableConfigs,
  }) => async (dispatch) => {
    const batches = chunkArray(tableConfigs, UNIFIED_DATA_CELLS_BATCH_SIZE)
    const cells = []

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map((cnf) => documentsApi.getUnifiedDataTableCells(
          documentId,
          cnf.tableId,
          cnf.maxRow,
          cnf.maxColumn,
        )),
      )
      cells.push(...batchResults)
    }

    const tablesData = cells.map((cell, i) => ({
      cells: cell,
      tableId: tableConfigs[i].tableId,
    }))

    dispatch(updateUnifiedDataTables({
      documentId,
      tablesData,
    }))
  },
)
