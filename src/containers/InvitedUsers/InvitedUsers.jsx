
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useMemo, useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  setPagination,
  setFilters,
  setSelection,
} from '@/actions/navigation'
import { fetchInvitedUsersByFilter } from '@/actions/orgUserManagement'
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { Table } from '@/components/Table'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { TABLE_ACTIONS_COLUMN_WIDTH } from '@/constants/common'
import {
  InviteesFilterKeys,
  PaginationKeys,
  DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY,
  TABLE_SORT_DIRECT_KEY_TO_DATA_FILTER_KEY,
} from '@/constants/navigation'
import { USERS_PER_PAGE } from '@/constants/storage'
import { RemoveInvitedUserButton } from '@/containers/RemoveInvitedUserButton'
import { withParentSize } from '@/hocs/withParentSize'
import { usePrevious } from '@/hooks/usePrevious'
import { localize, Localization } from '@/localization/i18n'
import { inviteesShape, inviteesMetaShape } from '@/models/Invitees'
import { BASE_ORG_INVITEES_FILTER_CONFIG, OrgInviteesFilterConfigShape } from '@/models/OrgInviteesFilterConfig'
import { Pagination } from '@/models/Pagination'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { filterSelector, selectionSelector } from '@/selectors/navigation'
import { orgUserManagementInviteesSelector } from '@/selectors/orgUserManagement'
import { orgUserManagementPageInviteesSelector } from '@/selectors/orgUserManagementPage'
import { defaultShowTotal } from '@/utils/tableUtils'
import { StyledRow, ActionsWrapper } from './InvitedUsers.styles'

const EMAIL_COLUMN_DATA_INDEX = 'email'

const DEFAULT_FILTER = {
  ...BASE_ORG_INVITEES_FILTER_CONFIG,
  ...DefaultPaginationConfig,
}

const SizeAwareTable = withParentSize({
  monitorHeight: true,
  noPlaceholder: true,
})((props) => (
  <Table
    {...props}
    height={props.size.height}
  />
))

const InvitedUsers = ({
  setPagination,
  inviteesMeta,
  filter,
  fetchInvitedUsersByFilter,
  user,
  setSelection,
  selectedUsers,
  invitees,
  setFilters,
}) => {
  const [isFetching, setIsFetching] = useState(false)

  const rowSelection = useMemo(() => ({
    selectedRowKeys: selectedUsers,
    onChange: setSelection,
  }), [
    selectedUsers,
    setSelection,
  ])

  const initialPagination = Pagination.getInitialPagination(USERS_PER_PAGE)

  const filterConfig = useMemo(() => {
    return isEmpty(filter)
      ? {
        ...DEFAULT_FILTER,
        ...initialPagination,
      }
      : {
        ...DEFAULT_FILTER,
        ...filter,
      }
  }, [filter, initialPagination])

  const prevFilterConfig = usePrevious(filterConfig)

  const pageAndSizeHandler = useCallback((page, size) => {
    Pagination.setSize(USERS_PER_PAGE, size)
    setPagination({
      [PaginationKeys.PAGE]: page,
      [PaginationKeys.PER_PAGE]: size,
    })
  }, [setPagination])

  const filterHandler = useCallback((_, filters, sorter) => {
    const sortDirect = TABLE_SORT_DIRECT_KEY_TO_DATA_FILTER_KEY[sorter.order]
    const newFilter = {
      ...filterConfig,
      [InviteesFilterKeys.EMAIL]: filters.email,
      [InviteesFilterKeys.SORT_DIRECT]: sortDirect || '',
      [InviteesFilterKeys.SORT_FIELD]: sortDirect ? sorter.field : '',
    }

    setFilters(newFilter)
  }, [setFilters, filterConfig])

  const columns = useMemo(() => ([{
    title: localize(Localization.EMAIL),
    dataIndex: EMAIL_COLUMN_DATA_INDEX,
    render: (email) => <StyledRow>{email}</StyledRow>,
    sorter: true,
    sortOrder: DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[filterConfig.sortDirect] || '',
    filteredValue: filterConfig.email || [],
    filterDropdown: ({
      setSelectedKeys,
      confirm,
      visible,
    }) => (
      <TableSearchDropdown
        confirm={() => confirm({ closeDropdown: false })}
        onChange={setSelectedKeys}
        searchValue={filterConfig.email || ''}
        visible={visible}
      />
    ),
    filterIcon: (
      <TableFilterIndicator
        active={!!filterConfig.email}
        icon={<SearchIcon />}
      />
    ),
    disableResize: true,
  }, {
    render: (_, { email }) => (
      <ActionsWrapper>
        <RemoveInvitedUserButton
          invitedUser={email}
        />
      </ActionsWrapper>
    ),
    width: TABLE_ACTIONS_COLUMN_WIDTH,
    disableResize: true,
  }]), [
    filterConfig,
  ])

  const paginationConfig = useMemo(() => ({
    current: filterConfig.page,
    pageSize: filterConfig.perPage,
    total: inviteesMeta?.total,
    onChange: pageAndSizeHandler,
    onShowSizeChange: pageAndSizeHandler,
    showSizeChanger: !!inviteesMeta?.total,
    showTotal: defaultShowTotal,
  }), [
    filterConfig.page,
    filterConfig.perPage,
    inviteesMeta?.total,
    pageAndSizeHandler,
  ])

  const rowKey = useCallback((record) => (
    record.email
  ), [])

  const getInvitees = useCallback(
    async () => {
      try {
        await fetchInvitedUsersByFilter(user.organisation.pk, filterConfig)
      } finally {
        setIsFetching(false)
      }
    },
    [
      fetchInvitedUsersByFilter,
      user.organisation.pk,
      filterConfig,
    ],
  )

  const iEqual = (config, prevConfig) => (
    Object.entries(config).every(([key, value]) => (
      prevConfig[key] === value
    ))
  )

  useEffect(() => {
    if (
      prevFilterConfig &&
      iEqual(filterConfig, prevFilterConfig)
    ) {
      return
    }
    setIsFetching(true)
    getInvitees()
  },
  [
    filterConfig,
    getInvitees,
    prevFilterConfig,
    setIsFetching,
  ],
  )

  return (
    <SizeAwareTable
      columns={columns}
      data={invitees || []}
      fetching={isFetching}
      onFilter={filterHandler}
      pagination={paginationConfig}
      rowKey={rowKey}
      rowSelection={rowSelection}
    />
  )
}

InvitedUsers.propTypes = {
  total: PropTypes.number,
  filter: OrgInviteesFilterConfigShape,
  user: userShape.isRequired,
  invitees: inviteesShape,
  inviteesMeta: inviteesMetaShape,
  setPagination: PropTypes.func.isRequired,
  fetchInvitedUsersByFilter: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  setSelection: PropTypes.func.isRequired,
  selectedUsers: PropTypes.arrayOf(PropTypes.string),
}

const mapStateToProps = (state) => ({
  filter: filterSelector(state),
  user: userSelector(state),
  invitees: orgUserManagementInviteesSelector(state),
  selectedUsers: selectionSelector(state),
  inviteesMeta: orgUserManagementPageInviteesSelector(state),
})

const mapDispatchToProps = {
  setPagination,
  setSelection,
  fetchInvitedUsersByFilter,
  setFilters,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(InvitedUsers)

export {
  ConnectedComponent as InvitedUsers,
}
