
import { ExtractionType } from '@/enums/ExtractionType'
import { FieldType } from '@/enums/FieldType'
import { KnownLanguage } from '@/enums/KnownLanguage'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DictFieldMeta } from '@/models/DocumentTypeFieldMeta'
import {
  DictFieldData,
  ExtractedDataField,
  FieldData,
} from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'

const mockDocumentTypeCode = 'mockDocumentTypeCode'
const page1 = 1
const page2 = 2
const pk1 = 'keyValuePairPk1'
const pk2 = 'keyValuePairPk2'

const docTypeField1 = new DocumentTypeField(
  'keyValuePairField1',
  'Key Value Pair Field 1',
  new DictFieldMeta(),
  FieldType.DICTIONARY,
  false,
  1,
  mockDocumentTypeCode,
  pk1,
)

const docTypeField2 = new DocumentTypeField(
  'keyValuePairField2',
  'Key Value Pair Field 2',
  new DictFieldMeta(),
  FieldType.DICTIONARY,
  false,
  1,
  mockDocumentTypeCode,
  pk2,
)

const fieldFromPage1 = new ExtractedDataField(
  pk1,
  new DictFieldData(
    new FieldData(
      'key content',
      new FieldCoordinates(page1, 1, 1, 2, 2),
    ),
    new FieldData(
      'value content',
      new FieldCoordinates(page1, 1, 1, 2, 2),
    ),
  ),
)

const fieldFromPage2 = new ExtractedDataField(
  pk2,
  new DictFieldData(
    new FieldData(
      'key content',
      new FieldCoordinates(page2, 1, 1, 2, 2),
    ),
    new FieldData(
      'value content',
      new FieldCoordinates(page2, 1, 1, 2, 2),
    ),
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
