
import { handleActions } from 'redux-actions'
import {
  setActiveLayoutId,
  setActiveTable,
  storeKeyToAssign,
  toggleAddFieldDrawer,
} from '@/actions/prototypePage'

const initialState = {
  keyToAssign: null,
  activeLayoutId: null,
  activeTable: null,
  showTableDrawer: false,
}

const prototypePageReducer = handleActions(
  new Map([
    [
      storeKeyToAssign,
      (state, action) => ({
        ...state,
        keyToAssign: action.payload,
      }),
    ],
    [
      setActiveLayoutId,
      (state, action) => ({
        ...state,
        activeLayoutId: action.payload,
      }),
    ],
    [
      setActiveTable,
      (state, action) => ({
        ...state,
        activeTable: action.payload,
      }),
    ],
    [
      toggleAddFieldDrawer,
      (state) => ({
        ...state,
        showTableDrawer: !state.showTableDrawer,
      }),
    ],
  ]),
  initialState,
)

export {
  prototypePageReducer,
}
