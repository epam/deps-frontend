
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetOrganisationUsersQuery } from '@/apiRTK/iamApi'
import { UserIcon } from '@/components/Icons/UserIcon'
import { Spin } from '@/components/Spin'
import { PaginationKeys } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { BASE_ORG_USERS_FILTER_CONFIG } from '@/models/OrgUserFilterConfig'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { userSelector } from '@/selectors/authorization'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { openInNewTarget } from '@/utils/window'
import { Card } from '../Card'

const UsersCard = () => {
  const currentUser = useSelector(userSelector)

  const organizationUsersFilterConfig = useMemo(() => ({
    ...BASE_ORG_USERS_FILTER_CONFIG,
    ...DefaultPaginationConfig,
    [PaginationKeys.PER_PAGE]: 1,
  }), [])

  const { data: users, isLoading: areUsersFetching } = useGetOrganisationUsersQuery({
    orgPk: currentUser.organisation.pk,
    filters: organizationUsersFilterConfig,
  })

  const onClick = (event) => openInNewTarget(
    event,
    navigationMap.management.organisationUsers(),
    () => goTo(navigationMap.management.organisationUsers()),
  )

  return (
    <Spin spinning={areUsersFetching}>
      <Card
        count={users?.meta.total}
        icon={<UserIcon />}
        onClick={onClick}
        title={localize(Localization.USERS)}
      />
    </Spin>
  )
}

export {
  UsersCard,
}
