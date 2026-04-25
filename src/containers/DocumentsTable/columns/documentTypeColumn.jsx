
import { LongText } from '@/components/LongText'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { DOCUMENT_TYPES, TYPE_FILTER } from '@/constants/automation'
import { DocumentColumn, RESOURCE_DOCUMENT_COLUMN } from './DocumentColumn'

const generateDocumentTypeColumn = ({
  filteredValue,
  sortOrder,
  columnData,
}) => ({
  dataIndex: DocumentColumn.DOCUMENT_TYPE,
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
  key: DocumentColumn.DOCUMENT_TYPE,
  sorter: true,
  sortOrder,
  title: RESOURCE_DOCUMENT_COLUMN[DocumentColumn.DOCUMENT_TYPE],
  render: (record) => (
    <div data-automation={DOCUMENT_TYPES}>
      <LongText text={record.name} />
    </div>
  ),
})

export {
  generateDocumentTypeColumn,
}
