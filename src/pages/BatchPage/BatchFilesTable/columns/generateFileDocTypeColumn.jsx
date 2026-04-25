import { SearchIcon } from '@/components/Icons/SearchIcon'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { Localization, localize } from '@/localization/i18n'
import { BatchFileDocumentType } from '@/pages/BatchPage/BatchFilesTable/BatchFileDocumentType'
import { ColumnCode } from '../ColumnCode'

const generateFileDocTypeColumn = (filterConfig) => {
  const filteredValue = filterConfig[ColumnCode.DOC_TYPE] || ''

  return {
    dataIndex: ColumnCode.DOC_TYPE,
    key: ColumnCode.DOC_TYPE,
    filterDropdown: ({ setSelectedKeys, confirm, visible }) => (
      <TableSearchDropdown
        confirm={() => confirm({ closeDropdown: false })}
        onChange={setSelectedKeys}
        searchValue={filteredValue}
        visible={visible}
      />
    ),
    filterIcon: () => (
      <TableFilterIndicator
        active={!!filteredValue}
        icon={<SearchIcon />}
      />
    ),
    filteredValue,
    render: (documentTypeId) => documentTypeId && <BatchFileDocumentType documentTypeId={documentTypeId} />,
    sorter: false,
    title: localize(Localization.DOCUMENT_TYPE).toUpperCase(),
  }
}

export {
  generateFileDocTypeColumn,
}
