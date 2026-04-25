
import { createAction } from 'redux-actions'

const FEATURE_NAME = 'CUSTOMIZATION'

const setCustomization = createAction(
  `${FEATURE_NAME}/SET_CUSTOMIZATION`,
)

export {
  setCustomization,
}
