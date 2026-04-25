
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { stringsSorter } from '@/utils/string'
import { DocumentTypesColumnKey, RESOURCE_DOCUMENT_TYPES_COLUMN } from './DocumentTypesColumn'

const generateDocumentTypeLanguageColumn = ({
  filteredValue,
  sortOrder,
  columnData,
}) => ({
  dataIndex: DocumentTypesColumnKey.LANGUAGE,
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
  key: DocumentTypesColumnKey.LANGUAGE,
  sorter: (a, b) => stringsSorter(a.language, b.language),
  sortOrder,
  title: RESOURCE_DOCUMENT_TYPES_COLUMN[DocumentTypesColumnKey.LANGUAGE],
  render: (languageCode) => (
    columnData.find((e) => e.value === languageCode)?.text
  ),
})

export {
  generateDocumentTypeLanguageColumn,
}
