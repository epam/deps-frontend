
import { mockEnv } from '@/mocks/mockEnv'
import { fetchTrialLimitations } from '@/api/trialApi'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const MOCK_API_GET_RESULT = 'MOCK_API_GET_RESULT'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/apiMap')
jest.mock('@/utils/apiRequest', () => ({
  apiRequest: {
    get: jest.fn(() => MOCK_API_GET_RESULT),
  },
}))

describe('Service: trialApi', () => {
  it('should call apiRequest.get with correct url when calling fetchTrialLimitations', () => {
    fetchTrialLimitations()
    expect(apiRequest.get).toHaveBeenNthCalledWith(1, apiMap.apiGateway.v1.trialInfo())
  })
})
