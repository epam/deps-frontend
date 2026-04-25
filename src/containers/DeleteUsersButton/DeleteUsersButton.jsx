
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setSelection } from '@/actions/navigation'
import { useDeleteOrganisationUsersMutation, useGetOrganisationUsersQuery } from '@/apiRTK/iamApi'
import { authenticationProvider } from '@/authentication'
import { Button } from '@/components/Button'
import { DeleteIconFilled } from '@/components/Icons/DeleteIconFilled'
import { Modal } from '@/components/Modal'
import { Tooltip } from '@/components/Tooltip'
import { localize, Localization } from '@/localization/i18n'
import { BASE_ORG_USERS_FILTER_CONFIG } from '@/models/OrgUserFilterConfig'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { selectionSelector } from '@/selectors/navigation'
import { notifyWarning } from '@/utils/notification'

const DEFAULT_FILTER = {
  ...BASE_ORG_USERS_FILTER_CONFIG,
  ...DefaultPaginationConfig,
}

const DeleteUsersButton = ({
  selectedUsers,
  setSelection,
  user,
}) => {
  const [deleteUsers] = useDeleteOrganisationUsersMutation()
  const { data: orgUsers } = useGetOrganisationUsersQuery({
    orgPk: user.organisation.pk,
    filters: DEFAULT_FILTER,
  })
  const deleteOrganisationUsers = async () => {
    try {
      const { deletedUsers } = await deleteUsers({
        userIds: selectedUsers,
        orgPk: user.organisation.pk,
      }).unwrap()

      if (deletedUsers.includes(user.pk)) {
        return await authenticationProvider.signOut()
      }

      setSelection(null)
    } catch {
      notifyWarning(localize(Localization.USER_DELETION_ERROR_STATUS))
    }
  }

  const handleDelete = () => {
    if (selectedUsers.length === orgUsers?.meta?.total) {
      notifyWarning(localize(Localization.ALL_USERS_DELETION))
      return
    }
    showDeleteConfirm()
  }

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: localize(Localization.USER_DELETION_MESSAGE),
      onOk: deleteOrganisationUsers,
    })
  }

  return (
    <Tooltip title={localize(Localization.REMOVE_SELECTED_USER)}>
      <Button.Secondary
        disabled={!selectedUsers.length}
        icon={<DeleteIconFilled />}
        onClick={handleDelete}
      />
    </Tooltip>
  )
}
const mapStateToProps = (state) => ({
  selectedUsers: selectionSelector(state),
  user: userSelector(state),
})

const mapDispatchToProps = {
  setSelection,
}

DeleteUsersButton.propTypes = {
  selectedUsers: PropTypes.arrayOf(PropTypes.string),
  setSelection: PropTypes.func.isRequired,
  user: userShape.isRequired,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(DeleteUsersButton)

export {
  ConnectedComponent as DeleteUsersButton,
}
