
import { enumToOptions } from '@/components/Select'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { KnownOCREngine, RESOURCE_OCR_ENGINE } from '@/enums/KnownOCREngine'
import { Localization, localize } from '@/localization/i18n'
import { stringsSorter } from '@/utils/string'
import { ColumnCode } from '../ColumnCode'

export const generateFileEngineColumn = (filterConfig) => {
  const filteredValue = filterConfig[ColumnCode.ENGINE]
  const sortOrder = filterConfig.sortField === ColumnCode.ENGINE ? filterConfig.sortDirect : ''
  const options = enumToOptions(KnownOCREngine, RESOURCE_OCR_ENGINE)

  return ({
    dataIndex: ColumnCode.ENGINE,
    ellipsis: true,
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
    key: ColumnCode.ENGINE,
    render: (engineCode) => engineCode && (
      <span data-testid="engine-title">
        {RESOURCE_OCR_ENGINE[engineCode]}
      </span>
    ),
    sorter: (a, b) => stringsSorter(RESOURCE_OCR_ENGINE[a[ColumnCode.ENGINE]], RESOURCE_OCR_ENGINE[b[ColumnCode.ENGINE]]),
    sortOrder,
    title: localize(Localization.ENGINE_UPPERCASE),
  })
}
