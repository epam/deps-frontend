
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router'
import { Switch } from 'react-router-dom'
import { goTo } from '@/actions/navigation'
import { useGetOrganisationUsersQuery } from '@/apiRTK/iamApi'
import { HeadingLevel } from '@/components/Heading'
import { Content } from '@/components/Layout'
import { Tab } from '@/components/Tabs'
import { InvitedUsers } from '@/containers/InvitedUsers'
import { InviteesTabTitle } from '@/containers/InviteesTabTitle'
import { OrganisationUsersTable } from '@/containers/OrganisationUsersTable'
import { OrganisationUsersTableCommands } from '@/containers/OrganisationUsersTableCommands'
import { RemoveInvitedUserButton } from '@/containers/RemoveInvitedUserButton'
import { WaitingForApproval } from '@/containers/WaitingForApproval'
import { WaitingForApprovalTabTitle } from '@/containers/WaitingForApproval/WaitingForApprovalTabTitle'
import { WaitingForApprovalTableCommands } from '@/containers/WaitingForApprovalTableCommands'
import { localize, Localization } from '@/localization/i18n'
import { BASE_ORG_USERS_FILTER_CONFIG } from '@/models/OrgUserFilterConfig'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { orgDefaultInviteesMetaSelector, orgDefaultWaitingsMetaSelector } from '@/selectors/orgUserManagementPage'
import { navigationMap } from '@/utils/navigationMap'
import {
  Title,
  Header,
  Tabs,
} from './UsersManagementPage.styles'

const DEFAULT_FILTER = {
  ...BASE_ORG_USERS_FILTER_CONFIG,
  ...DefaultPaginationConfig,
}

const USERS_TAB_LINK_TO_COMMANDS_COMPONENT = {
  [navigationMap.management.organisationUsers()]: <OrganisationUsersTableCommands />,
  [navigationMap.management.waitingForApproval()]: <WaitingForApprovalTableCommands />,
  [navigationMap.management.invitees()]: <RemoveInvitedUserButton />,
}

const UsersManagementPage = ({
  goTo,
  user,
  waitingsDefaultMeta,
  inviteesDefaultMeta,
}) => {
  const { pathname } = useLocation()

  const { data: defaultData } = useGetOrganisationUsersQuery({
    orgPk: user.organisation.pk,
    filters: DEFAULT_FILTER,
  })

  const usersTotal = defaultData?.meta?.total

  const isInviteesUserTabHidden = inviteesDefaultMeta?.total === 0

  const isWaitingForApprovalUserTabHidden = waitingsDefaultMeta?.total === 0

  const tabs = [
    new Tab(
      navigationMap.management.organisationUsers(),
      localize(Localization.ORGANISATION_USERS, { count: usersTotal }),
      <OrganisationUsersTable />,
    ),
    new Tab(
      navigationMap.management.invitees(),
      <InviteesTabTitle />,
      <InvitedUsers />,
      isInviteesUserTabHidden,
    ),
    new Tab(
      navigationMap.management.waitingForApproval(),
      <WaitingForApprovalTabTitle />,
      <WaitingForApproval />,
      isWaitingForApprovalUserTabHidden,
    ),
  ]

  const handleTabChange = (activeKey) => {
    goTo(activeKey)
  }

  return (
    <Content>
      <Header>
        <Title level={HeadingLevel.H2}>
          {localize(Localization.USER_MANAGEMENT_TITLE)}
        </Title>
        {USERS_TAB_LINK_TO_COMMANDS_COMPONENT[pathname]}
      </Header>
      <Switch>
        <Tabs
          activeKey={pathname}
          onChange={handleTabChange}
          tabs={tabs}
        />
      </Switch>
    </Content>
  )
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
  waitingsDefaultMeta: orgDefaultWaitingsMetaSelector(state),
  inviteesDefaultMeta: orgDefaultInviteesMetaSelector(state),
})

UsersManagementPage.propTypes = {
  goTo: PropTypes.func.isRequired,
  user: userShape,
  waitingsDefaultMeta: PropTypes.shape({
    total: PropTypes.number,
    size: PropTypes.number,
  }),
  inviteesDefaultMeta: PropTypes.shape({
    total: PropTypes.number,
    size: PropTypes.number,
  }),
}

const ConnectedComponent = connect(mapStateToProps, {
  goTo,
})(UsersManagementPage)

export {
  ConnectedComponent as UsersManagementPage,
}
