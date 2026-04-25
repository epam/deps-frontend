
import { ExtractionType } from '@/enums/ExtractionType'
import { FieldType } from '@/enums/FieldType'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import {
  DocumentTypeFieldMeta,
  TableFieldMeta,
  DictFieldMeta,
  ListFieldMeta,
} from '@/models/DocumentTypeFieldMeta'

const mockInvalidDocumentType = new DocumentType(
  'whole',
  'Whole Fields',
  'TESSERACT',
  'eng',
  ExtractionType.ML,
  [
    new DocumentTypeField(
      'NEWDOC',
      'NEW DOC',
      new DocumentTypeFieldMeta(),
      FieldType.STRING,
      false,
      0,
      'whole',
      720,
    ),
    new DocumentTypeField(
      'listTables',
      'List Tables',
      new ListFieldMeta(FieldType.TABLE, new TableFieldMeta()),
      FieldType.LIST,
      false,
      0,
      'whole',
      731,
    ),
    new DocumentTypeField(
      'table',
      'Table',
      null,
      FieldType.TABLE,
      false,
      0,
      'whole',
      729,
    ),
    new DocumentTypeField(
      'kv',
      'KV',
      new DictFieldMeta(),
      FieldType.DICTIONARY,
      false,
      0,
      'whole',
      727,
    ),
  ],
)

export { mockInvalidDocumentType }
