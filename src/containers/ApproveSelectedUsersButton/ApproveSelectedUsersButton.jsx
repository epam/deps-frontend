
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { connect } from 'react-redux'
import { setSelection } from '@/actions/navigation'
import { fetchWaitingForApprovalUsersByFilter } from '@/actions/orgUserManagement'
import { fetchDefaultWaitingsMeta } from '@/actions/orgUserManagementPage'
import { approveUsers } from '@/api/iamApi'
import { Button } from '@/components/Button'
import { UserCheckIcon } from '@/components/Icons/UserCheckIcon'
import { Tooltip } from '@/components/Tooltip'
import { localize, Localization } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { filterSelector, selectionSelector } from '@/selectors/navigation'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const ApproveSelectedUsersButton = ({
  selectedUsers,
  setSelection,
  user,
  fetchWaitingForApprovalUsersByFilter,
  fetchDefaultWaitingsMeta,
  filter,
}) => {
  const handleApprove = useCallback(
    async () => {
      try {
        await approveUsers(selectedUsers, user.organisation.pk)

        if (selectedUsers.length > 1) {
          notifySuccess(localize(
            Localization.APPROVE_SEVERAL_USERS,
            { number: selectedUsers.length }),
          )
        } else {
          notifySuccess(localize(
            Localization.APPROVE_USER_MESSAGE,
            { name: selectedUsers[0] }),
          )
        }

        await Promise.all([fetchWaitingForApprovalUsersByFilter(user.organisation.pk, filter), fetchDefaultWaitingsMeta(user.organisation.pk)])
        setSelection(null)
      } catch {
        notifyWarning(localize(Localization.DEFAULT_ERROR))
      }
    }, [
      selectedUsers,
      user.organisation.pk,
      fetchWaitingForApprovalUsersByFilter,
      filter,
      fetchDefaultWaitingsMeta,
      setSelection,
    ])

  return (
    <Tooltip title={localize(Localization.APPROVE_SELECTED)}>
      <Button.Secondary
        disabled={!selectedUsers.length}
        icon={<UserCheckIcon />}
        onClick={handleApprove}
      />
    </Tooltip>
  )
}
const mapStateToProps = (state) => ({
  selectedUsers: selectionSelector(state),
  user: userSelector(state),
  filter: filterSelector(state),
})

const mapDispatchToProps = {
  setSelection,
  fetchWaitingForApprovalUsersByFilter,
  fetchDefaultWaitingsMeta,
}

ApproveSelectedUsersButton.propTypes = {
  selectedUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelection: PropTypes.func.isRequired,
  user: userShape.isRequired,
  fetchWaitingForApprovalUsersByFilter: PropTypes.func.isRequired,
  fetchDefaultWaitingsMeta: PropTypes.func.isRequired,
  filter: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }),
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(ApproveSelectedUsersButton)

export {
  ConnectedComponent as ApproveSelectedUsersButton,
}
