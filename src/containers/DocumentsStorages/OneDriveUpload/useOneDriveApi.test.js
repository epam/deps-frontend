
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import React from 'react'
import { useOneDriveApi } from './useOneDriveApi'

const mockTokenResponse = {
  accessToken: 'token',
}

const mockLoginResponse = {
  account: 'account',
  idToken: 'idToken',
}

const mockScope = ['OneDrive.Read']

const mockLoginCallback = jest.fn(() => Promise.resolve(mockLoginResponse))
const mockGetTokenCallback = jest.fn(() => Promise.resolve(mockTokenResponse))
const mockPostCallback = jest.fn()
const mockContent = 'content'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@microsoft/microsoft-graph-client', () => ({
  Client: {
    self: this,
    init: jest.fn(),
    api: jest.fn(() => ({
      post: mockPostCallback,
    })),
  },
  BatchRequestContent: function () {
    this.getContent = jest.fn(() => mockContent)
  },
}))

jest.mock('@azure/msal-browser', () => ({
  PublicClientApplication: function () {
    this.initialize = jest.fn()
    this.acquireTokenSilent = mockGetTokenCallback
    this.loginPopup = mockLoginCallback
    this.setActiveAccount = jest.fn()
  },
}))

const Wrapper = () => (
  <div {...useOneDriveApi()} />
)

describe('Hook: useOneDriveApi', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Wrapper />)
  })

  it('should return access token when call getToken method and user is already authorized', async () => {
    const props = wrapper.props()

    const token = await props.getToken(mockScope)

    expect(token).toBe(mockTokenResponse.accessToken)
  })

  it('should call login popup method when call getToken method and user is not authorized', async () => {
    mockGetTokenCallback.mockImplementationOnce(() => Promise.reject(new Error('test')))

    wrapper = shallow(<Wrapper />)
    const props = wrapper.props()

    await props.getToken(mockScope)

    expect(mockLoginCallback).nthCalledWith(1, {
      scopes: mockScope,
    })
  })

  it('should return access token when call getToken method and user is not authorized', async () => {
    mockGetTokenCallback.mockImplementationOnce(() => Promise.reject(new Error('test')))

    wrapper = shallow(<Wrapper />)
    const props = wrapper.props()
    const token = await props.getToken(mockScope)

    expect(token).toBe(mockTokenResponse.accessToken)
  })

  it('should make post request with correct url and permission for every file', async () => {
    const props = wrapper.props()
    const filesIds = ['fileId']

    await props.sharePermissions(filesIds)

    expect(mockPostCallback).nthCalledWith(1, mockContent)
  })
})
