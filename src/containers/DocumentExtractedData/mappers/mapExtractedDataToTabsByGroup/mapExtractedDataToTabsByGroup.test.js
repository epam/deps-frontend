
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { ExtractionType } from '@/enums/ExtractionType'
import { FieldType } from '@/enums/FieldType'
import { KnownLanguage } from '@/enums/KnownLanguage'
import { localize, Localization } from '@/localization/i18n'
import { Document } from '@/models/Document'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DictFieldMeta, DocumentTypeFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { DictFieldData, ExtractedDataField, FieldData } from '@/models/ExtractedData'
import { render } from '@/utils/rendererRTL'
import { mapExtractedDataToTabsByGroup } from './mapExtractedDataToTabsByGroup'

const MockDocumentFields = ({ fields }) => (
  <ul>
    {
      fields.map((field) => (
        <li key={field.fieldPk}>
          {field.fieldPk}
        </li>
      ))
    }
  </ul>
)

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/DocumentFields', () => ({
  DocumentFields: (props) => <MockDocumentFields {...props} />,
}))

const FIELDS_KEY = 'fields'
const mockDocumentTypeCode = 'mockDocumentTypeCode'
const stringPk = 'stringPk'
const keyValuePairPk = 'keyValuePairPk'

const docTypeField1 = new DocumentTypeField(
  'stringFieldCode',
  'String Field',
  new DocumentTypeFieldMeta('BC', 'A'),
  FieldType.STRING,
  false,
  1,
  mockDocumentTypeCode,
  stringPk,
)

const docTypeField2 = new DocumentTypeField(
  'keyValuePairField',
  'Key Value Pair Field',
  new DictFieldMeta(),
  FieldType.DICTIONARY,
  false,
  1,
  mockDocumentTypeCode,
  keyValuePairPk,
)

const field1 = new ExtractedDataField(
  stringPk,
  new FieldData('string'),
)

const field2 = new ExtractedDataField(
  keyValuePairPk,
  new DictFieldData(
    new FieldData('key content'),
    new FieldData('value content'),
  ),
)

const mockDocumentType = new DocumentType(
  mockDocumentTypeCode,
  'Test Doc Type',
  'mockEngineCode',
  KnownLanguage.ENGLISH,
  ExtractionType.TEMPLATE,
  [
    docTypeField1,
    docTypeField2,
  ],
)

const mockExtractedData = [
  field1,
  field2,
]

const mockDocument = new Document({
  id: 'testDocId',
  extractedData: mockExtractedData,
})

test('should create Tab component with correct properties', () => {
  const [tab] = mapExtractedDataToTabsByGroup({
    document: mockDocument,
    documentType: mockDocumentType,
  })

  expect(tab.key).toEqual(FIELDS_KEY)
  expect(tab.label).toEqual(localize(Localization.FIELDS_TAB_NAME))
})

test('should create Tab component with correct content', () => {
  const [tab] = mapExtractedDataToTabsByGroup({
    document: mockDocument,
    documentType: mockDocumentType,
  })

  const { children: tabContent } = tab

  render(
    tabContent,
  )

  mockExtractedData.forEach((field) => {
    expect(screen.getByText(field.fieldPk)).toBeInTheDocument()
  })
})
