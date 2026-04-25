
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { FileFilterKey } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { ReferenceCell } from '../ReferenceCell'
import { FileDataKeyColumn } from './FileDataKeyColumn'

export const generateFileReferenceColumn = (filterConfig) => {
  const filteredValue = filterConfig[FileFilterKey.REFERENCE] || null

  return {
    filterDropdown: ({ setSelectedKeys, confirm, visible }) => (
      <TableSearchDropdown
        confirm={() => confirm({ closeDropdown: false })}
        onChange={setSelectedKeys}
        searchValue={filteredValue}
        visible={visible}
      />
    ),
    filteredValue,
    key: FileDataKeyColumn.REFERENCE,
    title: localize(Localization.REFERENCE),
    dataIndex: FileDataKeyColumn.REFERENCE,
    render: (reference) => reference && <ReferenceCell reference={reference} />,
  }
}
