
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY, BatchFilterKey } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { BatchNameCell } from '../BatchNameCell'
import { BatchDataKeyColumn } from './BatchDataKeyColumn'

const generateBatchNameColumn = (filterConfig) => {
  const filteredValue = filterConfig[BatchDataKeyColumn.NAME] || null
  const sortOrder = filterConfig[BatchFilterKey.SORT_BY] === BatchDataKeyColumn.NAME
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
    key: BatchDataKeyColumn.NAME,
    sortOrder,
    title: localize(Localization.NAME),
    dataIndex: BatchDataKeyColumn.NAME,
    render: (name, record) => (
      <BatchNameCell
        files={record.files}
        name={name}
      />
    ),
  }
}

export {
  generateBatchNameColumn,
}
