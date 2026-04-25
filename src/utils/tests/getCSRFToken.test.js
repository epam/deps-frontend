
import { mockEnv } from '@/mocks/mockEnv'
import { mockSessionStorageWrapper } from '@/mocks/mockSessionStorageWrapper'
import { apiMap } from '@/utils/apiMap'
import { getCSRFToken } from '@/utils/getCSRFToken'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/utils/sessionStorageWrapper', () => mockSessionStorageWrapper({
  token: 'mock',
  exp: 9610798575945,
}))

const mockToken = 'mockFromApiGet'

describe('Utils: getCSRFToken', () => {
  const mockApiGet = jest.fn(() => ({
    token: mockToken,
  }))

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call api and return correct token in case no tokenData is stored in the sessionStorage', async () => {
    sessionStorageWrapper.getItem.mockImplementationOnce(() => null)
    const token = await getCSRFToken(mockApiGet)
    expect(mockApiGet).nthCalledWith(1, apiMap.apiGatewayV2.v5.crossSiteRequestForgery())
    expect(token).toEqual(mockToken)
  })

  it('should call api and return correct token in case invalid tokenData is stored in the sessionStorage', async () => {
    sessionStorageWrapper.getItem.mockImplementationOnce(() => ({
      token: 'tokenMockToken',
      exp: '9610798575945',
    }))
    const token = await getCSRFToken(mockApiGet)
    expect(mockApiGet).nthCalledWith(1, apiMap.apiGatewayV2.v5.crossSiteRequestForgery())
    expect(token).toEqual(mockToken)
  })

  it('should call api and return correct token in case invalid tokenData is stored in the sessionStorage', async () => {
    sessionStorageWrapper.getItem.mockImplementationOnce(() => ({
      token: 'tokenMockToken',
      exp: 1610798575945,
    }))
    const token = await getCSRFToken(mockApiGet)
    expect(mockApiGet).nthCalledWith(1, apiMap.apiGatewayV2.v5.crossSiteRequestForgery())
    expect(token).toEqual(mockToken)
  })

  it('should not call api and return correct token stored in the sessionStorage', async () => {
    const token = await getCSRFToken(mockApiGet)
    expect(mockApiGet).not.toHaveBeenCalled()
    expect(token).toEqual('mock')
  })
})
