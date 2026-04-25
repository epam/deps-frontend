
import { handleActions } from 'redux-actions'
import {
  storeOCREngines,
  storeTableEngines,
} from '@/actions/engines'

const initialState = {
  ocr: [],
  table: [],
}

const enginesReducer = handleActions(
  new Map([
    [
      storeOCREngines,
      (state, action) => (
        {
          ...state,
          ocr: action.payload,
        }
      ),
    ], [
      storeTableEngines,
      (state, action) => (
        {
          ...state,
          table: action.payload,
        }
      ),
    ],
  ]),
  initialState,
)

export {
  enginesReducer,
}
