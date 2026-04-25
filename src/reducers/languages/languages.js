
import { handleActions } from 'redux-actions'
import {
  storeLanguages,
} from '@/actions/languages'

const initialState = []

const languagesReducer = handleActions(
  new Map([
    [
      storeLanguages,
      (state, action) => action.payload,
    ],
  ]),
  initialState,
)

export {
  languagesReducer,
}
