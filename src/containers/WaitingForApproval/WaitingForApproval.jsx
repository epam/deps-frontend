
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useMemo, useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { setSelection, setPagination, setFilters, goTo } from '@/actions/navigation'
import { fetchWaitingForApprovalUsersByFilter } from '@/actions/orgUserManagement'
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { Table } from '@/components/Table'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { UserCard } from '@/components/UserCard'
import { TABLE_ACTIONS_COLUMN_WIDTH } from '@/constants/common'
import {
  OrgWaitingsFilterKeys,
  PaginationKeys,
  DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY,
  TABLE_SORT_DIRECT_KEY_TO_DATA_FILTER_KEY,
} from '@/constants/navigation'
import { USERS_PER_PAGE } from '@/constants/storage'
import { withParentSize } from '@/hocs/withParentSize'
import { usePrevious } from '@/hooks/usePrevious'
import { Localization, localize } from '@/localization/i18n'
import { BASE_ORG_USERS_FILTER_CONFIG, OrgUserFilterConfigShape } from '@/models/OrgUserFilterConfig'
import { Pagination } from '@/models/Pagination'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { userShape } from '@/models/User'
import { waitingForApprovalUserShape } from '@/models/WaitingForApprovalUser'
import { userSelector } from '@/selectors/authorization'
import { filterSelector, selectionSelector } from '@/selectors/navigation'
import { orgUserManagementWaitingForApprovalSelector } from '@/selectors/orgUserManagement'
import { orgUserManagementPageWaitingForApprovalSelector, orgDefaultWaitingsMetaSelector } from '@/selectors/orgUserManagementPage'
import { navigationMap } from '@/utils/navigationMap'
import { defaultShowTotal } from '@/utils/tableUtils'
import { CommandBar } from './WaitingForApproval.styles'

const DEFAULT_FILTER = {
  ...BASE_ORG_USERS_FILTER_CONFIG,
  ...DefaultPaginationConfig,
}
const USER_COLUMN_DATA_INDEX = 'user'

const SizeAwareTable = withParentSize({
  monitorHeight: true,
  noPlaceholder: true,
})((props) => (
  <Table
    {...props}
    height={props.size.height}
  />
))

const WaitingForApproval = ({
  setPagination,
  waitingForApprovalMeta,
  waitingForApproval,
  filters,
  setSelection,
  selectedUsers,
  user,
  fetchWaitingForApprovalUsersByFilter,
  setFilters,
  goTo,
  waitingsDefaultMeta,
}) => {
  const [isFetching, setIsFetching] = useState(true)

  const rowKey = ({ user }) => user.pk

  const rowSelection = {
    selectedRowKeys: selectedUsers,
    onChange: setSelection,
  }

  const tableData = useMemo(() =>
    waitingForApproval.map((user) => ({
      user,
    })), [waitingForApproval])

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
    total: waitingForApprovalMeta?.total,
    onChange: pageAndSizeHandler,
    onShowSizeChange: pageAndSizeHandler,
    showSizeChanger: !!waitingForApprovalMeta?.total,
    showTotal: defaultShowTotal,
  }), [
    filterConfig.page,
    filterConfig.perPage,
    waitingForApprovalMeta?.total,
    pageAndSizeHandler,
  ])

  const filterHandler = useCallback((_, filters, sorter) => {
    const sortDirect = TABLE_SORT_DIRECT_KEY_TO_DATA_FILTER_KEY[sorter.order]
    const newFilter = {
      ...filterConfig,
      [OrgWaitingsFilterKeys.USER]: filters.user,
      [OrgWaitingsFilterKeys.SORT_DIRECT]: sortDirect || '',
      [OrgWaitingsFilterKeys.SORT_FIELD]: sortDirect ? sorter.field : '',
    }

    setFilters(newFilter)
  }, [setFilters, filterConfig])

  const getWaitingForApprovals = useCallback(
    async () => {
      try {
        await fetchWaitingForApprovalUsersByFilter(user.organisation.pk, filterConfig)
      } finally {
        setIsFetching(false)
      }
    },
    [
      fetchWaitingForApprovalUsersByFilter,
      user.organisation.pk,
      filterConfig,
    ],
  )

  const columns = useMemo(() => ([{
    title: localize(Localization.USER),
    dataIndex: USER_COLUMN_DATA_INDEX,
    filterDropdown: ({
      setSelectedKeys,
      confirm,
      visible,
    }) => (
      <TableSearchDropdown
        confirm={() => confirm({ closeDropdown: false })}
        onChange={setSelectedKeys}
        searchValue={filterConfig.user}
        visible={visible}
      />
    ),
    filterIcon: (
      <TableFilterIndicator
        active={!!filterConfig.user}
        icon={<SearchIcon />}
      />
    ),
    render: (record) => (
      <UserCard
        key={record.pk}
        user={record}
      />
    ),
    sorter: true,
    sortOrder: DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[filterConfig.sortDirect] || '',
    filteredValue: filterConfig.user || [],
    disableResize: true,
  }, {
    render: (_, { user }) => (
      <CommandBar user={user} />
    ),
    width: TABLE_ACTIONS_COLUMN_WIDTH,
    disableResize: true,
  }]), [
    filterConfig,
  ])

  const iEqual = (config, prevConfig) => (
    Object.entries(config).every(([key, value]) => (
      prevConfig[key] === value
    ))
  )

  const prevFilterConfig = usePrevious(filterConfig)

  useEffect(() => {
    if (
      prevFilterConfig &&
      iEqual(filterConfig, prevFilterConfig)
    ) {
      return
    }
    setIsFetching(true)
    getWaitingForApprovals()
  },
  [
    filterConfig,
    getWaitingForApprovals,
    prevFilterConfig,
  ])

  const prevSize = usePrevious(waitingForApprovalMeta?.size)

  useEffect(() => {
    if (
      !waitingForApprovalMeta?.size &&
      prevSize &&
      filterConfig.page !== DefaultPaginationConfig.page
    ) {
      setPagination({
        [PaginationKeys.PAGE]: filterConfig.page - 1,
        [PaginationKeys.PER_PAGE]: filterConfig.perPage,
      })
    }

    if (!waitingsDefaultMeta?.total) {
      goTo(navigationMap.management.organisationUsers())
    }
  }, [
    waitingsDefaultMeta?.total,
    waitingForApprovalMeta?.size,
    prevSize,
    filterConfig.page,
    filterConfig.perPage,
    goTo,
    setPagination,
  ])

  return (
    <SizeAwareTable
      columns={columns}
      data={tableData}
      fetching={isFetching}
      onFilter={filterHandler}
      pagination={paginationConfig}
      rowKey={rowKey}
      rowSelection={rowSelection}
    />
  )
}

WaitingForApproval.propTypes = {
  setPagination: PropTypes.func.isRequired,
  waitingForApprovalMeta: PropTypes.shape({
    total: PropTypes.number,
    size: PropTypes.number,
  }),
  waitingForApproval: PropTypes.arrayOf(waitingForApprovalUserShape).isRequired,
  fetchWaitingForApprovalUsersByFilter: PropTypes.func.isRequired,
  filters: OrgUserFilterConfigShape,
  setSelection: PropTypes.func.isRequired,
  selectedUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
  user: userShape.isRequired,
  setFilters: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
  waitingsDefaultMeta: PropTypes.shape({
    total: PropTypes.number,
    size: PropTypes.number,
  }),
}

const mapStateToProps = (state) => ({
  waitingForApproval: orgUserManagementWaitingForApprovalSelector(state),
  selectedUsers: selectionSelector(state),
  filters: filterSelector(state),
  waitingForApprovalMeta: orgUserManagementPageWaitingForApprovalSelector(state),
  user: userSelector(state),
  setFilters: PropTypes.func.isRequired,
  waitingsDefaultMeta: orgDefaultWaitingsMetaSelector(state),
})

const mapDispatchToProps = {
  setSelection,
  setPagination,
  fetchWaitingForApprovalUsersByFilter,
  setFilters,
  goTo,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(WaitingForApproval)

export {
  ConnectedComponent as WaitingForApproval,
}
