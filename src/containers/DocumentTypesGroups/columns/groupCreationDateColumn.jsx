
import { CalendarIcon } from '@/components/Icons/CalendarIcon'
import { TableDateRangeFilter } from '@/components/Table/TableDateRangeFilter'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import {
  DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY,
  DocumentTypesGroupsFilterKey,
} from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { toLocalizedDateString } from '@/utils/dayjs'
import { DocumentTypesGroupsColumn } from './DocumentTypesGroupsColumn'

const generateGroupCreationDateColumn = (filterConfig) => {
  const dateStart = filterConfig[DocumentTypesGroupsFilterKey.DATE_START]
  const dateEnd = filterConfig[DocumentTypesGroupsFilterKey.DATE_END]
  const filteredValue = (dateStart || dateEnd) ? [dateStart, dateEnd] : []
  const dataSortOrder = filterConfig[DocumentTypesGroupsFilterKey.SORT_ORDER]
  const tableSortOrder = filterConfig[DocumentTypesGroupsFilterKey.SORT_BY] === DocumentTypesGroupsColumn.CREATION_DATE
    ? DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[dataSortOrder]
    : ''

  return ({
    title: localize(Localization.CREATION_DATE),
    dataIndex: DocumentTypesGroupsColumn.CREATION_DATE,
    key: DocumentTypesGroupsColumn.CREATION_DATE,
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
    filterIcon: () => (
      <TableFilterIndicator
        active={!!filteredValue.length}
        icon={<CalendarIcon />}
      />
    ),
    filteredValue,
    sorter: true,
    sortOrder: tableSortOrder,
    render: (date) => toLocalizedDateString(date, true),
  })
}

export {
  generateGroupCreationDateColumn,
}
