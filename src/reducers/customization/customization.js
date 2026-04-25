
import { handleActions } from 'redux-actions'
import { setCustomization } from '@/actions/customization'

const initialState = {}

const customizationReducer = handleActions(
  new Map([
    [
      setCustomization,
      (state, { payload }) => payload,
    ],
  ]),
  initialState,
)

export {
  customizationReducer,
}
