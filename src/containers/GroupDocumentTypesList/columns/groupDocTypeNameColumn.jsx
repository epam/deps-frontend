
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { LongText } from '@/components/LongText'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { Localization, localize } from '@/localization/i18n'
import { stringsSorter } from '@/utils/string'
import { GroupDocTypeColumn } from './GroupDocTypeColumn'

const generateGroupDocTypeNameColumn = ({
  filteredValue,
  sortOrder,
}) => ({
  title: localize(Localization.NAME),
  dataIndex: GroupDocTypeColumn.NAME,
  key: GroupDocTypeColumn.NAME,
  render: (name) => <LongText text={name} />,
  sorter: (a, b) => stringsSorter(a.name, b.name),
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
  sortOrder,
})

export {
  generateGroupDocTypeNameColumn,
}
