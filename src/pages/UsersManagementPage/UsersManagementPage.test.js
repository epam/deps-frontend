import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { useLocation } from 'react-router'
import { goTo } from '@/actions/navigation'
import { useGetOrganisationUsersQuery } from '@/apiRTK/iamApi'
import { BASE_ORG_USERS_FILTER_CONFIG } from '@/models/OrgUserFilterConfig'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { userSelector } from '@/selectors/authorization'
import { orgDefaultInviteesMetaSelector, orgDefaultWaitingsMetaSelector } from '@/selectors/orgUserManagementPage'
import { navigationMap } from '@/utils/navigationMap'
import { Tabs, Header } from './UsersManagementPage.styles'
import { UsersManagementPage } from '.'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/authorization')
jest.mock('@/selectors/orgUserManagementPage')
jest.mock('@/containers/OrganisationUsersTable', () => mockComponent('OrganisationUsersTable'))
jest.mock('@/containers/InviteesTabTitle', () => mockComponent('InviteesTabTitle'))
jest.mock('@/containers/InvitedUsers', () => mockComponent('InvitedUsers'))
jest.mock('@/containers/WaitingForApproval', () => mockComponent('WaitingForApproval'))
jest.mock('@/containers/WaitingForApproval/WaitingForApprovalTabTitle', () => mockComponent('WaitingForApprovalTabTitle'))
jest.mock('@/containers/OrganisationUsersTableCommands', () => mockComponent('OrganisationUsersTableCommands'))
jest.mock('@/containers/WaitingForApprovalTableCommands', () => mockComponent('WaitingForApprovalTableCommands'))
jest.mock('@/containers/RemoveInvitedUserButton', () => mockComponent('RemoveInvitedUserButton'))
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(() => ({
    pathname: 'mockPath',
  })),
}))
jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(),
}))

jest.mock('@/apiRTK/iamApi')

const filters = {
  ...BASE_ORG_USERS_FILTER_CONFIG,
  ...DefaultPaginationConfig,
}

const { ConnectedComponent, mapStateToProps, mapDispatchToProps } = UsersManagementPage

describe('Container: UsersManagementPage', () => {
  describe('mapStateToProps', () => {
    it('should call to orgDefaultInviteesMetaSelector with state and pass the result as inviteesDefaultMeta prop', () => {
      const { props } = mapStateToProps()
      expect(orgDefaultInviteesMetaSelector).toHaveBeenCalled()
      expect(props.inviteesDefaultMeta).toEqual(orgDefaultInviteesMetaSelector.getSelectorMockValue())
    })

    it('should call to orgDefaultWaitingsMetaSelector with state and pass the result as waitingsDefaultMeta prop', () => {
      const { props } = mapStateToProps()
      expect(orgDefaultWaitingsMetaSelector).toHaveBeenCalled()
      expect(props.waitingsDefaultMeta).toEqual(orgDefaultWaitingsMetaSelector.getSelectorMockValue())
    })
  })

  describe('mapDispatchToProps', () => {
    it('should call to goTo action when calling to goTo prop', () => {
      const { props } = mapDispatchToProps()

      props.goTo()
      expect(goTo).toHaveBeenCalled()
    })
  })

  describe('Component: ConnectedComponent', () => {
    let wrapper
    let defaultProps

    beforeEach(() => {
      defaultProps = {
        goTo: jest.fn(),
        user: userSelector.getSelectorMockValue(),
        waitingsDefaultMeta: orgDefaultWaitingsMetaSelector.getSelectorMockValue(),
        inviteesDefaultMeta: orgDefaultInviteesMetaSelector.getSelectorMockValue(),
      }

      useGetOrganisationUsersQuery.mockImplementation(jest.fn(() => ({
        data: {
          result: [userSelector.getSelectorMockValue()],
          meta: { total: 0 },
        },
      })))

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render page correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should call useGetOrganisationUsersQuery once with correct args', () => {
      const { user } = defaultProps
      expect(useGetOrganisationUsersQuery).nthCalledWith(1, {
        orgPk: user.organisation.pk,
        filters,
      })
    })

    it('should render tabs correctly', () => {
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
      const tabs = wrapper.find(Tabs).props().tabs
      tabs.map((tab) => {
        const TabWrapper = shallow(<div>{tab.children}</div>)
        expect(TabWrapper).toMatchSnapshot()
      })
    })

    it('should show "invited" tab if total of the invitees is not 0', () => {
      const tabs = wrapper.find(Tabs).props().tabs
      const tab = tabs.find((tab) => tab.key === navigationMap.management.invitees())
      expect(tab.hiddenPane).toBe(false)
    })

    it('should show "Waiting for approval" tab if total of the waitingForApprovalUser is not 0', () => {
      const tabs = wrapper.find(Tabs).props().tabs
      const tab = tabs.find((tab) => tab.key === navigationMap.management.waitingForApproval())
      expect(tab.hiddenPane).toBe(false)
    })

    it('should not show "invited" tab if total of the invitees is 0', () => {
      defaultProps.inviteesDefaultMeta = {
        total: 0,
      }
      wrapper.setProps(defaultProps)
      const tabs = wrapper.find(Tabs).props().tabs
      const tab = tabs.find((tab) => tab.key === navigationMap.management.invitees())
      expect(tab.hiddenPane).toBe(true)
    })

    it('should not show "Waiting for approval" tab if total of the waitingForApprovalUser is 0', () => {
      defaultProps.waitingsDefaultMeta = {
        total: 0,
      }
      wrapper.setProps(defaultProps)
      const tabs = wrapper.find(Tabs).props().tabs
      const tab = tabs.find((tab) => tab.key === navigationMap.management.waitingForApproval())
      expect(tab.hiddenPane).toBe(true)
    })

    it('should render correct tab commands depends on pathname', () => {
      const pathNames = [
        navigationMap.management.organisationUsers(),
        navigationMap.management.waitingForApproval(),
        navigationMap.management.invitees(),
      ]

      pathNames.forEach((path) => {
        useLocation.mockImplementationOnce(jest.fn(() => ({
          pathname: path,
        })))
        wrapper = shallow(<ConnectedComponent {...defaultProps} />)
        expect(wrapper.find(Header)).toMatchSnapshot()
      })
    })
  })
})
