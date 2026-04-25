
import { useEffect } from 'react'
import { authenticationProvider } from '@/authentication'

const SilentRenew = () => {
  useEffect(
    () => {
      authenticationProvider.signInSilentCallback()
    },
    [],
  )

  return null
}

export {
  SilentRenew,
}
