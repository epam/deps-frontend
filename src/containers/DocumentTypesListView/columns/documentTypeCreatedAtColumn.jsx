
import { CalendarIcon } from '@/components/Icons/CalendarIcon'
import { TableDateRangeFilter } from '@/components/Table/TableDateRangeFilter'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { datesSorting, toLocalizedDateString } from '@/utils/dayjs'
import { DocumentTypesColumnKey, RESOURCE_DOCUMENT_TYPES_COLUMN } from './DocumentTypesColumn'

const generateDocumentTypeCreatedAtColumn = ({
  filteredValue,
  sortOrder,
}) => ({
  dataIndex: DocumentTypesColumnKey.CREATED_AT,
  ellipsis: true,
  filterDropdown: ({
    setSelectedKeys,
    confirm,
    visible,
  }) => (
    <div>
      <TableDateRangeFilter
        autoFocus={visible}
        confirm={confirm}
        dateRange={filteredValue}
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
  key: DocumentTypesColumnKey.CREATED_AT,
  render: (date) => toLocalizedDateString(date, true),
  title: RESOURCE_DOCUMENT_TYPES_COLUMN[DocumentTypesColumnKey.CREATED_AT],
  sorter: (a, b) => datesSorting(a.createdAt, b.createdAt),
  sortOrder,
})

export {
  generateDocumentTypeCreatedAtColumn,
}
