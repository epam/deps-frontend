
import { handleActions } from 'redux-actions'
import {
  storeDocumentStates,
} from '@/actions/documentStates'

const initialState = {}

const documentStatesReducer = handleActions(
  new Map([
    [
      storeDocumentStates,
      (state, action) => ({
        ...state,
        ...action.payload,
      }),
    ],
  ]),
  initialState,
)

export {
  documentStatesReducer,
}
