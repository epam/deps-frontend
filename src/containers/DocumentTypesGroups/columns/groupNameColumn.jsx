
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { LongText } from '@/components/LongText'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import {
  DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY,
  DocumentTypesGroupsFilterKey,
} from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypesGroupsColumn } from './DocumentTypesGroupsColumn'

const generateGroupNameColumn = (filterConfig) => {
  const filteredValue = filterConfig[DocumentTypesGroupsFilterKey.NAME] || ''
  const dataSortOrder = filterConfig[DocumentTypesGroupsFilterKey.SORT_ORDER]
  const tableSortOrder = filterConfig[DocumentTypesGroupsFilterKey.SORT_BY] === DocumentTypesGroupsColumn.NAME
    ? DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[dataSortOrder]
    : ''

  return ({
    title: localize(Localization.NAME),
    dataIndex: DocumentTypesGroupsColumn.NAME,
    key: DocumentTypesGroupsColumn.NAME,
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
    filterIcon: () => (
      <TableFilterIndicator
        active={!!filteredValue}
        icon={<SearchIcon />}
      />
    ),
    filteredValue,
    sorter: true,
    sortOrder: tableSortOrder,
    render: (name) => <LongText text={name} />,
  })
}

export {
  generateGroupNameColumn,
}
