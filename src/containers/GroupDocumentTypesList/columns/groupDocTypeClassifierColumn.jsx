
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { Localization, localize } from '@/localization/i18n'
import { stringsSorter } from '@/utils/string'
import { DocumentTypeClassifier } from '../DocumentTypeClassifier'
import { GroupDocTypeColumn } from './GroupDocTypeColumn'

const generateGroupDocTypeClassifierColumn = ({
  filteredValue,
  sortOrder,
}) => ({
  title: localize(Localization.CLASSIFIER),
  dataIndex: GroupDocTypeColumn.CLASSIFIER,
  key: GroupDocTypeColumn.CLASSIFIER,
  render: (classifier, dt) => (
    <DocumentTypeClassifier
      classifier={classifier}
      documentTypeId={dt.id}
    />
  ),
  sorter: (a, b) => stringsSorter(a.classifier?.name, b.classifier?.name),
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
  generateGroupDocTypeClassifierColumn,
}
