
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { connect } from 'react-redux'
import { setSelection } from '@/actions/navigation'
import { fetchWaitingForApprovalUsersByFilter } from '@/actions/orgUserManagement'
import { fetchDefaultWaitingsMeta } from '@/actions/orgUserManagementPage'
import { approveUsers } from '@/api/iamApi'
import { UserCheckIcon } from '@/components/Icons/UserCheckIcon'
import { TableActionIcon } from '@/components/TableActionIcon'
import { localize, Localization } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { waitingForApprovalUserShape } from '@/models/WaitingForApprovalUser'
import { userSelector } from '@/selectors/authorization'
import { orgDefaultWaitingsMetaSelector } from '@/selectors/orgUserManagementPage'
import { navigationMap } from '@/utils/navigationMap'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { goTo } from '@/utils/routerActions'

const ApproveUserButton = ({
  waitingUser,
  setSelection,
  user,
  fetchWaitingForApprovalUsersByFilter,
  fetchDefaultWaitingsMeta,
  filter,
  waitingsDefaultMeta,
}) => {
  const handleApprove = useCallback(async () => {
    try {
      await approveUsers([waitingUser.pk], user.organisation.pk)
      notifySuccess(localize(
        Localization.APPROVE_USER_MESSAGE,
        { name: waitingUser.username }),
      )
      await Promise.all([
        fetchWaitingForApprovalUsersByFilter(user.organisation.pk, filter),
        fetchDefaultWaitingsMeta(user.organisation.pk),
      ])
      setSelection(null)
      if (waitingsDefaultMeta.total === 0) {
        goTo(navigationMap.management.organisationUsers())
      }
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  },
  [
    waitingUser.pk,
    waitingUser.username,
    user.organisation.pk,
    fetchWaitingForApprovalUsersByFilter,
    filter,
    fetchDefaultWaitingsMeta,
    setSelection,
    waitingsDefaultMeta,
  ])

  return (
    <TableActionIcon
      icon={<UserCheckIcon />}
      onClick={handleApprove}
      tooltip={
        {
          title: localize(Localization.APPROVE_USER),
        }
      }
    />
  )
}

ApproveUserButton.propTypes = {
  waitingUser: waitingForApprovalUserShape.isRequired,
  setSelection: PropTypes.func.isRequired,
  user: userShape.isRequired,
  filter: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }),
  fetchWaitingForApprovalUsersByFilter: PropTypes.func.isRequired,
  fetchDefaultWaitingsMeta: PropTypes.func.isRequired,
  waitingsDefaultMeta: PropTypes.shape({
    total: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
  }).isRequired,
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
  waitingsDefaultMeta: orgDefaultWaitingsMetaSelector(state),
})

const mapDispatchToProps = {
  setSelection,
  fetchWaitingForApprovalUsersByFilter,
  fetchDefaultWaitingsMeta,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(ApproveUserButton)

export {
  ConnectedComponent as ApproveUserButton,
}
