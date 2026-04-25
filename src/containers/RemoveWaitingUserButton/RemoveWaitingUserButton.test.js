
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import { setSelection } from '@/actions/navigation'
import { fetchWaitingForApprovalUsersByFilter } from '@/actions/orgUserManagement'
import { fetchDefaultWaitingsMeta } from '@/actions/orgUserManagementPage'
import { declineWaitingUsers } from '@/api/iamApi'
import { Modal } from '@/components/Modal'
import { WaitingForApprovalUser } from '@/models/WaitingForApprovalUser'
import { userSelector } from '@/selectors/authorization'
import { selectionSelector } from '@/selectors/navigation'
import { orgDefaultWaitingsMetaSelector } from '@/selectors/orgUserManagementPage'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { RemoveWaitingUserButton } from './RemoveWaitingUserButton'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/actions/orgUserManagement', () => ({
  fetchWaitingForApprovalUsersByFilter: jest.fn(),
}))
jest.mock('@/actions/orgUserManagementPage', () => ({
  fetchDefaultWaitingsMeta: jest.fn(),
}))
jest.mock('@/actions/navigation', () => ({
  setSelection: jest.fn(),
}))

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

jest.mock('@/api/iamApi', () => ({
  declineWaitingUsers: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/selectors/navigation')
jest.mock('@/selectors/authorization')
jest.mock('@/selectors/orgUserManagementPage')

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
} = RemoveWaitingUserButton

describe('Container: RemoveWaitingUserButton', () => {
  describe('mapDispatchToProps', () => {
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

    it('should pass setSelection action as setSelection property', () => {
      const { props } = mapDispatchToProps()

      props.setSelection()
      expect(setSelection).toHaveBeenCalledTimes(1)
    })
  })

  describe('mapStateToProps', () => {
    it('should call selectionSelector and pass the result as selectedUsers prop', () => {
      const { props } = mapStateToProps()

      expect(selectionSelector).toHaveBeenCalled()
      expect(props.selectedUsers).toEqual(selectionSelector.getSelectorMockValue())
    })

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
        waitingUser,
        selectedUsers: selectionSelector.getSelectorMockValue(),
        user: userSelector.getSelectorMockValue(),
        fetchWaitingForApprovalUsersByFilter: jest.fn(),
        fetchDefaultWaitingsMeta: jest.fn(),
        waitingsDefaultMeta: orgDefaultWaitingsMetaSelector.getSelectorMockValue(),
        filter: {
          page: 1,
          perPage: 10,
        },
        setSelection: jest.fn(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should show confirmation dialog on clicking RemoveWaitingUserButton', () => {
      Modal.confirm = jest.fn()
      wrapper.props().onClick()
      expect(Modal.confirm).toHaveBeenCalledTimes(1)
    })

    it('should call declineWaitingUsers with correct arguments when clicking RemoveWaitingUserButton', async () => {
      Modal.confirm = jest.fn().mockImplementationOnce((config) => config.onOk())
      await wrapper.props().onClick()
      expect(declineWaitingUsers)
        .nthCalledWith(1, [waitingUser.pk], defaultProps.user.organisation.pk)
    })

    it('should call fetchWaitingForApprovalUsersByFilter with correct arguments when clicking RemoveWaitingUserButton', async () => {
      Modal.confirm = jest.fn().mockImplementationOnce((config) => config.onOk())
      await wrapper.props().onClick()
      expect(defaultProps.fetchWaitingForApprovalUsersByFilter)
        .nthCalledWith(1, defaultProps.user.organisation.pk, defaultProps.filter)
    })

    it('should call fetchDefaultWaitingsMeta with correct arguments when clicking RemoveWaitingUserButton', async () => {
      Modal.confirm = jest.fn().mockImplementationOnce((config) => config.onOk())
      await wrapper.props().onClick()
      expect(defaultProps.fetchDefaultWaitingsMeta)
        .nthCalledWith(1, defaultProps.user.organisation.pk)
    })

    it('should call setSelection after removal of waiting users', async () => {
      Modal.confirm = jest.fn().mockImplementationOnce((config) => config.onOk())
      await wrapper.props().onClick()
      await flushPromises()
      expect(defaultProps.setSelection).toHaveBeenCalledTimes(1)
    })

    it('should call goTo function if waitingsDefaultMeta.total equal 0', async () => {
      defaultProps.waitingsDefaultMeta = {
        total: 0,
        size: 0,
      }
      Modal.confirm = jest.fn().mockImplementationOnce((config) => config.onOk())
      wrapper.setProps(defaultProps)
      wrapper.props().onClick()
      await flushPromises()
      expect(goTo).nthCalledWith(1, navigationMap.management.organisationUsers())
    })
  })
})
