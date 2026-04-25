
import { ExtractionType } from '@/enums/ExtractionType'
import { FieldType } from '@/enums/FieldType'
import { KnownLanguage } from '@/enums/KnownLanguage'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { ListFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { ExtractedDataField, FieldData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'

const mockDocumentTypeCode = 'mockDocumentTypeCode'
const page1 = 1
const page2 = 2
const pk1 = 'listOfStringPk1'
const pk2 = 'listOfStringPk2'

const docTypeField1 = new DocumentTypeField(
  'listOfStringField1',
  'List Of String Field 1',
  new ListFieldMeta(
    FieldType.STRING,
    {
      charBlacklist: null,
      charWhitelist: null,
    }),
  FieldType.LIST,
  false,
  1,
  mockDocumentTypeCode,
  pk1,
)

const docTypeField2 = new DocumentTypeField(
  'listOfStringField2',
  'List Of String Field 2',
  new ListFieldMeta(
    FieldType.STRING,
    {
      charBlacklist: null,
      charWhitelist: null,
    }),
  FieldType.LIST,
  false,
  1,
  mockDocumentTypeCode,
  pk2,
)

const fieldFromPage1 = new ExtractedDataField(
  pk1,
  [
    new FieldData(
      'string1',
      new FieldCoordinates(page1, 1, 1, 2, 2),
    ),
    new FieldData(
      'string2',
      new FieldCoordinates(page1, 1, 1, 2, 2),
    ),
  ],
)

const fieldFromPage2 = new ExtractedDataField(
  pk2,
  [
    new FieldData(
      'string1',
      new FieldCoordinates(page2, 1, 1, 2, 2),
    ),
    new FieldData(
      'string2',
      new FieldCoordinates(page2, 1, 1, 2, 2),
    ),
  ],
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
