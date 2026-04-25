
import { useEffect, useState, useCallback } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import { authenticationProvider } from '@/authentication'
import { ErrorFallback } from '@/components/ErrorFallback'
import { Spin } from '@/components/Spin'
import { POST_SIGN_IN_REDIRECT_URL } from '@/constants/storage'
import { StatusCode } from '@/enums/StatusCode'
import { navigationMap } from '@/utils/navigationMap'
import { parseResponseFromErrorMessage } from '@/utils/parseResponseFromErrorMessage'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'

const SignIn = () => {
  const [error, setError] = useState(null)
  const location = useLocation()

  const signIn = useCallback(async () => {
    try {
      sessionStorageWrapper.setItem(POST_SIGN_IN_REDIRECT_URL, location.state)
      await authenticationProvider.signIn()
    } catch (err) {
      setError(err)
    }
  }, [location])

  useEffect(() => {
    signIn()
  },
  [signIn],
  )

  if (error) {
    const response = parseResponseFromErrorMessage(error.message)

    if (response?.code === StatusCode.SERVICE_UNAVAILABLE) {
      return (
        <Redirect to={
          {
            pathname: navigationMap.error.serviceUnavailable(),
            state: window.location.href,
          }
        }
        />
      )
    }
    return <ErrorFallback />
  }

  return <Spin.Centered spinning />
}

export {
  SignIn,
}
