
import { CalendarIcon } from '@/components/Icons/CalendarIcon'
import { TableDateRangeFilter } from '@/components/Table/TableDateRangeFilter'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { DATE_FILTER } from '@/constants/automation'
import { toLocalizedDateString } from '@/utils/dayjs'
import { DocumentColumn, RESOURCE_DOCUMENT_COLUMN } from './DocumentColumn'

const generateDocumentDateColumn = ({
  filteredValue,
  sortOrder,
}) => ({
  dataIndex: DocumentColumn.DATE,
  ellipsis: true,
  filterDropdown: ({
    setSelectedKeys,
    confirm,
    visible,
  }) => (
    <div data-automation={DATE_FILTER}>
      <TableDateRangeFilter
        autoFocus={visible}
        confirm={confirm}
        dateRange={filteredValue || []}
        onChange={setSelectedKeys}
      />
    </div>
  ),
  filterIcon: (
    <TableFilterIndicator
      active={!!filteredValue?.length}
      icon={<CalendarIcon />}
    />
  ),
  filteredValue,
  key: DocumentColumn.DATE,
  render: (date) => toLocalizedDateString(date, true),
  title: RESOURCE_DOCUMENT_COLUMN[DocumentColumn.DATE],
  sorter: true,
  sortOrder,
})

export {
  generateDocumentDateColumn,
}
