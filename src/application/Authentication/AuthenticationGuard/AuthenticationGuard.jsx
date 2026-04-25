
import { Redirect } from 'react-router-dom'
import { authenticationProvider } from '@/authentication'
import { navigationMap } from '@/utils/navigationMap'
import { childrenShape } from '@/utils/propTypes'

const AuthenticationGuard = ({ children }) => {
  if (!authenticationProvider.isAuthenticated()) {
    return (
      <Redirect to={
        {
          pathname: navigationMap.auth.signIn(),
          state: window.location.href,
        }
      }
      />
    )
  }

  return children
}

AuthenticationGuard.propTypes = {
  children: childrenShape.isRequired,
}

export {
  AuthenticationGuard,
}
