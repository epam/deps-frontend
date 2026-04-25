
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { setSelection } from '@/actions/navigation'
import { fetchWaitingForApprovalUsersByFilter } from '@/actions/orgUserManagement'
import { fetchDefaultWaitingsMeta } from '@/actions/orgUserManagementPage'
import { approveUsers } from '@/api/iamApi'
import { Button } from '@/components/Button'
import { userSelector } from '@/selectors/authorization'
import { selectionSelector } from '@/selectors/navigation'
import { ApproveSelectedUsersButton } from './ApproveSelectedUsersButton'

jest.mock('react-redux', () => mockReactRedux)

jest.mock('@/actions/navigation', () => ({
  setSelection: jest.fn(),
}))
jest.mock('@/actions/orgUserManagement', () => ({
  fetchWaitingForApprovalUsersByFilter: jest.fn(),
}))
jest.mock('@/actions/orgUserManagementPage', () => ({
  fetchDefaultWaitingsMeta: jest.fn(),
}))
jest.mock('@/api/iamApi', () => ({
  approveUsers: jest.fn(() => Promise.resolve()),
}))
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/authorization')

jest.mock('@/utils/notification', () => ({
  notifyWarning: jest.fn(),
  notifySuccess: jest.fn(),
}))
jest.mock('@/utils/env', () => mockEnv)

const {
  mapStateToProps,
  mapDispatchToProps,
  ConnectedComponent,
} = ApproveSelectedUsersButton

describe('Container: ApproveSelectedUsersButton', () => {
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
        setSelection: jest.fn(),
        selectedUsers: selectionSelector.getSelectorMockValue(),
        user: userSelector.getSelectorMockValue(),
        fetchWaitingForApprovalUsersByFilter: jest.fn(),
        fetchDefaultWaitingsMeta: jest.fn(),
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
      await wrapper.find(Button.Secondary).props().onClick()
      expect(setSelection).toHaveBeenCalled()
    })

    it('should call fetchOrganisationUsersByFilter with correct arguments', async () => {
      await wrapper.find(Button.Secondary).props().onClick()
      expect(defaultProps.fetchWaitingForApprovalUsersByFilter)
        .nthCalledWith(1, defaultProps.user.organisation.pk, defaultProps.filter)
    })

    it('should call fetchDefaultWaitingsMeta with correct arguments', async () => {
      await wrapper.find(Button.Secondary).props().onClick()
      expect(defaultProps.fetchDefaultWaitingsMeta)
        .nthCalledWith(1, defaultProps.user.organisation.pk)
    })

    it('should call approveUsers with correct arguments when clicking ApproveSelectedUsersButton', async () => {
      await wrapper.find(Button.Secondary).props().onClick()
      expect(approveUsers).nthCalledWith(
        1,
        defaultProps.selectedUsers,
        defaultProps.user.organisation.pk,
      )
    })
  })
})
