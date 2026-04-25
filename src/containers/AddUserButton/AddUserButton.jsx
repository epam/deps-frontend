
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetOrganisationUsersQuery } from '@/apiRTK/iamApi'
import { Button } from '@/components/Button'
import { AddUserIcon } from '@/components/Icons/AddUserIcon'
import { Tooltip } from '@/components/Tooltip'
import { InviteDrawer } from '@/containers/InviteDrawer'
import { Localization, localize } from '@/localization/i18n'
import { userSelector } from '@/selectors/authorization'
import { filterSelector } from '@/selectors/navigation'

const AddUserButton = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const user = useSelector(userSelector)
  const filters = useSelector(filterSelector)

  const { refetch } = useGetOrganisationUsersQuery({
    orgPk: user.organisation.pk,
    filters,
  })

  const showInviteDrawer = () => setIsDrawerVisible(true)

  const onDrawerClose = () => setIsDrawerVisible(false)

  return (
    <>
      <Tooltip title={localize(Localization.ADD_USER)}>
        <Button.Secondary
          icon={<AddUserIcon />}
          onClick={showInviteDrawer}
        />
      </Tooltip>
      <InviteDrawer
        onClose={onDrawerClose}
        refetchUsers={refetch}
        visible={isDrawerVisible}
      />
    </>
  )
}

export {
  AddUserButton,
}
