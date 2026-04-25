
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import { setSelection } from '@/actions/navigation'
import { fetchWaitingForApprovalUsersByFilter } from '@/actions/orgUserManagement'
import { fetchDefaultWaitingsMeta } from '@/actions/orgUserManagementPage'
import { approveUsers } from '@/api/iamApi'
import { WaitingForApprovalUser } from '@/models/WaitingForApprovalUser'
import { userSelector } from '@/selectors/authorization'
import { orgDefaultWaitingsMetaSelector } from '@/selectors/orgUserManagementPage'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { ApproveUserButton } from './ApproveUserButton'

jest.mock('react-redux', () => mockReactRedux)

jest.mock('@/selectors/authorization')
jest.mock('@/selectors/orgUserManagementPage')

jest.mock('@/actions/orgUserManagement', () => ({
  fetchWaitingForApprovalUsersByFilter: jest.fn(),
}))
jest.mock('@/actions/orgUserManagementPage', () => ({
  fetchDefaultWaitingsMeta: jest.fn(),
}))
jest.mock('@/actions/navigation', () => ({
  setSelection: jest.fn(),
}))
jest.mock('@/api/iamApi', () => ({
  approveUsers: jest.fn(() => Promise.resolve()),
}))
jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

jest.mock('@/utils/notification', () => ({
  notifyWarning: jest.fn(),
  notifySuccess: jest.fn(),
}))
jest.mock('@/utils/env', () => mockEnv)

const waitingUser = new WaitingForApprovalUser({
  creationDate: 'date',
  email: 'email',
  firstName: 'name',
  lastName: '',
  organisation: 'org',
  pk: 'pk',
  username: '',
})

const {
  mapStateToProps,
  mapDispatchToProps,
  ConnectedComponent,
} = ApproveUserButton

describe('Container: ApproveUserButton', () => {
  describe('mapDispatchToProps', () => {
    it('should pass setSelection action as setSelection property', () => {
      const { props } = mapDispatchToProps()

      props.setSelection()
      expect(setSelection).toHaveBeenCalledTimes(1)
    })

    it('should pass fetchWaitingForApprovalUsersByFilter action as fetchWaitingForApprovalUsersByFilter property', () => {
      const { props } = mapDispatchToProps()

      props.fetchWaitingForApprovalUsersByFilter()
      expect(fetchWaitingForApprovalUsersByFilter).toHaveBeenCalledTimes(1)
    })

    it('should pass fetchDefaultWaitingsMeta action as fetchDefaultWaitingsMeta property', () => {
      const { props } = mapDispatchToProps()

      props.fetchDefaultWaitingsMeta()
      expect(fetchDefaultWaitingsMeta).toHaveBeenCalledTimes(1)
    })
  })

  describe('mapStateToProps', () => {
    it('should call userSelector and pass the result as user prop', () => {
      const { props } = mapStateToProps()

      expect(userSelector).toHaveBeenCalled()
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })

    it('should call orgDefaultWaitingsMetaSelector and pass the result as waitingsDefaultMeta prop', () => {
      const { props } = mapStateToProps()

      expect(orgDefaultWaitingsMetaSelector).toHaveBeenCalled()
      expect(props.waitingsDefaultMeta).toEqual(orgDefaultWaitingsMetaSelector.getSelectorMockValue())
    })
  })

  describe('ConnectedComponent', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        setSelection: jest.fn(),
        waitingUser,
        user: userSelector.getSelectorMockValue(),
        fetchWaitingForApprovalUsersByFilter: jest.fn(),
        fetchDefaultWaitingsMeta: jest.fn(),
        waitingsDefaultMeta: orgDefaultWaitingsMetaSelector.getSelectorMockValue(),
        filter: {
          page: 1,
          perPage: 10,
        },
      }
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should call action setSelection after approve users', async () => {
      await wrapper.props().onClick()
      await flushPromises()
      expect(defaultProps.setSelection).nthCalledWith(1, null)
    })

    it('should call fetchOrganisationUsersByFilter with correct arguments', async () => {
      await wrapper.props().onClick()
      expect(defaultProps.fetchWaitingForApprovalUsersByFilter)
        .nthCalledWith(1, defaultProps.user.organisation.pk, defaultProps.filter)
    })

    it('should call fetchDefaultWaitingsMeta with correct arguments', async () => {
      await wrapper.props().onClick()
      expect(defaultProps.fetchDefaultWaitingsMeta)
        .nthCalledWith(1, defaultProps.user.organisation.pk)
    })

    it('should call approveUsers with correct arguments when clicking ApproveUserButton', async () => {
      await wrapper.props().onClick()
      expect(approveUsers).nthCalledWith(
        1,
        [defaultProps.waitingUser.pk],
        defaultProps.user.organisation.pk,
      )
    })

    it('should call goTo function if waitingsDefaultMeta.total equal 0', async () => {
      defaultProps.waitingsDefaultMeta = {
        total: 0,
        size: 0,
      }
      wrapper.setProps(defaultProps)
      wrapper.props().onClick()
      await flushPromises()
      expect(goTo).nthCalledWith(1, navigationMap.management.organisationUsers())
    })
  })
})
