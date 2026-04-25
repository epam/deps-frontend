
import { mockDocumentType } from '@/mocks/mockDocumentType'
import { mockSelector } from '@/mocks/mockSelector'
import { ExtractionType } from '@/enums/ExtractionType'
import { DocumentType } from '@/models/DocumentType'

const documentTypeSelector = mockSelector(
  new DocumentType(
    'mockDocTypeCode',
    'mockDocTypeName',
    'mockEngineCode',
    'mockLanguageCode',
    ExtractionType.ML,
    mockDocumentType.fields,
  ),
)

const activeTabSelector = mockSelector('TAB1')

export {
  documentTypeSelector,
  activeTabSelector,
}
