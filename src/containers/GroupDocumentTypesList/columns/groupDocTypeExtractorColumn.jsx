
import { LongText } from '@/components/LongText'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { RESOURCE_EXTRACTION_TYPE } from '@/enums/ExtractionType'
import { Localization, localize } from '@/localization/i18n'
import { stringsSorter } from '@/utils/string'
import { GroupDocTypeColumn } from './GroupDocTypeColumn'

const generateGroupDocTypeExtractorColumn = ({
  filteredValue,
  sortOrder,
  columnData,
}) => ({
  title: localize(Localization.TYPE_OF_EXTRACTOR),
  dataIndex: GroupDocTypeColumn.TYPE_OF_EXTRACTOR,
  key: GroupDocTypeColumn.TYPE_OF_EXTRACTOR,
  render: (extractionType) => <LongText text={RESOURCE_EXTRACTION_TYPE[extractionType]} />,
  sorter: (a, b) => stringsSorter(a.extractionType, b.extractionType),
  filterDropdown: ({
    confirm,
    visible,
    setSelectedKeys,
  }) => (
    <TableSelectFilter
      confirm={confirm}
      options={columnData}
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
  sortOrder,
})

export {
  generateGroupDocTypeExtractorColumn,
}
