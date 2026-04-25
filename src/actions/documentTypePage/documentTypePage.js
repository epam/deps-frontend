
import { createAction } from 'redux-actions'

const FEATURE_NAME = 'DOCUMENT_TYPE_PAGE'

const changeActiveTab = createAction(
  `${FEATURE_NAME}/CHANGE_ACTIVE_TAB`,
)

export {
  changeActiveTab,
}
