
import { DocumentLLMType } from '@/containers/DocumentLLMType'
import { RESOURCE_DOCUMENT_COLUMN, DocumentColumn } from './DocumentColumn'

const generateLLMTypeColumn = () => ({
  dataIndex: DocumentColumn.LLM_TYPE,
  ellipsis: true,
  render: (llmType) => (
    llmType && <DocumentLLMType llmType={llmType} />
  ),
  title: RESOURCE_DOCUMENT_COLUMN[DocumentColumn.LLM_TYPE],
})

export {
  generateLLMTypeColumn,
}
