import { SearchIcon } from '@/components/Icons/SearchIcon'
import { LongText } from '@/components/LongText'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { Localization, localize } from '@/localization/i18n'
import { stringsSorter } from '@/utils/string'
import { ColumnCode } from '../ColumnCode'

export const generateFileNameColumn = (filterConfig) => {
  const filteredValue = filterConfig[ColumnCode.NAME] || ''
  const sortOrder = filterConfig.sortField === ColumnCode.NAME ? filterConfig.sortDirect : ''

  return ({
    dataIndex: ColumnCode.NAME,
    key: ColumnCode.NAME,
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
    render: (name) => <LongText text={name} />,
    sorter: (a, b) => stringsSorter(a[ColumnCode.NAME], b[ColumnCode.NAME]),
    sortOrder,
    title: localize(Localization.FILE_NAME).toUpperCase(),
  })
}
