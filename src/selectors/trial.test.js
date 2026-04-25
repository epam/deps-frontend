
import {
  trialRootSelector,
  trialLimitationsSelector,
  trialExpirationDateSelector,
} from './trial'

describe('selectors: trial', () => {
  let state

  beforeEach(() => {
    state = {
      trial: {
        trialLimitations: [],
        trialExpirationDate: '01-01-2001',
      },
    }
  })

  it('selector: trialRootSelector', () => {
    expect(trialRootSelector(state)).toEqual(state.trial)
  })

  it('selector: trialLimitationsSelector', () => {
    expect(trialLimitationsSelector(state)).toEqual(state.trial.trialLimitations)
  })

  it('selector: trialExpirationDateSelector', () => {
    expect(trialExpirationDateSelector(state)).toEqual(state.trial.trialExpirationDate)
  })
})
