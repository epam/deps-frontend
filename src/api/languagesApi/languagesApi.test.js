
import { mockEnv } from '@/mocks/mockEnv'
import { languagesApi } from '@/api/languagesApi'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/utils/apiRequest')

jest.mock('@/utils/apiMap')

describe('Service: languages', () => {
  it('should call to the apiRequest.get with correct url', async () => {
    const FAKE_API_RESPONSE = 'FAKE_API_RESPONSE'
    apiRequest.get.mockImplementationOnce(() => Promise.resolve(FAKE_API_RESPONSE))

    const languages = await languagesApi.getAvailableLanguages()

    expect(apiRequest.get).toHaveBeenCalledWith(apiMap.apiGatewayV2.v5.tools.ocr.languages())
    expect(languages).toEqual(FAKE_API_RESPONSE)
  })
})
