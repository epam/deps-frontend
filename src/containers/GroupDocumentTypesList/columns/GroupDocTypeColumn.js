
import { GroupDocumentTypesFilterKey } from '@/constants/navigation'

const GroupDocTypeColumn = {
  NAME: 'name',
  TYPE_OF_EXTRACTOR: 'extractionType',
  CLASSIFIER: 'classifier',
  ACTIONS: 'actions',
}

const GROUP_DOC_TYPE_COLUMN_TO_FILTER_KEY = {
  [GroupDocTypeColumn.NAME]: GroupDocumentTypesFilterKey.NAME,
  [GroupDocTypeColumn.TYPE_OF_EXTRACTOR]: GroupDocumentTypesFilterKey.EXTRACTION_TYPE,
  [GroupDocTypeColumn.CLASSIFIER]: GroupDocumentTypesFilterKey.CLASSIFIER,
}

export {
  GroupDocTypeColumn,
  GROUP_DOC_TYPE_COLUMN_TO_FILTER_KEY,
}
