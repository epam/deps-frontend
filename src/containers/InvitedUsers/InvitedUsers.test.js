
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { setFilters, setPagination, setSelection } from '@/actions/navigation'
import { fetchInvitedUsersByFilter } from '@/actions/orgUserManagement'
import { TableSortDirection, TableSorter } from '@/components/Table/TableSorter'
import { InviteesFilterKeys, PaginationKeys, SortDirection } from '@/constants/navigation'
import { userSelector } from '@/selectors/authorization'
import { filterSelector, selectionSelector } from '@/selectors/navigation'
import { orgUserManagementInviteesSelector } from '@/selectors/orgUserManagement'
import { orgUserManagementPageInviteesSelector } from '@/selectors/orgUserManagementPage'
import { InvitedUsers } from './InvitedUsers'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/authorization')
jest.mock('@/selectors/orgUserManagement')
jest.mock('@/selectors/orgUserManagementPage')
jest.mock('@/actions/navigation', () => ({
  setPagination: jest.fn(),
  setFilters: jest.fn(),
  setSelection: jest.fn(),
}))
jest.mock('@/actions/orgUserManagement', () => ({
  fetchInvitedUsersByFilter: jest.fn(),
}))
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/RemoveInvitedUserButton', () => mockComponent('RemoveInvitedUserButton'))

const { ConnectedComponent, mapStateToProps, mapDispatchToProps } = InvitedUsers

const mockState = 'mockState'

describe('Container: InvitedUsers', () => {
  describe('mapStateToProps', () => {
    it('should call to filterSelector with state and pass the result as filters prop', () => {
      const { props } = mapStateToProps(mockState)
      expect(filterSelector).toHaveBeenCalledWith(mockState)
      expect(props.filter).toEqual(filterSelector.getSelectorMockValue())
    })

    it('should call to userSelector with state and pass the result as user prop', () => {
      const { props } = mapStateToProps(mockState)
      expect(userSelector).toHaveBeenCalledWith(mockState)
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })

    it('should call to orgUserManagementInviteesSelector with state and pass the result as invitees prop', () => {
      const { props } = mapStateToProps(mockState)
      expect(orgUserManagementInviteesSelector).toHaveBeenCalledWith(mockState)
      expect(props.invitees).toEqual(orgUserManagementInviteesSelector.getSelectorMockValue())
    })

    it('should call to orgUserManagementPageInviteesSelector with state and pass the result as inviteesMeta prop', () => {
      const { props } = mapStateToProps(mockState)
      expect(orgUserManagementPageInviteesSelector).toHaveBeenCalledWith(mockState)
      expect(props.inviteesMeta).toEqual(orgUserManagementPageInviteesSelector.getSelectorMockValue())
    })
    it('should call to selectionSelector with state and pass the result as selectedUsers prop', () => {
      const { props } = mapStateToProps(mockState)
      expect(selectionSelector).toHaveBeenCalledWith(mockState)
      expect(props.selectedUsers).toEqual(selectionSelector.getSelectorMockValue())
    })
  })

  describe('mapDispatchToProps', () => {
    it('should dispatch setPagination action', () => {
      const { props } = mapDispatchToProps()
      props.setPagination()
      expect(setPagination).toHaveBeenCalled()
    })

    it('should dispatch fetchInvitedUsersByFilter action', () => {
      const { props } = mapDispatchToProps()
      props.fetchInvitedUsersByFilter()
      expect(fetchInvitedUsersByFilter).toHaveBeenCalled()
    })

    it('should dispatch setFilters action', () => {
      const { props } = mapDispatchToProps()
      props.setFilters()
      expect(setFilters).toHaveBeenCalled()
    })

    it('should dispatch setSelection action', () => {
      const { props } = mapDispatchToProps()
      props.setSelection()
      expect(setSelection).toHaveBeenCalled()
    })
  })

  describe('ConnectedComponent', () => {
    let wrapper
    let defaultProps

    beforeEach(() => {
      defaultProps = {
        total: 50,
        filter: {
          email: 'john@example.com',
          sortDirect: 'asc',
          sortField: 'email',
        },
        inviteesMeta: orgUserManagementPageInviteesSelector.getSelectorMockValue(),
        user: userSelector.getSelectorMockValue(),
        invitees: orgUserManagementInviteesSelector.getSelectorMockValue(),
        setPagination: jest.fn(),
        fetchInvitedUsersByFilter: jest.fn(),
        setFilters: jest.fn(),
        setSelection: jest.fn(),
        selectedUsers: selectionSelector.getSelectorMockValue(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should call setFilters with correct arguments on filterHandler call', () => {
      const tableProps = wrapper.props()
      const mockPage = 1
      const mockPerPage = 20
      const mockFilter = 'email'
      const mockFilterFromTable = {
        [InviteesFilterKeys.EMAIL]: mockFilter,
      }
      const mockSorterFromTable = new TableSorter({
        order: TableSortDirection.ASCEND,
        field: InviteesFilterKeys.EMAIL,
      })
      tableProps.onFilter({}, mockFilterFromTable, mockSorterFromTable)

      expect(defaultProps.setFilters).nthCalledWith(1, {
        [PaginationKeys.PAGE]: mockPage,
        [PaginationKeys.PER_PAGE]: mockPerPage,
        [InviteesFilterKeys.EMAIL]: mockFilter,
        [InviteesFilterKeys.SORT_DIRECT]: SortDirection.ASC,
        [InviteesFilterKeys.SORT_FIELD]: InviteesFilterKeys.EMAIL,
      })
    })
  })
})
