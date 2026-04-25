
import { enumToOptions } from '@/components/Select'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY, BatchFilterKey } from '@/constants/navigation'
import { RESOURCE_BATCH_STATUS, BatchStatus } from '@/enums/BatchStatus'
import { Localization, localize } from '@/localization/i18n'
import { BatchStatusCell } from '../BatchStatusCell'
import { BatchDataKeyColumn } from './BatchDataKeyColumn'

const generateBatchStatusColumn = (filterConfig) => {
  const filteredValue = filterConfig[BatchDataKeyColumn.STATUS] || null
  const sortOrder = filterConfig[BatchFilterKey.SORT_BY] === BatchDataKeyColumn.STATUS
    ? DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[filterConfig[BatchFilterKey.SORT_ORDER]]
    : ''
  const options = enumToOptions(BatchStatus, RESOURCE_BATCH_STATUS)

  return {
    filterDropdown: ({ setSelectedKeys, confirm, visible }) => (
      <TableSelectFilter
        confirm={confirm}
        options={options}
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
    key: BatchDataKeyColumn.STATUS,
    title: localize(Localization.STATUS),
    dataIndex: BatchDataKeyColumn.STATUS,
    render: (status) => <BatchStatusCell status={status} />,
    sorter: true,
    sortOrder,
  }
}

export {
  generateBatchStatusColumn,
}
