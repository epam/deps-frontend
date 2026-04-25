
import { enumToOptions } from '@/components/Select'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { BatchFileStatus, RESOURCE_BATCH_FILE_STATUS } from '@/enums/BatchFileStatus'
import { Localization, localize } from '@/localization/i18n'
import { BatchFileStatusCell } from '@/pages/BatchPage/BatchFilesTable/BatchFileStatusCell'
import { stringsSorter } from '@/utils/string'
import { ColumnCode } from '../ColumnCode'

const generateFileStatusColumn = (filterConfig) => {
  const filteredValue = filterConfig[ColumnCode.STATUS] || []
  const sortOrder = filterConfig.sortField === ColumnCode.STATUS ? filterConfig.sortDirect : ''
  const options = enumToOptions(BatchFileStatus, RESOURCE_BATCH_FILE_STATUS)

  return {
    filterDropdown: ({ setSelectedKeys, confirm, visible }) => (
      <TableSelectFilter
        confirm={confirm}
        options={options}
        selectedKeys={filteredValue}
        setSelectedKeys={setSelectedKeys}
        visible={visible}
      />
    ),
    filterIcon: () => (
      <TableFilterIndicator
        active={!!filteredValue?.length}
      />
    ),
    filteredValue,
    key: ColumnCode.STATUS,
    title: localize(Localization.STATUS),
    dataIndex: ColumnCode.STATUS,
    render: (_, file) => <BatchFileStatusCell file={file} />,
    sorter: (a, b) => stringsSorter(RESOURCE_BATCH_FILE_STATUS[a[ColumnCode.STATUS]], RESOURCE_BATCH_FILE_STATUS[b[ColumnCode.STATUS]]),
    sortOrder,
  }
}

export {
  generateFileStatusColumn,
}
