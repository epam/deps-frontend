
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'
import { connect } from 'react-redux'
import { setSelection } from '@/actions/navigation'
import { fetchWaitingForApprovalUsersByFilter } from '@/actions/orgUserManagement'
import { fetchDefaultWaitingsMeta } from '@/actions/orgUserManagementPage'
import { declineWaitingUsers } from '@/api/iamApi'
import { Button } from '@/components/Button'
import { DeleteIconFilled } from '@/components/Icons/DeleteIconFilled'
import { Modal } from '@/components/Modal'
import { TableActionIcon } from '@/components/TableActionIcon'
import { Tooltip } from '@/components/Tooltip'
import { localize, Localization } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { waitingForApprovalUserShape } from '@/models/WaitingForApprovalUser'
import { userSelector } from '@/selectors/authorization'
import { filterSelector, selectionSelector } from '@/selectors/navigation'
import { orgDefaultWaitingsMetaSelector } from '@/selectors/orgUserManagementPage'
import { navigationMap } from '@/utils/navigationMap'
import { notifyWarning } from '@/utils/notification'
import { goTo } from '@/utils/routerActions'

const RemoveWaitingUserButton = ({
  user,
  fetchWaitingForApprovalUsersByFilter,
  waitingUser,
  selectedUsers,
  filter,
  fetchDefaultWaitingsMeta,
  setSelection,
  waitingsDefaultMeta,
}) => {
  const confirmRemoval = () => {
    Modal.confirm({
      title: localize(Localization.DECLINE_REQUEST_OF_USER),
      onOk: handleRemove,
    })
  }

  const handleRemove = async () => {
    const userToDelete = waitingUser ? [waitingUser.pk] : selectedUsers

    try {
      await declineWaitingUsers(userToDelete, user.organisation.pk)

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
  }

  if (waitingUser) {
    return (
      <TableActionIcon
        icon={<DeleteIconFilled />}
        onClick={confirmRemoval}
        tooltip={
          {
            title: localize(Localization.REMOVE_USER),
          }
        }
      />
    )
  }

  return (
    <Tooltip title={localize(Localization.REMOVE_SELECTED_USER)}>
      <Button.Secondary
        disabled={!selectedUsers.length}
        icon={<DeleteIconFilled />}
        onClick={confirmRemoval}
      />
    </Tooltip>
  )
}

RemoveWaitingUserButton.propTypes = {
  waitingUser: waitingForApprovalUserShape,
  selectedUsers: isRequiredIf(PropTypes.arrayOf(PropTypes.string), (props) => !props.waitingUser),
  user: userShape.isRequired,
  filter: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }),
  fetchWaitingForApprovalUsersByFilter: PropTypes.func.isRequired,
  fetchDefaultWaitingsMeta: PropTypes.func.isRequired,
  setSelection: PropTypes.func.isRequired,
  waitingsDefaultMeta: PropTypes.shape({
    total: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
  }).isRequired,
}

const mapStateToProps = (state) => ({
  selectedUsers: selectionSelector(state),
  user: userSelector(state),
  filter: filterSelector(state),
  waitingsDefaultMeta: orgDefaultWaitingsMetaSelector(state),
})

const mapDispatchToProps = {
  fetchWaitingForApprovalUsersByFilter,
  fetchDefaultWaitingsMeta,
  setSelection,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(RemoveWaitingUserButton)

export {
  ConnectedComponent as RemoveWaitingUserButton,
}
