
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { FileFilterKey } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { FileLabelsCell } from '../FileLabelsCell'
import { FileDataKeyColumn } from './FileDataKeyColumn'

export const generateFileLabelsColumn = (filterConfig) => {
  const filteredValue = filterConfig[FileFilterKey.LABELS] || null

  return ({
    title: localize(Localization.LABELS),
    dataIndex: FileDataKeyColumn.LABELS,
    key: FileDataKeyColumn.LABELS,
    filterDropdown: ({ setSelectedKeys, confirm, visible }) => (
      <TableSearchDropdown
        confirm={() => confirm({ closeDropdown: false })}
        onChange={setSelectedKeys}
        searchValue={filteredValue}
        visible={visible}
      />
    ),
    filteredValue,
    render: (labels) => !!labels.length && (
      <FileLabelsCell labels={labels} />
    ),
  })
}
