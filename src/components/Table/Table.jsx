
import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Empty } from '@/components/Empty'
import { Spin } from '@/components/Spin'
import {
  TABLE_ROW,
  DOCUMENTS_PER_PAGE,
  TABLE,
  PAGINATION,
} from '@/constants/automation'
import { localize, Localization } from '@/localization/i18n'
import { paginationConfigShape } from '@/models/PaginationConfig'
import { outerHeight } from '@/utils/window'
import { StyledTable } from './Table.styles'
import { TableHeaderCell } from './TableHeaderCell'
import { useTableColumnsResize } from './useTableColumnsResize'

const HEADER_CLASS_NAME = 'ant-table-thead'
const PAGINATION_CLASS_NAME = 'ant-table-pagination'
const HEIGHT_DIFFERENCE_THRESHOLD = 1
const TABLE_BOTTOM_MARGIN = 8
const SELECTION_BASE_OFFSET = 1.5
const SELECTION_BASE_STEP = 5
const TABLE_LAYOUT = 'fixed'

/**
 * Calculates selection column width based on number of columns.
 * Width increases with column count to maintain visual balance.
 */
const getSelectionColumnWidth = (columnsCount = 0) => (
  Math.ceil(SELECTION_BASE_STEP * columnsCount + SELECTION_BASE_OFFSET)
)

const columnShape = PropTypes.shape({
  dataIndex: PropTypes.string,
  ellipsis: PropTypes.bool,
  filterDropdown: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  filterIcon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
  filteredValue: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  key: PropTypes.string,
  render: PropTypes.func,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  sorter: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  sortOrder: PropTypes.string,
  onHeaderCell: PropTypes.func,
  disableResize: PropTypes.bool,
})

const localeConfig = {
  triggerAsc: localize(Localization.CLICK_TO_SORT_ASCENDING),
  triggerDesc: localize(Localization.CLICK_TO_SORT_DESCENDING),
  cancelSort: localize(Localization.CLICK_TO_CANCEL_SORTING),
}

const Table = ({
  className,
  data,
  columns,
  pagination,
  onFilter,
  rowKey,
  rowSelection,
  height,
  onRow,
  components,
  fetching,
  rowClassName,
  storageId,
}) => {
  const [headerHeight, setHeaderHeight] = useState(null)
  const [paginationHeight, setPaginationHeight] = useState(null)

  const { processedColumns, isResizing } = useTableColumnsResize(columns, storageId)

  const uid = useMemo(() => `id${uuidv4()}`, [])

  const isAllColumnsResizeDisabled = useMemo(() => {
    const list = columns || []
    return list.every((c) => c?.disableResize)
  }, [columns])

  const getRowProps = (record, index) => ({
    ...onRow(record, index),
    'data-automation': TABLE_ROW,
  })

  const scroll = useMemo(() => {
    if (height === undefined) {
      return undefined
    }

    const headerOffset = headerHeight ?? 0
    const paginationOffset = paginationHeight ?? 0

    return {
      y: height - headerOffset - paginationOffset - TABLE_BOTTOM_MARGIN,
    }
  }, [height, headerHeight, paginationHeight])

  useEffect(() => {
    if (height === undefined) {
      return
    }

    const header = document.querySelector(`#${uid} .${HEADER_CLASS_NAME}`)
    const pagination = document.querySelector(`#${uid} + .${PAGINATION_CLASS_NAME}`)
    const measuredHeaderHeight = header ? outerHeight(header) : 0
    const measuredPaginationHeight = pagination ? outerHeight(pagination) : 0
    pagination?.setAttribute('data-automation', PAGINATION)
    pagination?.lastChild.setAttribute('data-automation', DOCUMENTS_PER_PAGE)

    setHeaderHeight((prev) => (
      Math.abs((prev ?? 0) - measuredHeaderHeight) > HEIGHT_DIFFERENCE_THRESHOLD ? measuredHeaderHeight : prev
    ))
    setPaginationHeight((prev) => (
      Math.abs((prev ?? 0) - measuredPaginationHeight) > HEIGHT_DIFFERENCE_THRESHOLD ? measuredPaginationHeight : prev
    ))
  }, [height, uid])

  const componentsToUse = useMemo(() => {
    if (isAllColumnsResizeDisabled) {
      return components
    }

    return {
      ...components,
      header: {
        ...components?.header,
        cell: TableHeaderCell,
      },
    }
  }, [components, isAllColumnsResizeDisabled])

  const spinnerProps = useMemo(() => ({
    spinning: !!fetching,
    indicator: (
      <Spin.Centered
        spinning={!!fetching}
      />
    ),
  }), [fetching])

  const columnsToUse = isAllColumnsResizeDisabled ? columns : processedColumns

  const rowSelectionToUse = useMemo(() => {
    if (!rowSelection) {
      return undefined
    }

    if (isAllColumnsResizeDisabled) {
      return rowSelection
    }

    return {
      ...rowSelection,
      columnWidth: rowSelection.columnWidth ?? getSelectionColumnWidth(columns?.length),
    }
  }, [
    rowSelection,
    columns?.length,
    isAllColumnsResizeDisabled,
  ])

  return (
    <StyledTable
      bordered
      className={className}
      columns={columnsToUse}
      components={componentsToUse}
      data-automation={TABLE}
      dataSource={data}
      emptyText={<Empty />}
      id={uid}
      loading={spinnerProps}
      locale={localeConfig}
      onChange={onFilter}
      onRow={onRow && getRowProps}
      pagination={pagination}
      rowClassName={rowClassName}
      rowKey={rowKey}
      rowSelection={rowSelectionToUse}
      scroll={scroll}
      showSorterTooltip={!isResizing}
      tableLayout={TABLE_LAYOUT}
    />
  )
}

Table.propTypes = {
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.arrayOf(PropTypes.any),
  columns: PropTypes.arrayOf(columnShape),
  pagination: PropTypes.oneOfType([
    PropTypes.bool,
    paginationConfigShape,
  ]).isRequired,
  onFilter: PropTypes.func,
  rowKey: PropTypes.func,
  rowSelection: PropTypes.shape({
    columnWidth: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    selectedRowKeys: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ])),
    onChange: PropTypes.func,
  }),
  height: PropTypes.number,
  onRow: PropTypes.func,
  components: PropTypes.objectOf(
    PropTypes.shape({
      body: PropTypes.element,
    }),
  ),
  fetching: PropTypes.bool,
  rowClassName: PropTypes.func,
  storageId: PropTypes.string,
}

export {
  Table,
}
