
import { CalendarIcon } from '@/components/Icons/CalendarIcon'
import { TableDateRangeFilter } from '@/components/Table/TableDateRangeFilter'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY, BatchFilterKey } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { toLocalizedDateString } from '@/utils/dayjs'
import { BatchDataKeyColumn } from './BatchDataKeyColumn'

const generateBatchesCreationDateColumn = (filterConfig) => {
  const filteredValue = filterConfig[BatchFilterKey.DATE_START]
    ? [filterConfig[BatchFilterKey.DATE_START], filterConfig[BatchFilterKey.DATE_END]]
    : []

  const sortOrder = filterConfig[BatchFilterKey.SORT_BY] === BatchDataKeyColumn.CREATED_AT
    ? DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[filterConfig[BatchFilterKey.SORT_ORDER]]
    : ''

  return {
    title: localize(Localization.CREATION_DATE),
    dataIndex: BatchDataKeyColumn.CREATED_AT,
    filterDropdown: ({
      setSelectedKeys,
      confirm,
      visible,
    }) => (
      <TableDateRangeFilter
        autoFocus={visible}
        confirm={confirm}
        dateRange={filteredValue}
        onChange={setSelectedKeys}
      />
    ),
    filterIcon: (
      <TableFilterIndicator
        active={!!filteredValue?.length}
        icon={<CalendarIcon />}
      />
    ),
    filteredValue,
    key: BatchDataKeyColumn.CREATED_AT,
    render: (date) => toLocalizedDateString(date, true),
    sorter: true,
    sortOrder,
  }
}

export {
  generateBatchesCreationDateColumn,
}
