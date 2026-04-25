
import { RESOURCE_DOCUMENT_COLUMN, DocumentColumn } from './DocumentColumn'

const generateLanguageColumn = ({
  columnData,
}) => ({
  dataIndex: DocumentColumn.LANGUAGE,
  ellipsis: true,
  render: (languageCode) => (
    columnData.find((e) => e.value === languageCode)?.text
  ),
  title: RESOURCE_DOCUMENT_COLUMN[DocumentColumn.LANGUAGE],
})

export {
  generateLanguageColumn,
}
