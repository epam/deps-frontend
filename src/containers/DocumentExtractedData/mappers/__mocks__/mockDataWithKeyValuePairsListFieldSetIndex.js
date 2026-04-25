
import { ExtractionType } from '@/enums/ExtractionType'
import { FieldType } from '@/enums/FieldType'
import { KnownLanguage } from '@/enums/KnownLanguage'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta, ListFieldMeta } from '@/models/DocumentTypeFieldMeta'
import {
  DictFieldData,
  ExtractedDataField,
  FieldData,
} from '@/models/ExtractedData'

const mockDocumentTypeCode = 'mockDocumentTypeCode'
const setIndex1 = 1
const setIndex2 = 2
const pk1 = 'listOfKeyValuePairPk1'
const pk2 = 'listOfKeyValuePairPk2'

const docTypeField1 = new DocumentTypeField(
  'listOfKeyValueField1',
  'List Of Key Value Field 1',
  new ListFieldMeta(
    FieldType.DICTIONARY,
    new DocumentTypeFieldMeta(),
  ),
  FieldType.LIST,
  false,
  1,
  mockDocumentTypeCode,
  pk1,
)

const docTypeField2 = new DocumentTypeField(
  'listOfKeyValueField2',
  'List Of Key Value Field 2',
  new ListFieldMeta(
    FieldType.DICTIONARY,
    new DocumentTypeFieldMeta(),
  ),
  FieldType.LIST,
  false,
  1,
  mockDocumentTypeCode,
  pk2,
)

const fieldFromSet1 = new ExtractedDataField(
  pk1,
  [
    new DictFieldData(
      new FieldData(
        'key content 1',
        null,
        null,
        null,
        undefined,
        null,
        null,
        null,
        setIndex1,
        null,
      ),
      new FieldData(
        'value content 1',
        null,
        null,
        null,
        undefined,
        null,
        null,
        null,
        setIndex1,
        null,
      ),
    ),
    new DictFieldData(
      new FieldData(
        'key content 2',
        null,
        null,
        null,
        undefined,
        null,
        null,
        null,
        setIndex1,
        null,
      ),
      new FieldData(
        'value content 2',
        null,
        null,
        null,
        undefined,
        null,
        null,
        null,
        setIndex1,
        null,
      ),
    ),
  ],
)

const fieldFromSet2 = new ExtractedDataField(
  pk2,
  [
    new DictFieldData(
      new FieldData(
        'key content 1',
        null,
        null,
        null,
        undefined,
        null,
        null,
        null,
        setIndex2,
        null,
      ),
      new FieldData(
        'value content 1',
        null,
        null,
        null,
        undefined,
        null,
        null,
        null,
        setIndex2,
        null,
      ),
    ),
    new DictFieldData(
      new FieldData(
        'key content 2',
        null,
        null,
        null,
        undefined,
        null,
        null,
        null,
        setIndex2,
        null,
      ),
      new FieldData(
        'value content 2',
        null,
        null,
        null,
        undefined,
        null,
        null,
        null,
        setIndex2,
        null,
      ),
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

const mockExtractedData = [fieldFromSet1, fieldFromSet2]

export {
  mockDocumentType,
  mockExtractedData,
}
