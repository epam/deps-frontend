
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { DOCUMENT_ENGINE_NAME, ENGINE_FILTER } from '@/constants/automation'
import { DocumentColumn, RESOURCE_DOCUMENT_COLUMN } from './DocumentColumn'

const generateDocumentEngineColumn = ({
  filteredValue,
  sortOrder,
  columnData,
}) => ({
  dataIndex: DocumentColumn.ENGINE,
  ellipsis: true,
  filterDropdown: ({ setSelectedKeys, confirm, visible }) => (
    <div data-automation={ENGINE_FILTER}>
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
  key: DocumentColumn.ENGINE,
  render: (engineCode) => {
    const engineName = columnData.find((e) => e.value === engineCode)?.text
    return engineName ? (
      <span data-automation={DOCUMENT_ENGINE_NAME}>
        {engineName}
      </span>
    ) : null
  },
  sorter: true,
  sortOrder,
  title: RESOURCE_DOCUMENT_COLUMN[DocumentColumn.ENGINE],
})

export {
  generateDocumentEngineColumn,
}
