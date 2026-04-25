
import { enumToOptions } from '@/components/Select'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY, FileFilterKey } from '@/constants/navigation'
import { RESOURCE_FILE_STATUS, FileStatus } from '@/enums/FileStatus'
import { Localization, localize } from '@/localization/i18n'
import { FileStateCell } from '../FileStateCell'
import { FileDataKeyColumn } from './FileDataKeyColumn'

export const generateFileStateColumn = (filterConfig) => {
  const filteredValue = filterConfig[FileDataKeyColumn.STATE] || []

  const sortOrder = filterConfig[FileFilterKey.SORT_BY] === FileDataKeyColumn.STATE
    ? DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[filterConfig[FileFilterKey.SORT_ORDER]]
    : ''

  const options = enumToOptions(FileStatus, RESOURCE_FILE_STATUS)

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
    filterIcon: (
      <TableFilterIndicator
        active={!!filteredValue.length}
      />
    ),
    filteredValue,
    key: FileDataKeyColumn.STATE,
    title: localize(Localization.STATE),
    dataIndex: FileDataKeyColumn.STATE,
    render: (state, file) => (
      <FileStateCell file={file} />
    ),
    sorter: true,
    sortOrder,
  }
}
