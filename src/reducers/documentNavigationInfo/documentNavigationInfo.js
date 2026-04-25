
import { handleActions } from 'redux-actions'
import {
  storeCurrentDocIndex,
  storePagination,
  storeDocumentNavigationInfo,
  updateDocumentNavigationInfo,
  clearDocumentNavigationInfo,
} from '@/actions/documentNavigationInfo'

const initialState = {
  documentIds: [],
  total: 0,
  currentDocIndex: undefined,
  pagination: {},
}

const documentNavigationInfoReducer = handleActions(
  new Map([
    [
      storeCurrentDocIndex,
      (state, { payload: currentDocIndex }) => ({
        ...state,
        currentDocIndex,
      }),
    ],
    [
      storePagination,
      (state, { payload: pagination }) => ({
        ...state,
        pagination,
      }),
    ],
    [
      storeDocumentNavigationInfo,
      (state, {
        payload: {
          currentDocIndex,
          documentIds,
          pagination,
          total,
        },
      }) => ({
        currentDocIndex,
        documentIds,
        total,
        pagination,
      }),
    ],
    [
      updateDocumentNavigationInfo,
      (state, { payload: { documentIds, total } }) => ({
        ...state,
        documentIds,
        total,
      }),
    ],
    [
      clearDocumentNavigationInfo,
      () => initialState,
    ],
  ]),
  initialState,
)

export {
  initialState,
  documentNavigationInfoReducer,
}
