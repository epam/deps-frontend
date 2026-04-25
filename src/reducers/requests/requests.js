
import { handleActions } from 'redux-actions'
import { requestAttempt, requestSuccess, requestFailure } from '@/actions/requests'

const MAX_ERRORS_SIZE = 20

const requestAttemptHandler = (state, action) => ({
  ...state,
  pending: state.pending.concat(action.payload),
})

const requestSuccessHandler = (state, action) => ({
  ...state,
  pending: state.pending.filter((id) => id !== action.payload),
})

const requestFailureHandler = (state, action) => ({
  ...state,
  pending: state.pending.filter((id) => id !== action.payload.requestId),
  errors: [...state.errors, action.payload].slice(-MAX_ERRORS_SIZE),
})

const defaultState = {
  pending: [],
  errors: [],
}

const requestsReducer = handleActions(
  new Map([
    [
      requestAttempt,
      requestAttemptHandler,
    ],
    [
      requestSuccess,
      requestSuccessHandler,
    ],
    [
      requestFailure,
      requestFailureHandler,
    ],
  ]),
  defaultState,
)

export {
  requestsReducer,
}
