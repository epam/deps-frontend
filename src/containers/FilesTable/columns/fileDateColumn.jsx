
import { CalendarIcon } from '@/components/Icons/CalendarIcon'
import { TableDateRangeFilter } from '@/components/Table/TableDateRangeFilter'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY, FileFilterKey } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { toLocalizedDateString } from '@/utils/dayjs'
import { FileDataKeyColumn } from './FileDataKeyColumn'

export const generateFileDateColumn = (filterConfig) => {
  const filteredValue = filterConfig[FileFilterKey.DATE_START]
    ? [filterConfig[FileFilterKey.DATE_START], filterConfig[FileFilterKey.DATE_END]]
    : []

  const sortOrder = filterConfig[FileFilterKey.SORT_BY] === FileDataKeyColumn.CREATED_AT
    ? DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[filterConfig[FileFilterKey.SORT_ORDER]]
    : ''

  return {
    title: localize(Localization.CREATION_DATE),
    dataIndex: FileDataKeyColumn.CREATED_AT,
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
        active={!!filteredValue.length}
        icon={<CalendarIcon />}
      />
    ),
    filteredValue,
    key: FileDataKeyColumn.CREATED_AT,
    render: (createdAt) => toLocalizedDateString(createdAt, true),
    sorter: true,
    sortOrder,
  }
}
