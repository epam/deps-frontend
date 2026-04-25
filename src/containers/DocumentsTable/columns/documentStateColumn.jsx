
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { TYPE_FILTER } from '@/constants/automation'
import { DocumentStatus } from '@/containers/DocumentStatus'
import { DocumentColumn, RESOURCE_DOCUMENT_COLUMN } from './DocumentColumn'

const generateDocumentStateColumn = ({
  filteredValue,
  columnData,
  sortOrder,
}) => ({
  ellipsis: true,
  filterDropdown: ({ setSelectedKeys, confirm, visible }) => (
    <div data-automation={TYPE_FILTER}>
      <TableSelectFilter
        confirm={confirm}
        options={columnData}
        selectedKeys={filteredValue || []}
        setSelectedKeys={setSelectedKeys}
        visible={visible}
      />
    </div>
  ),
  filterIcon: (
    <TableFilterIndicator
      active={!!filteredValue?.length}
    />
  ),
  filteredValue,
  key: DocumentColumn.STATE,
  render: (record) => (
    <DocumentStatus status={record.state} />
  ),
  sorter: true,
  sortOrder,
  title: RESOURCE_DOCUMENT_COLUMN[DocumentColumn.STATE],
})

export {
  generateDocumentStateColumn,
}
