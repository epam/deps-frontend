
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { DocumentTypesGroupsFilterKey } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypesCell } from '../DocumentTypesCell'
import { DocumentTypesGroupsColumn } from './DocumentTypesGroupsColumn'

const generateGroupDocumentTypesColumn = (filterConfig, documentTypes) => {
  const filteredValue = filterConfig[DocumentTypesGroupsFilterKey.DOCUMENT_TYPE_ID] || []
  const options = documentTypes.map((dt) => DocumentType.toOption(dt))

  return ({
    title: localize(Localization.DOCUMENT_TYPES),
    dataIndex: DocumentTypesGroupsColumn.DOC_TYPES,
    key: DocumentTypesGroupsFilterKey.DOCUMENT_TYPE_ID,
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
        active={!!filteredValue.length}
      />
    ),
    filteredValue,
    render: (documentTypesIds) => !!documentTypesIds.length && (
      <DocumentTypesCell
        documentTypesIds={documentTypesIds}
      />
    ),
  })
}

export {
  generateGroupDocumentTypesColumn,
}
