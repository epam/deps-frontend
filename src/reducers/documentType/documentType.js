
import { handleActions } from 'redux-actions'
import {
  clearDocumentTypeStore,
  storeDocumentType,
} from '@/actions/documentType'

const initialState = null

const documentTypeReducer = handleActions(
  new Map([
    [
      storeDocumentType,
      (state, { payload: documentType }) => documentType,
    ],
    [
      clearDocumentTypeStore,
      () => initialState,
    ],
  ]),
  initialState,
)

export {
  documentTypeReducer,
}
