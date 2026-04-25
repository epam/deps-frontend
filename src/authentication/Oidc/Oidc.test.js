
import { mockEnv } from '@/mocks/mockEnv'
import { UserManager } from 'oidc-client-ts'
import { ENV } from '@/utils/env'
import { Oidc } from './Oidc'

jest.mock('@/utils/env', () => mockEnv)

const realmPostfix = ENV.AUTH_REALM ? `/auth/realms/${ENV.AUTH_REALM}` : ''

const AUTHORITY = `${ENV.AUTH_BASE_URL}${realmPostfix}`

const USER_STORE_KEY = `oidc.user:${AUTHORITY}:${ENV.AUTH_CLIENT_ID}`

const ONE_MINUTE = 60

const getMockExpirationTime = () => Math.round(Date.now() / 1000)

const mockUser = {
  access_token: 'access_token',
  expires_at: getMockExpirationTime(),
  profile: {
    email: 'mick_duo21@system.com',
    given_name: 'Mick',
    family_name: 'Duo',
    groups: ['Deps'],
  },
}

const mockGetSync = jest.fn(() => mockUser)

jest.mock('./OidcStore', () => ({
  OidcStore: function () {
    this.getSync = (k) => mockGetSync(k)
  },
}))

jest.mock('oidc-client-ts', () => {
  let userLoadedListeners = []

  const manager = {
    events: {
      addAccessTokenExpired: jest.fn(),
    },
    settings: {
      metadata: {
        ping_end_session_endpoint: 'https://end.com',
      },
    },
    signinSilent: jest.fn(() => {
      const ONE_MINUTE = 60
      mockUser.expires_at += 5 * ONE_MINUTE
      return Promise.resolve()
    }),
    signinRedirect: jest.fn(() => {
      userLoadedListeners.forEach((listener) => listener(mockUser))
      return Promise.resolve(mockUser)
    }),
    signinRedirectCallback: jest.fn(() => {
      userLoadedListeners.forEach((listener) => listener(mockUser))
      return Promise.resolve(mockUser)
    }),
    signoutRedirect: jest.fn(() => Promise.resolve()),
  }

  return {
    UserManager: function () {
      userLoadedListeners = []
      this.events = manager.events
      this.settings = manager.settings
      this.signinRedirect = manager.signinRedirect
      this.signinRedirectCallback = manager.signinRedirectCallback
      this.signinSilent = manager.signinSilent
      this.signoutRedirect = manager.signoutRedirect
    },
  }
})

describe('Authentication: Oidc', () => {
  let oidc
  let manager

  beforeEach(() => {
    jest.clearAllMocks()
    mockUser.expires_at = getMockExpirationTime() + ONE_MINUTE
    delete window.location
    window.location = new URL('https://deps.com?code=code')
    manager = new UserManager()
    oidc = new Oidc()
  })

  it('should call storage getSync method with the appropriate key when getting access token', () => {
    oidc = new Oidc()
    oidc.getAccessToken()
    expect(mockGetSync).nthCalledWith(1, USER_STORE_KEY)
  })

  it('should call storage getSync method with the appropriate key when getting is authenticated', () => {
    oidc = new Oidc()
    oidc.isAuthenticated()
    expect(mockGetSync).nthCalledWith(1, USER_STORE_KEY)
  })

  it('should get user data from storage if it is not expired', () => {
    oidc = new Oidc()
    expect(oidc.isAuthenticated()).toEqual(true)
  })

  it('should not get user data from storage if it is expired', () => {
    mockUser.expires_at = 1
    mockGetSync.mockImplementationOnce(() => mockUser)
    oidc = new Oidc()
    expect(oidc.isAuthenticated()).toEqual(false)
  })

  it('should call signinRedirect when calling to oidc.signIn', async () => {
    await oidc.signIn()

    expect(manager.signinRedirect).toHaveBeenCalledWith()
  })

  it('should authenticated user when there is no code in the URL', async () => {
    await oidc.signIn()

    expect(oidc.isAuthenticated()).toEqual(true)
  })

  it('should return access token when calling to getAccessToken', async () => {
    await oidc.signIn()

    const token = oidc.getAccessToken()

    expect(token).toEqual('access_token')
  })

  it('should call signoutRedirect when calling to signOut', async () => {
    await oidc.signIn()
    await oidc.signOut()

    expect(manager.signoutRedirect).toHaveBeenCalledTimes(1)
  })
})
