
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router'
import { Redirect } from 'react-router-dom'
import { fetchMe } from '@/actions/authorization'
import { fetchOrganisations } from '@/actions/organisations'
import { Spin } from '@/components/Spin'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { navigationMap } from '@/utils/navigationMap'
import { childrenShape } from '@/utils/propTypes'

const AuthorizationGuard = ({
  children,
  fetchMe,
  fetchOrganisations,
  user,
}) => {
  const { pathname } = useLocation()

  useEffect(() => {
    if (user) {
      return
    }

    (async () => {
      await fetchOrganisations()
      await fetchMe()
    })()
  }, [
    fetchMe,
    fetchOrganisations,
    user,
  ])

  if (!user) {
    return <Spin.Centered spinning />
  }

  if (
    !user.organisation?.pk &&
    !pathname.includes(navigationMap.join())
  ) {
    return <Redirect to={navigationMap.error.noUserOrganisation()} />
  }

  return children
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const ConnectedComponent = connect(mapStateToProps, {
  fetchMe,
  fetchOrganisations,
})(AuthorizationGuard)

AuthorizationGuard.propTypes = {
  user: userShape,
  fetchMe: PropTypes.func.isRequired,
  fetchOrganisations: PropTypes.func.isRequired,
  children: childrenShape.isRequired,
}

export {
  ConnectedComponent as AuthorizationGuard,
}
