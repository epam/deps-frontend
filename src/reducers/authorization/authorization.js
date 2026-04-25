
import { handleActions } from 'redux-actions'
import {
  storeUser,
} from '@/actions/authorization'

const initialState = {
  user: null,
}

const authorizationReducer = handleActions(
  new Map([
    [
      storeUser,
      (state, { payload }) => ({
        ...state,
        user: payload,
      }),
    ],
  ]),
  initialState,
)

export {
  authorizationReducer,
}
