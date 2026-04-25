import { LongText } from '@/components/LongText'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY, BatchFilterKey } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { BatchDataKeyColumn } from './BatchDataKeyColumn'

const generateBatchesGroupColumn = (filterConfig) => {
  const filteredValue = filterConfig[BatchDataKeyColumn.GROUP] || null
  const sortOrder = filterConfig[BatchFilterKey.SORT_BY] === BatchDataKeyColumn.GROUP
    ? DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[filterConfig[BatchFilterKey.SORT_ORDER]]
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
    key: BatchDataKeyColumn.GROUP,
    sortOrder,
    title: localize(Localization.GROUP),
    dataIndex: BatchDataKeyColumn.GROUP,
    render: (group) => group && <LongText text={group.name} />,
  }
}

export {
  generateBatchesGroupColumn,
}
