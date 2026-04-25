
import { createSelector } from 'reselect'

const trialRootSelector = (state) => state.trial

const trialLimitationsSelector = createSelector(
  [trialRootSelector],
  (trial) => trial.trialLimitations,
)

const trialExpirationDateSelector = createSelector(
  [trialRootSelector],
  (trial) => trial.trialExpirationDate,
)

export {
  trialRootSelector,
  trialLimitationsSelector,
  trialExpirationDateSelector,
}
