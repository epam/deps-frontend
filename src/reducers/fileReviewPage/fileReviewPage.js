
import { handleActions } from 'redux-actions'
import {
  setHighlightedField,
  addActivePolygons,
  clearActivePolygons,
  clearFileStore,
} from '@/actions/fileReviewPage'

const initialState = {
  highlightedField: null,
  activePolygons: [],
}

const fileReviewPageReducer = handleActions(
  new Map([
    [
      setHighlightedField,
      (state, action) => ({
        ...state,
        highlightedField: action.payload,
      }),
    ],
    [
      addActivePolygons,
      (state, { payload }) => ({
        ...state,
        activePolygons: [...state.activePolygons, payload],
      }),
    ],
    [
      clearActivePolygons,
      (state) => ({
        ...state,
        activePolygons: [],
      }),
    ],
    [
      clearFileStore,
      () => initialState,
    ],
  ]),
  initialState,
)

export {
  initialState,
  fileReviewPageReducer,
}
