
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { TYPE_FILTER } from '@/constants/automation'
import { LongLabelsList } from '@/containers/LongLabelsList'
import { RESOURCE_DOCUMENT_COLUMN, DocumentColumn } from './DocumentColumn'

const CELL_OFFSET = 20

const generateDocumentLabelsColumn = ({
  filteredValue,
  columnData,
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
  key: DocumentColumn.LABELS,
  render: (text, record) => (
    <LongLabelsList
      documentId={record._id}
      labels={record.labels}
      offset={CELL_OFFSET}
    />
  ),
  title: RESOURCE_DOCUMENT_COLUMN[DocumentColumn.LABELS],
})

export {
  generateDocumentLabelsColumn,
}
