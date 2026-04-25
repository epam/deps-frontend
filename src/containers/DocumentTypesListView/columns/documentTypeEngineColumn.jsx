
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { stringsSorter } from '@/utils/string'
import { DocumentTypesColumnKey, RESOURCE_DOCUMENT_TYPES_COLUMN } from './DocumentTypesColumn'

const generateDocumentTypeEngineColumn = ({
  filteredValue,
  sortOrder,
  columnData,
}) => ({
  dataIndex: DocumentTypesColumnKey.ENGINE,
  ellipsis: true,
  filterDropdown: ({ setSelectedKeys, confirm, visible }) => (
    <TableSelectFilter
      confirm={confirm}
      options={columnData}
      selectedKeys={filteredValue || []}
      setSelectedKeys={setSelectedKeys}
      visible={visible}
    />
  ),
  filterIcon: (
    <TableFilterIndicator
      active={!!filteredValue?.length}
    />
  ),
  filteredValue,
  key: DocumentTypesColumnKey.ENGINE,
  sorter: (a, b) => stringsSorter(a.engine, b.engine),
  sortOrder,
  title: RESOURCE_DOCUMENT_TYPES_COLUMN[DocumentTypesColumnKey.ENGINE],
  render: (engineCode) => (
    columnData.find((e) => e.value === engineCode)?.text
  ),
})

export {
  generateDocumentTypeEngineColumn,
}
