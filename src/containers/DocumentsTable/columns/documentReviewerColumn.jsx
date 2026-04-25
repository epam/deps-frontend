
import { LongText } from '@/components/LongText'
import { User } from '@/models/User'
import { DocumentColumn, RESOURCE_DOCUMENT_COLUMN } from './DocumentColumn'

const generateDocumentReviewerColumn = () => ({
  dataIndex: DocumentColumn.REVIEWER,
  ellipsis: true,
  key: DocumentColumn.REVIEWER,
  render: (record) => (
    record && <LongText text={User.getTitle(record)} />
  ),
  sorter: true,
  title: RESOURCE_DOCUMENT_COLUMN[DocumentColumn.REVIEWER],
})

export {
  generateDocumentReviewerColumn,
}
