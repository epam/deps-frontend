
import { createAction } from 'redux-actions'

const FEATURE_NAME = 'PROTOTYPE_PAGE'

const storeKeyToAssign = createAction(
    `${FEATURE_NAME}/STORE_KEY`,
)

const clearKeyToAssign = () => (dispatch) => {
  dispatch(storeKeyToAssign(null))
}

const setActiveLayoutId = createAction(
  `${FEATURE_NAME}/SET_ACTIVE_LAYOUT_ID`,
)

const setActiveTable = createAction(
  `${FEATURE_NAME}/SET_ACTIVE_TABLE`,
)

const toggleAddFieldDrawer = createAction(
  `${FEATURE_NAME}/TOGGLE_ADD_FIELD_DRAWER`,
)

export {
  storeKeyToAssign,
  clearKeyToAssign,
  setActiveLayoutId,
  setActiveTable,
  toggleAddFieldDrawer,
}
