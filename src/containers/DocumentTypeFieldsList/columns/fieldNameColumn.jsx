
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { LongText } from '@/components/LongText'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { Localization, localize } from '@/localization/i18n'
import { stringsSorter } from '@/utils/string'
import { FieldColumn } from '../FieldColumn'

const onFilterChange = (
  val,
  {
    clearFilters,
    setSelectedKeys,
  },
) => {
  if (val) {
    return setSelectedKeys([val])
  }
  setSelectedKeys([])
  clearFilters()
}

const generateFieldNameColumn = () => ({
  title: localize(Localization.NAME),
  dataIndex: FieldColumn.NAME,
  render: (name) => <LongText text={name} />,
  sorter: (a, b) => stringsSorter(a.name, b.name),
  filterDropdown: ({
    confirm,
    selectedKeys,
    visible,
    ...restFilterProps
  }) => (
    <TableSearchDropdown
      confirm={() => confirm({ closeDropdown: false })}
      onChange={(val) => onFilterChange(val, restFilterProps)}
      searchValue={selectedKeys[0]}
      visible={visible}
    />
  ),
  filterIcon: (filtered) => (
    <TableFilterIndicator
      active={filtered}
      icon={<SearchIcon />}
    />
  ),
  onFilter: (value, record) => (
    record[FieldColumn.NAME]
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase())
  ),
})

export {
  generateFieldNameColumn,
}
