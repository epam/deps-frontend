
import { systemApi } from '@/api/systemApi'
import { apiRequest } from '@/utils/apiRequest'

const MOCK_API_RESPONSE = 'FAKE_API_RESPONSE'
const MOCK_API_URI = 'FAKE_API_URI'

jest.mock('@/utils/apiRequest', () => ({
  apiRequest: {
    get: jest.fn(() => MOCK_API_RESPONSE),
  },
}))

jest.mock('@/utils/apiMap', () => ({
  apiMap: {
    backend: {
      v1: {
        version: jest.fn(() => MOCK_API_URI),
      },
    },
  },
}))

describe('Service: systemApi', () => {
  it('should call to the apiRequest.get with correct url', async () => {
    const buildVersion = await systemApi.getBuildVersion()

    expect(apiRequest.get).toHaveBeenNthCalledWith(1, MOCK_API_URI)
    expect(buildVersion).toEqual(MOCK_API_RESPONSE)
  })
})
