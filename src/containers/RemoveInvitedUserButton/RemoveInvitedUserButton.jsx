
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'
import { connect } from 'react-redux'
import { setSelection } from '@/actions/navigation'
import { fetchInvitedUsersByFilter } from '@/actions/orgUserManagement'
import { fetchDefaultInviteesMeta } from '@/actions/orgUserManagementPage'
import { declineInvitedUsers } from '@/api/iamApi'
import { Button } from '@/components/Button'
import { DeleteIconFilled } from '@/components/Icons/DeleteIconFilled'
import { Modal } from '@/components/Modal'
import { TableActionIcon } from '@/components/TableActionIcon'
import { Tooltip } from '@/components/Tooltip'
import { localize, Localization } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { filterSelector, selectionSelector } from '@/selectors/navigation'
import { navigationMap } from '@/utils/navigationMap'
import { notifyWarning } from '@/utils/notification'
import { goTo } from '@/utils/routerActions'

const RemoveInvitedUserButton = ({
  user,
  fetchInvitedUsersByFilter,
  fetchDefaultInviteesMeta,
  invitedUser,
  selectedUsers,
  setSelection,
  filter,
}) => {
  const confirmRemoval = () => {
    Modal.confirm({
      title: localize(Localization.REMOVE_INVITEES_MESSAGE),
      onOk: handleRemove,
    })
  }

  const handleRemove = async () => {
    const userToDelete = invitedUser ? [invitedUser] : selectedUsers

    try {
      await declineInvitedUsers(userToDelete, user.organisation.pk)
      const [, data] = await Promise.all([
        fetchInvitedUsersByFilter(user.organisation.pk, filter),
        fetchDefaultInviteesMeta(user.organisation.pk),
      ])
      if (data.meta?.total === 0) {
        goTo(navigationMap.management.organisationUsers())
      }
      setSelection(null)
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  }

  if (invitedUser) {
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

RemoveInvitedUserButton.propTypes = {
  invitedUser: PropTypes.string,
  selectedUsers: isRequiredIf(PropTypes.arrayOf(PropTypes.string), (props) => !props.invitedUser),
  setSelection: PropTypes.func.isRequired,
  user: userShape.isRequired,
  filter: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }),
  fetchInvitedUsersByFilter: PropTypes.func.isRequired,
  fetchDefaultInviteesMeta: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  selectedUsers: selectionSelector(state),
  user: userSelector(state),
  filter: filterSelector(state),
})

const mapDispatchToProps = {
  setSelection,
  fetchInvitedUsersByFilter,
  fetchDefaultInviteesMeta,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(RemoveInvitedUserButton)

export {
  ConnectedComponent as RemoveInvitedUserButton,
}
