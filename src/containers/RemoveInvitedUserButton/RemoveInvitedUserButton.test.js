
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import { setSelection } from '@/actions/navigation'
import { fetchInvitedUsersByFilter } from '@/actions/orgUserManagement'
import { fetchDefaultInviteesMeta } from '@/actions/orgUserManagementPage'
import { Modal } from '@/components/Modal'
import { userSelector } from '@/selectors/authorization'
import { selectionSelector } from '@/selectors/navigation'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { RemoveInvitedUserButton } from './RemoveInvitedUserButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/api/iamApi', () => ({
  declineInvitedUsers: jest.fn(() => Promise.resolve()),
}))
jest.mock('@/actions/orgUserManagement', () => ({
  fetchInvitedUsersByFilter: jest.fn(),
}))
jest.mock('@/actions/orgUserManagementPage', () => ({
  fetchDefaultInviteesMeta: jest.fn(),
}))
jest.mock('@/actions/navigation', () => ({
  setSelection: jest.fn(),
}))

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

jest.mock('@/selectors/navigation')
jest.mock('@/selectors/authorization')

const {
  mapStateToProps,
  mapDispatchToProps,
  ConnectedComponent,
} = RemoveInvitedUserButton

describe('Container: RemoveInvitedUserButton', () => {
  describe('mapDispatchToProps', () => {
    it('should pass fetchInvitedUsersByFilter action as fetchInvitedUsersByFilter property', () => {
      const { props } = mapDispatchToProps()

      props.fetchInvitedUsersByFilter()
      expect(fetchInvitedUsersByFilter).toHaveBeenCalledTimes(1)
    })

    it('should pass fetchDefaultInviteesMeta action as fetchDefaultInviteesMeta property', () => {
      const { props } = mapDispatchToProps()

      props.fetchDefaultInviteesMeta()
      expect(fetchDefaultInviteesMeta).toHaveBeenCalledTimes(1)
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
  })

  describe('ConnectedComponent', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        invitedUser: 'user@mail.com',
        selectedUsers: selectionSelector.getSelectorMockValue(),
        setSelection: jest.fn(),
        user: userSelector.getSelectorMockValue(),
        fetchInvitedUsersByFilter: jest.fn(),
        fetchDefaultInviteesMeta: jest.fn(() => Promise.resolve({
          meta: {
            total: 1,
            size: 1,
          },
        })),
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

    it('should show confirmation dialog on clicking RemoveWaitingUserButton', () => {
      Modal.confirm = jest.fn()
      wrapper.props().onClick()
      expect(Modal.confirm).toHaveBeenCalledTimes(1)
    })

    it('should call fetchInvitedUsersByFilter with correct arguments when clicking RemoveInvitedUserButton', async () => {
      Modal.confirm = jest.fn().mockImplementationOnce((config) => config.onOk())
      await wrapper.props().onClick()
      expect(defaultProps.fetchInvitedUsersByFilter)
        .nthCalledWith(1, defaultProps.user.organisation.pk, defaultProps.filter)
    })

    it('should call fetchDefaultInviteesMeta with correct arguments when clicking RemoveInvitedUserButton', async () => {
      Modal.confirm = jest.fn().mockImplementationOnce((config) => config.onOk())
      await wrapper.props().onClick()
      expect(defaultProps.fetchDefaultInviteesMeta)
        .nthCalledWith(1, defaultProps.user.organisation.pk)
    })

    it('should call action setSelection after delete invited users', async () => {
      Modal.confirm = jest.fn().mockImplementationOnce((config) => config.onOk())
      await wrapper.props().onClick()
      await flushPromises()
      expect(defaultProps.setSelection).nthCalledWith(1, null)
    })

    it('should call func goTo if meta.total qual 0', async () => {
      defaultProps.fetchDefaultInviteesMeta = jest.fn(() => Promise.resolve({
        meta: {
          total: 0,
          size: 0,
        },
      }))
      Modal.confirm = jest.fn().mockImplementationOnce((config) => config.onOk())
      wrapper.setProps(defaultProps)
      await wrapper.props().onClick()
      await flushPromises()
      expect(goTo).nthCalledWith(1, navigationMap.management.organisationUsers())
    })
  })
})
