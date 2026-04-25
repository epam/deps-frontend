
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { setSelection, setPagination, setFilters } from '@/actions/navigation'
import { organisationUsers } from '@/apiRTK/iamApi'
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { Table } from '@/components/Table'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { UserCard } from '@/components/UserCard'
import {
  OrgUserFilterKeys,
  PaginationKeys,
  DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY,
  TABLE_SORT_DIRECT_KEY_TO_DATA_FILTER_KEY,
} from '@/constants/navigation'
import { USERS_PER_PAGE } from '@/constants/storage'
import { withParentSize } from '@/hocs/withParentSize'
import { localize, Localization } from '@/localization/i18n'
import { BASE_ORG_USERS_FILTER_CONFIG } from '@/models/OrgUserFilterConfig'
import { Pagination } from '@/models/Pagination'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { filterSelector, selectionSelector } from '@/selectors/navigation'
import { defaultShowTotal } from '@/utils/tableUtils'

const DEFAULT_FILTER = {
  ...BASE_ORG_USERS_FILTER_CONFIG,
  ...DefaultPaginationConfig,
}

const USERS_COLUMN_KEY = 'user'

const SizeAwareTable = withParentSize({
  monitorHeight: true,
  noPlaceholder: true,
})((props) => (
  <Table
    {...props}
    height={props.size.height}
  />
))

const OrganisationUsersTable = ({
  selectedUsers,
  setSelection,
  setPagination,
  user,
  setFilters,
  filters,
}) => {
  const initialPagination = Pagination.getInitialPagination(USERS_PER_PAGE)

  const filterConfig = useMemo(() => {
    return isEmpty(filters)
      ? {
        ...DEFAULT_FILTER,
        ...initialPagination,
      }
      : {
        ...DEFAULT_FILTER,
        ...filters,
      }
  }, [filters, initialPagination])

  const { data, isFetching } = organisationUsers.endpoints.getOrganisationUsers.useQuery({
    orgPk: user.organisation.pk,
    filters: filterConfig,
  })

  const users = data?.result || []
  const usersTotal = data?.meta?.total || 0
  const tableData = users.map((user) => ({ user }))

  const rowKey = ({ user }) => user.pk

  const pageAndSizeHandler = useCallback((page, size) => {
    Pagination.setSize(USERS_PER_PAGE, size)
    setPagination({
      [PaginationKeys.PAGE]: page,
      [PaginationKeys.PER_PAGE]: size,
    })
  }, [setPagination])

  const paginationConfig = useMemo(() => ({
    current: filterConfig.page,
    pageSize: filterConfig.perPage,
    total: usersTotal,
    onChange: pageAndSizeHandler,
    onShowSizeChange: pageAndSizeHandler,
    showSizeChanger: !!usersTotal,
    showTotal: defaultShowTotal,
  }), [
    filterConfig.page,
    filterConfig.perPage,
    usersTotal,
    pageAndSizeHandler,
  ])

  const filterHandler = useCallback((_, filter, sorter) => {
    const sortDirect = TABLE_SORT_DIRECT_KEY_TO_DATA_FILTER_KEY[sorter.order]
    const newFilter = {
      ...filterConfig,
      [OrgUserFilterKeys.USER]: filter.user,
      [OrgUserFilterKeys.SORT_DIRECT]: sortDirect || '',
      [OrgUserFilterKeys.SORT_FIELD]: sortDirect ? sorter.field : '',
    }

    setFilters(newFilter)
  }, [setFilters, filterConfig])

  const tableColumns = useMemo(() => ([{
    title: localize(Localization.USER),
    dataIndex: USERS_COLUMN_KEY,
    render: (record) => (
      <UserCard
        key={record.pk}
        user={record}
      />
    ),
    sorter: true,
    filterDropdown: ({
      setSelectedKeys,
      confirm,
      visible,
    }) => (
      <TableSearchDropdown
        confirm={() => confirm({ closeDropdown: false })}
        onChange={setSelectedKeys}
        searchValue={filterConfig[OrgUserFilterKeys.USER] || ''}
        visible={visible}
      />
    ),
    filterIcon: (
      <TableFilterIndicator
        active={!!filterConfig[OrgUserFilterKeys.USER]}
        icon={<SearchIcon />}
      />
    ),
    sortOrder: DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[filterConfig.sortDirect] || '',
    filteredValue: filterConfig[OrgUserFilterKeys.USER] || [],
    disableResize: true,
  }]), [filterConfig])

  const getRowSelectionProps = useCallback(() => ({
    selectedRowKeys: selectedUsers,
    onChange: setSelection,
  }), [
    selectedUsers,
    setSelection,
  ])

  return (
    <SizeAwareTable
      columns={tableColumns}
      data={tableData}
      fetching={isFetching}
      onFilter={filterHandler}
      pagination={paginationConfig}
      rowKey={rowKey}
      rowSelection={getRowSelectionProps()}
    />
  )
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
  selectedUsers: selectionSelector(state),
  filters: filterSelector(state),
})

const mapDispatchToProps = {
  setSelection,
  setPagination,
  setFilters,
}

OrganisationUsersTable.propTypes = {
  selectedUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelection: PropTypes.func.isRequired,
  filterConfig: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }),
  setPagination: PropTypes.func.isRequired,
  user: userShape.isRequired,
  setFilters: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }),
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(OrganisationUsersTable)

export {
  ConnectedComponent as OrganisationUsersTable,
}
