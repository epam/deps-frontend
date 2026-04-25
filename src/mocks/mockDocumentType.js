
import { ExtractionType } from '@/enums/ExtractionType'
import { FieldType } from '@/enums/FieldType'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta, ListFieldMeta, TableFieldMeta } from '@/models/DocumentTypeFieldMeta'

const mockDocumentType = new DocumentType(
  'mockDocumentTypeCode',
  'mockDocumentTypeName',
  'mockEngineCode',
  'mockLanguageCode',
  ExtractionType.ML,
  [
    new DocumentTypeField(
      'verticalReference',
      'Vertical Reference',
      new DocumentTypeFieldMeta('BC', 'A'),
      FieldType.STRING,
      false,
      1,
      'mockDocumentTypeCode',
      1,
    ),
    new DocumentTypeField(
      'glElevation',
      'GL Elevation',
      new DocumentTypeFieldMeta('BC', 'A'),
      FieldType.STRING,
      false,
      2,
      'mockDocumentTypeCode',
      2,
    ),
    new DocumentTypeField(
      'table',
      'Table',
      new TableFieldMeta([]),
      FieldType.TABLE,
      false,
      3,
      'mockDocumentTypeCode',
      3,
    ),
    new DocumentTypeField(
      'listOfTables',
      'List Of Tables',
      new ListFieldMeta(FieldType.TABLE),
      FieldType.LIST,
      false,
      4,
      'mockDocumentTypeCode',
      4,
    ),
    new DocumentTypeField(
      'fieldCode',
      'Field Name',
      new DocumentTypeFieldMeta('C', 'A'),
      FieldType.STRING,
      false,
      5,
      'mockDocumentTypeCode',
      5,
    ),
    new DocumentTypeField(
      'listOfCheckboxes',
      'List Of Checkboxes',
      new ListFieldMeta(FieldType.CHECKMARK),
      FieldType.LIST,
      false,
      6,
      'mockDocumentTypeCode',
      6,
    ),
  ],
)

export {
  mockDocumentType,
}
