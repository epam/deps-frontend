
import PropTypes from 'prop-types'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setFilters,
  setPagination,
  setSelection,
} from '@/actions/navigation'
import { Table } from '@/components/Table'
import {
  BatchFilterKey,
  PaginationKeys,
  TABLE_SORT_DIRECT_KEY_TO_DATA_FILTER_KEY,
} from '@/constants/navigation'
import { BATCHES_PER_PAGE } from '@/constants/storage'
import { BatchDataKeyColumn } from '@/containers/BatchesTable/columns/BatchDataKeyColumn'
import { withParentSize } from '@/hocs/withParentSize'
import { useEventSource, KnownBusinessEvent } from '@/hooks/useEventSource'
import { batchShape } from '@/models/Batch'
import { Pagination } from '@/models/Pagination'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { selectionSelector } from '@/selectors/navigation'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { defaultShowTotal } from '@/utils/tableUtils'
import { openInNewTarget } from '@/utils/window'
import {
  generateBatchNameColumn,
  generateBatchStatusColumn,
  generateBatchesGroupColumn,
  generateBatchesCreationDateColumn,
  generateActionsColumn,
} from './columns'

const SizeAwareTable = withParentSize({
  monitorHeight: true,
  noPlaceholder: true,
})((props) => (
  <Table
    {...props}
    height={props.size.height}
  />
))

const CHECKBOX_CLASS_NAME = 'ant-checkbox-wrapper'

const BatchesTable = ({
  filterConfig,
  isFetching,
  data,
}) => {
  const selectedRowKeys = useSelector(selectionSelector)

  const dispatch = useDispatch()
  const addEvent = useEventSource('BatchesTable')

  const [batches, setBatches] = useState(data.result || [])

  const rowKey = (record) => record.id

  const onSelectChange = (newSelectedRowKeys) => {
    dispatch(setSelection(newSelectedRowKeys))
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const changePagination = useCallback((page, size) => {
    Pagination.setSize(BATCHES_PER_PAGE, size)
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

  const onRowProps = ({ id }) => ({
    onClick: (event) => {
      const url = navigationMap.batches.batch(id)

      !event.target.classList.contains(CHECKBOX_CLASS_NAME) &&
        openInNewTarget(
          event,
          url,
          () => goTo(url),
        )
    },
  })

  const getTableColumns = () => [
    generateBatchNameColumn(filterConfig),
    generateBatchStatusColumn(filterConfig),
    generateBatchesGroupColumn(filterConfig),
    generateBatchesCreationDateColumn(filterConfig),
    generateActionsColumn(),
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
    ] = filters[BatchDataKeyColumn.CREATED_AT] || []

    const sortDirect = TABLE_SORT_DIRECT_KEY_TO_DATA_FILTER_KEY[sorter.order]
    const nextFiltersConfig = {
      ...filterConfig,
      [BatchFilterKey.NAME]: filters[BatchDataKeyColumn.NAME] || '',
      [BatchFilterKey.STATUS]: filters[BatchDataKeyColumn.STATUS] || '',
      [BatchFilterKey.GROUP]: filters[BatchDataKeyColumn.GROUP] || '',
      [BatchFilterKey.DATE_START]: dateStart || '',
      [BatchFilterKey.DATE_END]: dateEnd || '',
      [BatchFilterKey.SORT_ORDER]: sortDirect || '',
      [BatchFilterKey.SORT_BY]: sortDirect ? sorter.columnKey : '',
    }

    dispatch(setFilters(nextFiltersConfig))
  }

  const onBatchStatusUpdated = useCallback((eventData) => {
    const updatedBatchId = eventData.id
    const updatedStatus = eventData.status

    const isBatchVisible = batches.some((batch) => batch.id === updatedBatchId)

    if (!isBatchVisible) {
      return
    }

    setBatches((prevData) =>
      prevData.map((batch) =>
        batch.id === updatedBatchId
          ? {
            ...batch,
            status: updatedStatus,
          }
          : batch,
      ),
    )
  }, [batches])

  useEffect(() => {
    setBatches(data.result)
  }, [data.result])

  useEffect(() => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      return
    }
    addEvent(KnownBusinessEvent.BATCH_STATUS_UPDATED, onBatchStatusUpdated)
  }, [addEvent, onBatchStatusUpdated])

  return (
    <SizeAwareTable
      columns={
        getTableColumns()
      }
      data={batches}
      fetching={isFetching}
      onFilter={filterHandler}
      onRow={onRowProps}
      pagination={paginationConfig}
      rowKey={rowKey}
      rowSelection={rowSelection}
    />
  )
}

BatchesTable.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  filterConfig: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }),
  data: PropTypes.shape({
    meta: PropTypes.shape({
      total: PropTypes.number,
    }),
    result: PropTypes.arrayOf(
      batchShape,
    ),
  }),
}

export {
  BatchesTable,
}
