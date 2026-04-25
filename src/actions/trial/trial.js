
import { batch } from 'react-redux'
import { createAction } from 'redux-actions'
import { fetchTrialLimitations } from '@/api/trialApi'
import { createRequestAction } from '../requests'

const FEATURE_NAME = 'TRIAL'

export const setTrialLimitations = createAction(
    `${FEATURE_NAME}/SET_TRIAL_LIMITATIONS`,
)

export const setTrialExpirationDate = createAction(
    `${FEATURE_NAME}/SET_TRIAL_EXPIRATION_DATE`,
)

export const fetchTrialLimitationsInfo = createRequestAction(
  'fetchTrialLimitationsInfo',
  () => async (dispatch) => {
    const limitations = await fetchTrialLimitations()
    const { expirationDate, ...rest } = limitations

    batch(() => {
      dispatch(setTrialLimitations(rest))
      dispatch(setTrialExpirationDate(expirationDate))
    })
  },
)
