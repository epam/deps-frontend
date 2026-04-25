
import { handleActions } from 'redux-actions'
import {
  storeSystemVersion,
  storeTableColumns,
} from '@/actions/system'

const initialState = {}

const systemReducer = handleActions(
  new Map([
    [
      storeSystemVersion,
      (state, action) => ({
        ...state,
        ...action.payload,
      }),
    ],
    [
      storeTableColumns,
      (state, action) => ({
        ...state,
        tableColumns: action.payload,
      }),
    ],
  ]),
  initialState,
)

export {
  systemReducer,
}
