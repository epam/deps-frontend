
import { ExtractionType } from '@/enums/ExtractionType'
import { FieldType } from '@/enums/FieldType'
import { KnownLanguage } from '@/enums/KnownLanguage'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { TableFieldColumn, TableFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { ExtractedDataField, FieldData } from '@/models/ExtractedData'
import {
  SourceCellCoordinate,
  SourceCellRange,
  SourceTableCoordinates,
} from '@/models/SourceCoordinates'

const mockDocumentTypeCode = 'mockDocumentTypeCode'
const pk1 = 'tablePk1'
const pk2 = 'tablePk2'
const sourceId1 = 'sourceId1'
const sourceId2 = 'sourceId2'

const docTypeField1 = new DocumentTypeField(
  'tableCode1',
  'Table 1',
  new TableFieldMeta([
    new TableFieldColumn('column title'),
  ]),
  FieldType.TABLE,
  false,
  0,
  mockDocumentTypeCode,
  pk1,
)

const docTypeField2 = new DocumentTypeField(
  'tableCode2',
  'Table 2',
  new TableFieldMeta([
    new TableFieldColumn('column title'),
  ]),
  FieldType.TABLE,
  false,
  0,
  mockDocumentTypeCode,
  pk2,
)

const fieldFromPage1 = new ExtractedDataField(
  pk1,
  new FieldData(
    'value1',
    null,
    null,
    null,
    null,
    [
      new SourceTableCoordinates(
        sourceId1,
        [
          new SourceCellRange(new SourceCellCoordinate(1, 2)),
          new SourceCellRange(new SourceCellCoordinate(3, 4)),
        ],
      ),
    ],
  ),
)

const fieldFromPage2 = new ExtractedDataField(
  pk2,
  new FieldData(
    'value2',
    null,
    null,
    null,
    null,
    [
      new SourceTableCoordinates(
        sourceId2,
        [
          new SourceCellRange(new SourceCellCoordinate(1, 2)),
          new SourceCellRange(new SourceCellCoordinate(3, 4)),
        ],
      ),
    ],
  ),
)

const mockDocumentType = new DocumentType(
  mockDocumentTypeCode,
  'Test Doc Type',
  'mockEngineCode',
  KnownLanguage.ENGLISH,
  ExtractionType.TEMPLATE,
  [docTypeField1, docTypeField2],
)

const mockExtractedData = [fieldFromPage1, fieldFromPage2]

export {
  mockDocumentType,
  mockExtractedData,
}
