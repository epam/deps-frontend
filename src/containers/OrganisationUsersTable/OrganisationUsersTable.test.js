import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { setSelection, setPagination } from '@/actions/navigation'
import { useGetOrganisationUsersQuery } from '@/apiRTK/iamApi'
import { TableSortDirection, TableSorter } from '@/components/Table/TableSorter'
import { OrgUserFilterKeys, PaginationKeys, SortDirection } from '@/constants/navigation'
import { BASE_ORG_USERS_FILTER_CONFIG } from '@/models/OrgUserFilterConfig'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { userSelector } from '@/selectors/authorization'
import { selectionSelector, filterSelector } from '@/selectors/navigation'
import { OrganisationUsersTable } from './OrganisationUsersTable'

jest.mock('react-redux', () => mockReactRedux)

jest.mock('@/actions/navigation', () => ({
  setPagination: jest.fn(),
  setSelection: jest.fn(),
}))

jest.mock('@/selectors/navigation')
jest.mock('@/selectors/orgUserManagement')
jest.mock('@/selectors/authorization')
jest.mock('@/apiRTK/iamApi')

jest.mock('@/containers/DeleteUsersButton', () => mockComponent('DeleteUsersButton'))
jest.mock('@/utils/env', () => mockEnv)

const filters = {
  ...BASE_ORG_USERS_FILTER_CONFIG,
  ...DefaultPaginationConfig,
}

const {
  mapStateToProps,
  mapDispatchToProps,
  ConnectedComponent,
} = OrganisationUsersTable

describe('Container: OrganisationUsersTable', () => {
  describe('mapDispatchToProps', () => {
    it('should pass setSelection action as setSelection property', () => {
      const { props } = mapDispatchToProps()

      props.setSelection()
      expect(setSelection).toHaveBeenCalledTimes(1)
    })

    it('should pass setPagination action as setPagination property', () => {
      const { props } = mapDispatchToProps()

      props.setPagination()
      expect(setPagination).toHaveBeenCalledTimes(1)
    })
  })

  describe('mapStateToProps', () => {
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
  })

  describe('ConnectedComponent', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        setSelection: jest.fn(),
        selectedUsers: selectionSelector.getSelectorMockValue(),
        filters,
        user: userSelector.getSelectorMockValue(),
        setPagination: jest.fn(),
        setFilters: jest.fn(),
      }
      useGetOrganisationUsersQuery.mockImplementation(jest.fn(() => ({
        data: {
          meta: { total: 0 },
          result: [defaultProps.user],
        },
        refetch: jest.fn(),
      })))

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should call useGetOrganisationUsersQuery with correct args', () => {
      const { user, filters } = defaultProps
      expect(useGetOrganisationUsersQuery).nthCalledWith(1, {
        orgPk: user.organisation.pk,
        filters,
      })
    })

    it('should call setFilters on filterHandler call', () => {
      const mockPage = 1
      const mockPerPage = 20
      const mockFilter = 'mock user'
      const mockFiltersFromTable = {
        [OrgUserFilterKeys.USER]: mockFilter,
      }
      const mockSorterFromTable = new TableSorter({
        order: TableSortDirection.ASCEND,
        field: OrgUserFilterKeys.USER,
      })
      wrapper.props().onFilter({}, mockFiltersFromTable, mockSorterFromTable)

      expect(defaultProps.setFilters).nthCalledWith(1, {
        [PaginationKeys.PAGE]: mockPage,
        [PaginationKeys.PER_PAGE]: mockPerPage,
        [OrgUserFilterKeys.USER]: mockFilter,
        [OrgUserFilterKeys.SORT_FIELD]: OrgUserFilterKeys.USER,
        [OrgUserFilterKeys.SORT_DIRECT]: SortDirection.ASC,
      })
    })
  })
})
