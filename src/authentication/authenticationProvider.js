
import { AuthType } from '@/enums/AuthType'
import { ENV } from '@/utils/env'
import { NoAuth } from './NoAuth'
import { Oidc } from './Oidc'

const getProvider = () => {
  switch (ENV.AUTH_TYPE) {
    case AuthType.OIDC:
      return new Oidc()
    case AuthType.NO_AUTH:
      return new NoAuth()
    default:
      return new NoAuth()
  }
}

const authenticationProvider = getProvider()

export {
  authenticationProvider,
}
