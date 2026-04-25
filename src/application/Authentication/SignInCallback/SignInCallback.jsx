
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { goTo } from '@/actions/navigation'
import { authenticationProvider } from '@/authentication'
import { ErrorFallback } from '@/components/ErrorFallback'
import { POST_SIGN_IN_REDIRECT_URL } from '@/constants/storage'
import { StatusCode } from '@/enums/StatusCode'
import { navigationMap } from '@/utils/navigationMap'
import { parseResponseFromErrorMessage } from '@/utils/parseResponseFromErrorMessage'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'

const SignInCallback = () => {
  const dispatch = useDispatch()
  const [error, setError] = useState(null)

  const getPostSignInRedirectUrl = () => {
    const redirectUrl = sessionStorageWrapper.getItem(POST_SIGN_IN_REDIRECT_URL)

    return (
      redirectUrl.includes(navigationMap.error())
        ? navigationMap.base()
        : redirectUrl.replace(window.location.origin, '')
    )
  }

  const signInCallback = useCallback(async () => {
    try {
      await authenticationProvider.signInRedirectCallback()
      const postSignInRedirectUrl = getPostSignInRedirectUrl()
      dispatch(goTo(postSignInRedirectUrl))
    } catch (e) {
      setError(e)
    }
  }, [dispatch])

  useEffect(() => {
    signInCallback()
  }, [signInCallback])

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

  return null
}

export {
  SignInCallback,
}
