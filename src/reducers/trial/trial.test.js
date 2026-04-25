
import { mockEnv } from '@/mocks/mockEnv'
import {
  setTrialExpirationDate,
  setTrialLimitations,
} from '@/actions/trial'
import { trialReducer } from './trial'

jest.mock('@/utils/env', () => mockEnv)

const initialState = {
  trialLimitations: null,
  trialExpirationDate: null,
}

const mockExpirationDate = '22.12.2023'
const mockLimitation = {
  limitation: 'test',
}

describe('Reducer: trialReducer', () => {
  it('Action handler: setTrialLimitations', () => {
    const action = setTrialLimitations(mockLimitation)

    const expected = {
      ...initialState,
      trialLimitations: mockLimitation,
    }

    expect(trialReducer(initialState, action)).toEqual(expected)
  })

  it('Action handler: setTrialExpirationDate', () => {
    const action = setTrialExpirationDate(mockExpirationDate)

    const expected = {
      ...initialState,
      trialExpirationDate: mockExpirationDate,
    }

    expect(trialReducer(initialState, action)).toEqual(expected)
  })
})
