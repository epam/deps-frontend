
import { LongText } from '@/components/LongText'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TYPE_FILTER } from '@/constants/automation'
import { DocumentTypesGroupsFilter } from '../DocumentTypesGroupsFilter'
import { DocumentColumn, RESOURCE_DOCUMENT_COLUMN } from './DocumentColumn'

const dataIndex = 'groupInfo'

const generateGroupColumn = ({
  filteredValue,
  sortOrder,
}) => ({
  dataIndex: dataIndex,
  filterDropdown: ({ setSelectedKeys, confirm, visible }) => (
    <div data-automation={TYPE_FILTER}>
      <DocumentTypesGroupsFilter
        confirm={confirm}
        selectedKeys={filteredValue || []}
        setSelectedKeys={setSelectedKeys}
        visible={visible}
      />
    </div>
  ),
  filterIcon: (
    <TableFilterIndicator
      active={!!filteredValue?.length}
    />
  ),
  filteredValue,
  key: DocumentColumn.GROUP,
  sorter: true,
  sortOrder,
  title: RESOURCE_DOCUMENT_COLUMN[DocumentColumn.GROUP],
  render: (group) => <LongText text={group?.groupName || ''} />,
})

export {
  generateGroupColumn,
}
