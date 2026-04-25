
import { handleActions } from 'redux-actions'
import {
  storeLabels,
  storeLabel,
} from '@/actions/labels'

const initialState = []

const labelsReducer = handleActions(
  new Map([
    [
      storeLabels,
      (state, action) => action.payload,
    ],
    [
      storeLabel,
      (state, action) => ([
        ...state,
        action.payload,
      ]),
    ],
  ]),
  initialState,
)

export {
  labelsReducer,
}
