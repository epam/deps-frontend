
import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router'
import { storeUser } from '@/actions/authorization'
import { fetchOrganisations } from '@/actions/organisations'
import { iamApi } from '@/api/iamApi'
import { authenticationProvider } from '@/authentication'
import { Spin } from '@/components/Spin'
import { StatusCode } from '@/enums/StatusCode'
import { localize, Localization } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { navigationMap } from '@/utils/navigationMap'
import { notifyError } from '@/utils/notification'
import { goTo } from '@/utils/routerActions'

const JoiningPage = ({
  user,
  storeUser,
  fetchOrganisations,
}) => {
  const { orgPk } = useParams()

  const join = useCallback(async () => {
    if (orgPk === user?.organisation?.pk) {
      goTo(navigationMap.home())
      return
    }

    try {
      const updatedUser = await iamApi.join(orgPk)
      await fetchOrganisations()
      goTo(navigationMap.home(), { showGreeting: true })
      storeUser(updatedUser)
    } catch (e) {
      switch (e.response.status) {
        case StatusCode.NOT_FOUND:
          goTo(navigationMap.error.rootNotFound())
          break
        case StatusCode.FORBIDDEN:
          goTo(navigationMap.waitingApproval())
          break
        default:
          notifyError(localize(Localization.ERROR_JOIN_PAGE))
          authenticationProvider.signOut()
          break
      }
    }
  }, [
    orgPk,
    user?.organisation?.pk,
    fetchOrganisations,
    storeUser,
  ])

  useEffect(() => {
    join()
  }, [join])

  return <Spin.Centered spinning />
}

JoiningPage.propTypes = {
  user: userShape,
  storeUser: PropTypes.func.isRequired,
  fetchOrganisations: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const mapDispatchToProps = {
  storeUser,
  fetchOrganisations,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(JoiningPage)

export {
  ConnectedComponent as JoiningPage,
}
