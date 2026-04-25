
import { LongText } from '@/components/LongText'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY, FileFilterKey } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { FileDataKeyColumn } from './FileDataKeyColumn'

export const generateFileNameColumn = (filterConfig) => {
  const filteredValue = filterConfig[FileDataKeyColumn.NAME] || null

  const sortOrder = filterConfig[FileFilterKey.SORT_BY] === FileDataKeyColumn.NAME
    ? DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[filterConfig[FileFilterKey.SORT_ORDER]]
    : ''

  return {
    filterDropdown: ({ setSelectedKeys, confirm, visible }) => (
      <TableSearchDropdown
        confirm={() => confirm({ closeDropdown: false })}
        onChange={setSelectedKeys}
        searchValue={filteredValue}
        visible={visible}
      />
    ),
    sorter: true,
    filteredValue,
    key: FileDataKeyColumn.NAME,
    sortOrder,
    title: localize(Localization.TITLE),
    dataIndex: FileDataKeyColumn.NAME,
    render: (name) => (
      <LongText text={name} />
    ),
  }
}
