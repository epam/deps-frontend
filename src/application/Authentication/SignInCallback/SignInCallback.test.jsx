
import { mockEnv } from '@/mocks/mockEnv'
import { mockSessionStorageWrapper } from '@/mocks/mockSessionStorageWrapper'
import { screen, waitFor } from '@testing-library/react'
import { Redirect } from 'react-router-dom'
import { goTo } from '@/actions/navigation'
import { authenticationProvider } from '@/authentication'
import { StatusCode } from '@/enums/StatusCode'
import { navigationMap } from '@/utils/navigationMap'
import { render } from '@/utils/rendererRTL'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'
import { SignInCallback } from './SignInCallback'

const mockUrl = 'mockUrl'

jest.mock('@/authentication', () => ({
  authenticationProvider: {
    signInRedirectCallback: jest.fn(),
  },
}))

jest.mock('@/utils/sessionStorageWrapper', () => mockSessionStorageWrapper('mockUrl'))
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(() => ({ type: '' })),
}))

jest.mock('@/components/ErrorFallback', () => ({
  ErrorFallback: () => 'ErrorFallback',
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Redirect: jest.fn(() => 'Redirect'),
}))

describe('Page: SignInCallback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render any layout', () => {
    const { container } = render(<SignInCallback />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should call authenticationProvider.signInRedirectCallback after rendering', async () => {
    render(<SignInCallback />)
    expect(authenticationProvider.signInRedirectCallback).toHaveBeenCalled()
  })

  it('should dispatch goTo action with correct payload', async () => {
    render(<SignInCallback />)
    await waitFor(async () => {
      expect(goTo).nthCalledWith(1, mockUrl)
    })
  })

  it('should dispatch goTo action with correct payload if redirectUrl is error/unauthorized', async () => {
    sessionStorageWrapper.getItem.mockImplementationOnce(() => navigationMap.error.unauthorized())
    render(<SignInCallback />)
    await waitFor(async () => {
      expect(goTo).nthCalledWith(1, navigationMap.base())
    })
  })

  it('should render ErrorFallback if sign in failed', async () => {
    const mockError = new Error('error')
    authenticationProvider.signInRedirectCallback.mockImplementationOnce(() => Promise.reject(mockError))
    render(<SignInCallback />)
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
    authenticationProvider.signInRedirectCallback.mockImplementationOnce(() => Promise.reject(mockError))
    render(<SignInCallback />)
    expect(goTo).not.toBeCalled()
    await waitFor(async () => {
      expect(Redirect).toHaveBeenCalledWith(redirectTo, {})
    })
  })
})
