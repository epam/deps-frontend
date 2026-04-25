
import { handleActions } from 'redux-actions'
import {
  setTrialLimitations,
  setTrialExpirationDate,
} from '@/actions/trial'

const initialState = {
  trialLimitations: null,
  trialExpirationDate: null,
}

const trialReducer = handleActions(
  new Map([
    [
      setTrialLimitations,
      (state, { payload: trialLimitations }) => ({
        ...state,
        trialLimitations,
      }),
    ],
    [
      setTrialExpirationDate,
      (state, { payload: trialExpirationDate }) => ({
        ...state,
        trialExpirationDate,
      }),
    ],
  ]),
  initialState,
)

export {
  trialReducer,
}
