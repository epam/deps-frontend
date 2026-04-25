
import { mockEnv } from '@/mocks/mockEnv'
import { fetchTrialLimitations } from '@/api/trialApi'
import {
  fetchTrialLimitationsInfo,
  setTrialExpirationDate,
  setTrialLimitations,
} from '.'

const mockLimitations = {
  allTemplates: {},
  expirationDate: 'data',
}

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/api/trialApi', () => ({
  fetchTrialLimitations: jest.fn(() => Promise.resolve(mockLimitations)),
}))

describe('Action creator: fetchTrialLimitationsInfo', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()

    jest.clearAllMocks()
  })

  it('should call fetchTrialLimitations once', async () => {
    await fetchTrialLimitationsInfo()(dispatch)

    expect(fetchTrialLimitations).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch with setTrialLimitations and setTrialExpiration date actions', async () => {
    const { expirationDate, ...rest } = mockLimitations

    await fetchTrialLimitationsInfo()(dispatch)

    expect(dispatch).nthCalledWith(2, setTrialLimitations(rest))
    expect(dispatch).nthCalledWith(3, setTrialExpirationDate(expirationDate))
  })
})
