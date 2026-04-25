
import { mockEnv } from '@/mocks/mockEnv'
import { ExtractionType } from '@/enums/ExtractionType'
import { FieldType } from '@/enums/FieldType'
import { KnownLanguage } from '@/enums/KnownLanguage'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta, ListFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { ExtractedDataField, FieldData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { getExtractedDataToDisplay } from './getExtractedDataToDisplay'

jest.mock('@/utils/env', () => mockEnv)

const mockDocumentTypeCode = 'mockDocumentTypeCode'
const mockFieldPk1 = 'pk1'
const mockFieldPk2 = 'pk2'

const mockDocumentTypeFields = [
  new DocumentTypeField(
    'fieldCode1',
    'Field Name 1',
    new DocumentTypeFieldMeta('BC', 'A'),
    FieldType.STRING,
    false,
    1,
    mockDocumentTypeCode,
    mockFieldPk1,
  ),
  new DocumentTypeField(
    'fieldCode2',
    'Field Name 2',
    new DocumentTypeFieldMeta('BC', 'A'),
    FieldType.STRING,
    false,
    2,
    mockDocumentTypeCode,
    mockFieldPk2,
  ),
]

const mockExtractedData = [
  new ExtractedDataField(
    mockFieldPk1,
    new FieldData(
      'test1',
      [
        new FieldCoordinates(1, 0.2, 0.3, 0.4, 0.5),
        new FieldCoordinates(1, 0.2, 0.3, 0.4, 0.5),
      ],
      0.69,
    ),
  ),
  new ExtractedDataField(
    mockFieldPk2,
    new FieldData(
      'test2',
      [
        new FieldCoordinates(1, 0.2, 0.3, 0.4, 0.5),
        new FieldCoordinates(1, 0.2, 0.3, 0.4, 0.5),
      ],
      0.69,
    ),
  ),
]

test('should return array of matching extracted data fields for document type', () => {
  const mockDocumentType = new DocumentType(
    mockDocumentTypeCode,
    'Test Doc Type',
    'mockEngineCode',
    KnownLanguage.RUSSIAN,
    ExtractionType.TEMPLATE,
    mockDocumentTypeFields,
  )

  const result = getExtractedDataToDisplay({
    extractedData: mockExtractedData,
    documentType: mockDocumentType,
  })

  expect(result).toEqual(mockExtractedData)
})

test('should call ShouldHideEmptyEdFields if passed and there is doc type field not presenting in extracted data', () => {
  const additionalFieldPk = 'additionalFieldPk'

  const mockShouldHideEmptyEdFields = jest.fn()

  const additionalDocTypeField = new DocumentTypeField(
    'fieldCode3',
    'Field Name 3',
    new DocumentTypeFieldMeta('BC', 'A'),
    FieldType.STRING,
    false,
    3,
    mockDocumentTypeCode,
    additionalFieldPk,
  )

  const mockDocumentType = new DocumentType(
    mockDocumentTypeCode,
    'Test Doc Type',
    'mockEngineCode',
    KnownLanguage.RUSSIAN,
    ExtractionType.TEMPLATE,
    [
      ...mockDocumentTypeFields,
      additionalDocTypeField,
    ],
  )

  getExtractedDataToDisplay({
    extractedData: mockExtractedData,
    documentType: mockDocumentType,
    ShouldHideEmptyEdFields: mockShouldHideEmptyEdFields,
  })

  expect(mockShouldHideEmptyEdFields).toHaveBeenCalled()
})

test('should add empty field if there is doc type field not presenting in extracted data and ShouldHideEmptyEdFields is not passed', () => {
  const additionalFieldPk = 'additionalFieldPk'

  const additionalDocTypeField = new DocumentTypeField(
    'fieldCode3',
    'Field Name 3',
    new DocumentTypeFieldMeta('BC', 'A'),
    FieldType.STRING,
    false,
    3,
    mockDocumentTypeCode,
    additionalFieldPk,
  )

  const mockDocumentType = new DocumentType(
    mockDocumentTypeCode,
    'Test Doc Type',
    'mockEngineCode',
    KnownLanguage.RUSSIAN,
    ExtractionType.TEMPLATE,
    [
      ...mockDocumentTypeFields,
      additionalDocTypeField,
    ],
  )

  const result = getExtractedDataToDisplay({
    extractedData: mockExtractedData,
    documentType: mockDocumentType,
  })

  expect(result).toEqual([
    ...mockExtractedData,
    new ExtractedDataField(
      additionalDocTypeField.pk,
      ExtractedDataField.getEmptyData(additionalDocTypeField),
    ),
  ])
})

test('should not add empty field if there is doc type field not presenting in extracted data and empty fields should be hidden', () => {
  const additionalFieldPk = 'additionalFieldPk'

  const additionalDocTypeField = new DocumentTypeField(
    'fieldCode3',
    'Field Name 3',
    new DocumentTypeFieldMeta('BC', 'A'),
    FieldType.STRING,
    false,
    3,
    mockDocumentTypeCode,
    additionalFieldPk,
  )

  const mockDocumentType = new DocumentType(
    mockDocumentTypeCode,
    'Test Doc Type',
    'mockEngineCode',
    KnownLanguage.RUSSIAN,
    ExtractionType.TEMPLATE,
    [
      ...mockDocumentTypeFields,
      additionalDocTypeField,
    ],
  )

  const result = getExtractedDataToDisplay({
    extractedData: mockExtractedData,
    documentType: mockDocumentType,
    ShouldHideEmptyEdFields: jest.fn(() => true),
  })

  expect(result).toEqual(mockExtractedData)
})

test('should add correct index to every list item if field has list type', () => {
  const mockDocumentTypeWithList = new DocumentType(
    mockDocumentTypeCode,
    'Doc Type With List',
    'mockEngineCode',
    KnownLanguage.RUSSIAN,
    ExtractionType.TEMPLATE,
    [new DocumentTypeField(
      'listField',
      'List Field',
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
      mockFieldPk1,
    )],
  )

  const mockFieldData = [
    new FieldData(
      'test1',
      [
        new FieldCoordinates(1, 0.2, 0.3, 0.4, 0.5),
        new FieldCoordinates(1, 0.2, 0.3, 0.4, 0.5),
      ],
      0.69,
    ),
    new FieldData(
      'test2',
      [
        new FieldCoordinates(1, 0.2, 0.3, 0.4, 0.5),
        new FieldCoordinates(1, 0.2, 0.3, 0.4, 0.5),
      ],
      0.69,
    ),
  ]

  const mockExtractedDataField = new ExtractedDataField(
    mockFieldPk1,
    mockFieldData,
  )

  const result = getExtractedDataToDisplay({
    extractedData: [mockExtractedDataField],
    documentType: mockDocumentTypeWithList,
  })

  const expectedExtractedDataField = {
    ...mockExtractedDataField,
    data: mockFieldData.map((item, index) => ({
      ...item,
      index,
    })),
  }

  expect(result).toEqual([expectedExtractedDataField])
})
