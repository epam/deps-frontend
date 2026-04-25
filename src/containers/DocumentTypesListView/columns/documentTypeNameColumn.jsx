
import { LongText } from '@/components/LongText'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { stringsSorter } from '@/utils/string'
import { SearchIcon } from './documentTypeColumn.styles'
import { DocumentTypesColumnKey, RESOURCE_DOCUMENT_TYPES_COLUMN } from './DocumentTypesColumn'

const generateDocumentTypeNameColumn = ({
  filteredValue,
  sortOrder,
}) => ({
  ellipsis: true,
  defaultFilteredValue: filteredValue,
  filterDropdown: ({
    setSelectedKeys,
    confirm,
    visible,
  }) => (
    <TableSearchDropdown
      confirm={() => confirm({ closeDropdown: false })}
      onChange={setSelectedKeys}
      searchValue={filteredValue}
      visible={visible}
    />
  ),
  filterIcon: (
    <TableFilterIndicator
      active={!!filteredValue?.length}
      icon={<SearchIcon />}
    />
  ),
  filteredValue,
  key: DocumentTypesColumnKey.NAME,
  sorter: (a, b) => stringsSorter(a.name, b.name),
  sortOrder,
  title: RESOURCE_DOCUMENT_TYPES_COLUMN[DocumentTypesColumnKey.NAME],
  render: (record) => (
    <LongText text={record.name} />
  ),
})

export {
  generateDocumentTypeNameColumn,
}
