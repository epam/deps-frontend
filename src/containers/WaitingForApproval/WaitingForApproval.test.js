
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { setSelection, setPagination, setFilters, goTo } from '@/actions/navigation'
import { fetchWaitingForApprovalUsersByFilter } from '@/actions/orgUserManagement'
import { TableSortDirection, TableSorter } from '@/components/Table/TableSorter'
import { OrgWaitingsFilterKeys, PaginationKeys, SortDirection } from '@/constants/navigation'
import { userSelector } from '@/selectors/authorization'
import { selectionSelector, filterSelector } from '@/selectors/navigation'
import { orgUserManagementWaitingForApprovalSelector } from '@/selectors/orgUserManagement'
import { orgUserManagementPageWaitingForApprovalSelector, orgDefaultWaitingsMetaSelector } from '@/selectors/orgUserManagementPage'
import { WaitingForApproval } from './WaitingForApproval'

jest.mock('react-redux', () => mockReactRedux)

jest.mock('@/actions/navigation', () => ({
  setPagination: jest.fn(),
  setSelection: jest.fn(),
  setFilters: jest.fn(),
  goTo: jest.fn(),
}))

jest.mock('@/actions/orgUserManagement', () => ({
  fetchWaitingForApprovalUsersByFilter: jest.fn(),
}))

jest.mock('@/selectors/navigation')
jest.mock('@/selectors/orgUserManagement')
jest.mock('@/selectors/orgUserManagementPage')
jest.mock('@/selectors/authorization')

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/hooks/usePrevious', () => ({
  usePrevious: jest.fn(() => 10),
}))

const mockWaitingForApprovalMeta = {
  total: 10,
  size: 0,
}

const mockFilters = {
  page: 2,
  perPage: 10,
  user: 'John Dou',
  sortDirect: 'asc',
  sortField: 'email',
}

const mockWaitingsDefaultMeta = {
  total: 0,
  size: 0,
}

const {
  mapStateToProps,
  mapDispatchToProps,
  ConnectedComponent,
} = WaitingForApproval

describe('Container: WaitingForApproval', () => {
  describe('mapDispatchToProps', () => {
    it('should pass setSelection action as setSelection property', () => {
      const { props } = mapDispatchToProps()

      props.setSelection()
      expect(setSelection).toHaveBeenCalledTimes(1)
    })

    it('should pass setFilters action as setFilters property', () => {
      const { props } = mapDispatchToProps()

      props.setFilters()
      expect(setFilters).toHaveBeenCalledTimes(1)
    })

    it('should pass setPagination action as setPagination property', () => {
      const { props } = mapDispatchToProps()

      props.setPagination()
      expect(setPagination).toHaveBeenCalledTimes(1)
    })

    it('should pass fetchWaitingForApprovalUsersByFilter action as fetchWaitingForApprovalUsersByFilter property', () => {
      const { props } = mapDispatchToProps()

      props.fetchWaitingForApprovalUsersByFilter()
      expect(fetchWaitingForApprovalUsersByFilter).toHaveBeenCalledTimes(1)
    })

    it('should call to goTo action when calling to goTo prop', () => {
      const { props } = mapDispatchToProps()

      props.goTo()
      expect(goTo).toHaveBeenCalled()
    })
  })

  describe('mapStateToProps', () => {
    it('should call orgUserManagementWaitingForApprovalSelector and pass the result as waitingForApproval prop', () => {
      const { props } = mapStateToProps()

      expect(orgUserManagementWaitingForApprovalSelector).toHaveBeenCalled()
      expect(props.waitingForApproval)
        .toEqual(orgUserManagementWaitingForApprovalSelector.getSelectorMockValue())
    })

    it('should call selectionSelector and pass the result as selectedUsers prop', () => {
      const { props } = mapStateToProps()

      expect(selectionSelector).toHaveBeenCalled()
      expect(props.selectedUsers).toEqual(selectionSelector.getSelectorMockValue())
    })

    it('should call filterSelector and pass the result as filters prop', () => {
      const { props } = mapStateToProps()

      expect(filterSelector).toHaveBeenCalled()
      expect(props.filters).toEqual(filterSelector.getSelectorMockValue())
    })

    it('should call orgUserManagementPageWaitingForApprovalSelector and pass the result as waitingForApprovalMeta prop', () => {
      const { props } = mapStateToProps()

      expect(orgUserManagementPageWaitingForApprovalSelector).toHaveBeenCalled()
      expect(props.waitingForApprovalMeta)
        .toEqual(orgUserManagementPageWaitingForApprovalSelector.getSelectorMockValue())
    })

    it('should call userSelector and pass the result as user prop', () => {
      const { props } = mapStateToProps()

      expect(userSelector).toHaveBeenCalled()
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })

    it('should call to orgDefaultWaitingsMetaSelector with state and pass the result as waitingsDefaultMeta prop', () => {
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
        setPagination: jest.fn(),
        waitingForApprovalMeta: orgUserManagementPageWaitingForApprovalSelector.getSelectorMockValue(),
        waitingForApproval: orgUserManagementWaitingForApprovalSelector.getSelectorMockValue(),
        filters: {
          user: 'John Dou',
          sortDirect: 'asc',
          sortField: 'email',
        },
        fetchWaitingForApprovalUsersByFilter: jest.fn(),
        setSelection: jest.fn(),
        selectedUsers: selectionSelector.getSelectorMockValue(),
        user: userSelector.getSelectorMockValue(),
        setFilters: jest.fn(),
        goTo: jest.fn(),
        waitingsDefaultMeta: orgDefaultWaitingsMetaSelector.getSelectorMockValue(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render component correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should call setPagination in case there are no users on a current page', () => {
      defaultProps.waitingForApprovalMeta = mockWaitingForApprovalMeta
      defaultProps.filters = mockFilters
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
      expect(setPagination).toHaveBeenCalledTimes(1)
    })

    it('should call goTo in case there are no users waiting for approval', () => {
      defaultProps.waitingsDefaultMeta = mockWaitingsDefaultMeta
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
      expect(goTo).toHaveBeenCalledTimes(1)
    })

    it('should call setFilters with correct arguments on filterHandler call', () => {
      const tableProps = wrapper.props()
      const mockPage = 1
      const mockPerPage = 20
      const mockFilter = 'user name'
      const mockFilterFromTable = {
        [OrgWaitingsFilterKeys.USER]: mockFilter,
      }
      const mockSorterFromTable = new TableSorter({
        order: TableSortDirection.ASCEND,
        field: OrgWaitingsFilterKeys.USER,
      })
      tableProps.onFilter({}, mockFilterFromTable, mockSorterFromTable)

      expect(defaultProps.setFilters).nthCalledWith(1, {
        [PaginationKeys.PAGE]: mockPage,
        [PaginationKeys.PER_PAGE]: mockPerPage,
        [OrgWaitingsFilterKeys.USER]: mockFilter,
        [OrgWaitingsFilterKeys.SORT_DIRECT]: SortDirection.ASC,
        [OrgWaitingsFilterKeys.SORT_FIELD]: OrgWaitingsFilterKeys.USER,
      })
    })
  })
})
