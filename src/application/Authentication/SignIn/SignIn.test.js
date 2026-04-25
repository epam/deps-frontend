
import { mockEnv } from '@/mocks/mockEnv'
import { mockSessionStorageWrapper } from '@/mocks/mockSessionStorageWrapper'
import { screen, waitFor } from '@testing-library/react'
import { Redirect } from 'react-router-dom'
import { authenticationProvider } from '@/authentication'
import { POST_SIGN_IN_REDIRECT_URL } from '@/constants/storage'
import { StatusCode } from '@/enums/StatusCode'
import { navigationMap } from '@/utils/navigationMap'
import { render } from '@/utils/rendererRTL'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'
import { SignIn } from './SignIn'

const mockPath = 'http://localhost:8080'

jest.mock('@/utils/sessionStorageWrapper', () => mockSessionStorageWrapper())

jest.mock('@/components/ErrorFallback', () => ({
  ErrorFallback: () => 'ErrorFallback',
}))

jest.mock('@/components/Spin', () => ({
  Spin: {
    Centered: () => 'Spin',
  },
}))

jest.mock('@/authentication', () => ({
  authenticationProvider: {
    signIn: jest.fn(),
  },
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: mockPath,
  }),
  Redirect: jest.fn(() => 'Redirect'),
}))

jest.mock('@/utils/env', () => mockEnv)

describe('Page: SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should save postSignInRedirectUrl to sessionStorage after rendering', async () => {
    render(<SignIn />)
    expect(sessionStorageWrapper.setItem).nthCalledWith(1, POST_SIGN_IN_REDIRECT_URL, mockPath)
  })

  it('should call authenticationProvider.signIn after rendering', async () => {
    render(<SignIn />)
    expect(authenticationProvider.signIn).toHaveBeenCalled()
  })

  it('should render Spinner while waiting for sign in', async () => {
    render(<SignIn />)
    expect(screen.getByText('Spin')).toBeInTheDocument()
  })

  it('should render ErrorFallback if sign in failed', async () => {
    const mockError = new Error('error')
    authenticationProvider.signIn.mockImplementationOnce(() => Promise.reject(mockError))
    render(<SignIn />)
    await screen.findByText('ErrorFallback')
  })

  it('should redirect to Service unavailable page if sign in failed with the corresponding error', async () => {
    const redirectTo = {
      to: {
        pathname: navigationMap.error.serviceUnavailable(),
        state: window.location.href,
      },
    }
    const mockError = new Error(`StatusText (${StatusCode.SERVICE_UNAVAILABLE}): ${JSON.stringify({ code: StatusCode.SERVICE_UNAVAILABLE })}`)
    authenticationProvider.signIn.mockImplementationOnce(() => Promise.reject(mockError))
    render(<SignIn />)
    await waitFor(async () => {
      expect(Redirect).toHaveBeenCalledWith(redirectTo, {})
    })
  })
})
