
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setFilters,
  setPagination,
  setSelection,
} from '@/actions/navigation'
import { Table } from '@/components/Table'
import {
  FileFilterKey,
  PaginationKeys,
  TABLE_SORT_DIRECT_KEY_TO_DATA_FILTER_KEY,
} from '@/constants/navigation'
import { FILES_PER_PAGE } from '@/constants/storage'
import { withParentSize } from '@/hocs/withParentSize'
import { fileShape } from '@/models/File'
import { Pagination } from '@/models/Pagination'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { selectionSelector } from '@/selectors/navigation'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { defaultShowTotal } from '@/utils/tableUtils'
import { openInNewTarget } from '@/utils/window'
import {
  generateFileDateColumn,
  generateFileStateColumn,
  generateFileNameColumn,
  generateFileLabelsColumn,
  generateFileReferenceColumn,
  generateFileActionsColumn,
} from './columns'
import { FileDataKeyColumn } from './columns/FileDataKeyColumn'

const CHECKBOX_CLASS_NAME = 'ant-checkbox-wrapper'

const SizeAwareTable = withParentSize({
  monitorHeight: true,
  noPlaceholder: true,
})((props) => (
  <Table
    {...props}
    height={props.size.height}
  />
))

export const FilesTable = ({
  filterConfig,
  isLoading,
  data,
}) => {
  const selectedRowKeys = useSelector(selectionSelector)

  const dispatch = useDispatch()

  const rowKey = (record) => record.id

  const onRowProps = (record) => ({
    onClick: (event) => {
      const url = navigationMap.files.file(record.id)

      !event.target.classList.contains(CHECKBOX_CLASS_NAME) &&
          openInNewTarget(
            event,
            url,
            () => goTo(url),
          )
    },
  })

  const onSelectChange = (newSelectedRowKeys) => {
    dispatch(setSelection(newSelectedRowKeys))
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const changePagination = useCallback((page, size) => {
    Pagination.setSize(FILES_PER_PAGE, size)

    dispatch(setPagination({
      [PaginationKeys.PAGE]: page || DefaultPaginationConfig[PaginationKeys.PAGE],
      [PaginationKeys.PER_PAGE]: size || DefaultPaginationConfig[PaginationKeys.PER_PAGE],
    }))
  }, [dispatch])

  const paginationConfig = useMemo(() => {
    const { page, perPage } = filterConfig
    const total = data.meta?.total

    return {
      current: page,
      pageSize: perPage,
      total,
      onChange: changePagination,
      onShowSizeChange: changePagination,
      showSizeChanger: !!total,
      showTotal: defaultShowTotal,
    }
  }, [
    filterConfig,
    data.meta?.total,
    changePagination,
  ])

  const getTableColumns = () => [
    generateFileNameColumn(filterConfig),
    generateFileStateColumn(filterConfig),
    generateFileReferenceColumn(filterConfig),
    generateFileLabelsColumn(filterConfig),
    generateFileDateColumn(filterConfig),
    generateFileActionsColumn(),
  ]

  const paginationHandler = ({ current, pageSize }) => {
    const nextPaginationConfig = {
      [PaginationKeys.PAGE]: current || DefaultPaginationConfig[PaginationKeys.PAGE],
      [PaginationKeys.PER_PAGE]: pageSize || DefaultPaginationConfig[PaginationKeys.PER_PAGE],
    }

    dispatch(setPagination(nextPaginationConfig))
  }

  const filterHandler = (pagination, filters, sorter) => {
    paginationHandler(pagination)

    const [
      dateStart,
      dateEnd,
    ] = filters[FileDataKeyColumn.CREATED_AT] || []

    const sortDirect = TABLE_SORT_DIRECT_KEY_TO_DATA_FILTER_KEY[sorter.order]

    const nextFiltersConfig = {
      ...filterConfig,
      [FileFilterKey.NAME]: filters[FileDataKeyColumn.NAME] || '',
      [FileFilterKey.LABELS]: filters[FileDataKeyColumn.LABELS] || '',
      [FileFilterKey.STATE]: filters[FileDataKeyColumn.STATE] || '',
      [FileFilterKey.REFERENCE]: filters[FileDataKeyColumn.REFERENCE] || '',
      [FileFilterKey.DATE_START]: dateStart || '',
      [FileFilterKey.DATE_END]: dateEnd || '',
      [FileFilterKey.SORT_ORDER]: sortDirect || '',
      [FileFilterKey.SORT_BY]: sortDirect ? sorter.columnKey : '',
    }

    dispatch(setFilters(nextFiltersConfig))
  }

  return (
    <SizeAwareTable
      columns={getTableColumns()}
      data={data.result}
      fetching={isLoading}
      onFilter={filterHandler}
      onRow={onRowProps}
      pagination={paginationConfig}
      rowKey={rowKey}
      rowSelection={rowSelection}
    />
  )
}

FilesTable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  filterConfig: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
    referenceAvailable: PropTypes.bool,
  }),
  data: PropTypes.shape({
    meta: PropTypes.shape({
      total: PropTypes.number,
    }),
    result: PropTypes.arrayOf(
      fileShape,
    ),
  }),
}
