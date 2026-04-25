
import { mockEnv } from '@/mocks/mockEnv'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import {
  TableFieldMeta,
  TableFieldColumn,
} from '@/models/DocumentTypeFieldMeta'
import {
  DictFieldData,
  ExtractedDataField,
  FieldData,
} from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { Rect } from '@/models/Rect'
import { SourceBboxCoordinates } from '@/models/SourceCoordinates'
import { ExtractedData } from './ExtractedData'

jest.mock('@/utils/env', () => mockEnv)

const extractedData = [
  new ExtractedDataField(
    1,
    new FieldData(
      30,
      null,
      [
        new SourceBboxCoordinates(
          'c626d5ee3c964e31aaf2e2c7170823ba',
          1,
          [
            new Rect(
              1,
              2,
              3,
              4,
            ),
          ],
        ),
      ],
      null,
      0.69,
      null,
      null,
      null,
      1,
    ),
    'Mick Duo',
  ),
  new ExtractedDataField(
    2,
    new FieldData(
      350,
      [
        new FieldCoordinates(
          2,
          0.29262295082,
          0.121975019516,
          0.063114754098,
          0.051971964837,
        ),
        new FieldCoordinates(
          5,
          0.29262295082,
          0.121975019516,
          0.063114754098,
          0.051971964837,
        ),
        new FieldCoordinates(
          1,
          0.29262295082,
          0.121975019516,
          0.063114754098,
          0.051971964837,
        ),
      ],
      0.69,
      null,
      0.69,
      null,
      null,
      'Mick',
      2,
    ),
  ),
  new ExtractedDataField(
    3,
    new FieldData(
      50,
      null,
      [
        new SourceBboxCoordinates(
          'c626d5ee3c964e31aaf2e2c7170823ba',
          3,
          [
            new Rect(
              1,
              2,
              3,
              4,
            ),
          ],
        ),
      ],
      null,
      0.69,
      null,
      null,
      'Mick',
      1,
    ),
    'Mick Duo',
  ),
  new ExtractedDataField(
    4,
    new FieldData(
      100,
      [
        new FieldCoordinates(
          2,
          0.29262295082,
          0.121975019516,
          0.063114754098,
          0.051971964837,
        ),
        new FieldCoordinates(
          3,
          0.29262295082,
          0.121975019516,
          0.063114754098,
          0.051971964837,
        ),
        new FieldCoordinates(
          5,
          0.29262295082,
          0.121975019516,
          0.063114754098,
          0.051971964837,
        ),
      ],
      0.69,
    ),
  ),
  new ExtractedDataField(
    7,
    [
      new DictFieldData(
        new FieldData(
          'an, NY',
          new FieldCoordinates(
            6,
            0.29262295082,
            0.121975019516,
            0.063114754098,
            0.051971964837,
          ),
          1,
        ),
        new FieldData(),
      ),
      new DictFieldData(
        new FieldData(
          'WY 34582',
          new FieldCoordinates(
            2,
            0.133606557377,
            0.403047890575,
            0.104918032787,
            0.029698265621,
          ),
          null,
          null,
          0.69,
          null,
          null,
          'Mick',
          1,
        ),
      ),
    ],
  ),
]

const dtFields = new DocumentTypeField(
  'verticalReference',
  'Vertical Reference',
  new TableFieldMeta([
    new TableFieldColumn('column title'),
  ]),
  FieldType.STRING,
  false,
  1,
  'mockDocumentTypeCode',
  1,
)

describe('Model: ExtractedData', () => {
  it('should return fields with the desired fieldPks when getFieldsByPks method is called', () => {
    const pks = [2, 3]
    expect(ExtractedData.getFieldsByPks(extractedData, pks)).toEqual([extractedData[1], extractedData[2]])
  })

  it('should return correct list of pages when getPages method is called', () => {
    const document = null
    const expectedResult = [null, 2, 5, 1, 3, 6]
    expect(ExtractedData.getPages(extractedData, document)).toEqual(expectedResult)
  })

  it('should return fields with the desired page when getFieldsByPage method is called', () => {
    const pageNumber = 1
    const document = null
    expect(ExtractedData.getFieldsByPage(extractedData, pageNumber, document)).toEqual([extractedData[1]])
  })

  it('should return correct data in case a fieldPk is equal to a pk when getUpdates method is called', () => {
    const expectedResult = {
      extractedDataClone: extractedData,
      fieldToUpdate: extractedData[0],
    }
    expect(ExtractedData.getUpdates(extractedData, dtFields)).toEqual(expectedResult)
  })

  it('should return correct data in case extractedData is empty when getUpdates method is called', () => {
    const emptyFieldData = new DictFieldData()

    jest.spyOn(ExtractedDataField, 'getEmptyData').mockReturnValue(emptyFieldData)

    const newEdField = new ExtractedDataField(
      dtFields.pk,
      emptyFieldData,
    )
    const emptyExtractedData = null
    const expectedResult = {
      extractedDataClone: [newEdField],
      fieldToUpdate: newEdField,
    }
    expect(ExtractedData.getUpdates(emptyExtractedData, dtFields)).toEqual(expectedResult)
  })

  it('should return field with the desired fieldPk when getFieldByPk method is called', () => {
    const pk = 1
    expect(ExtractedData.getFieldByPk(extractedData, pk)).toEqual(extractedData[0])
  })

  it('should replace field when replaceField method is called', () => {
    const fieldToRemove = extractedData[0]
    const fieldToPaste = new ExtractedDataField(
      4,
      new FieldData(
        350,
        0.69,
      ),
    )
    const result = ExtractedData.replaceField(extractedData, fieldToRemove, fieldToPaste)
    expect(result[0]).toEqual(fieldToPaste)
  })

  it('should delete field when deleteField method is called', () => {
    const fieldToDelete = extractedData[1]
    expect(ExtractedData.deleteField(extractedData, fieldToDelete).includes(fieldToDelete)).toEqual(false)
  })

  it('should return true in case extractedData has modified field when isModified method is called', () => {
    expect(ExtractedData.isModified(extractedData)).toEqual(true)
  })

  it('should return true in case extractedData has additional nesting and modified field when isModified method is called', () => {
    expect(ExtractedData.isModified([extractedData[4]])).toEqual(true)
  })

  it('should return false in case extractedData does not have modified field when isModified method is called', () => {
    expect(ExtractedData.isModified([extractedData[3]])).toEqual(false)
  })

  it('should return fields with the desired setIndex when getFieldsBySetIndex method is called', () => {
    const setIndex = 2
    expect(ExtractedData.getFieldsBySetIndex(extractedData, setIndex)).toEqual([extractedData[1]])
  })

  it('should return list of unique setIndexes when getSetIndexes method is called', () => {
    const expectedResult = [1, 2, null]
    expect(ExtractedData.getSetIndexes(extractedData)).toEqual(expectedResult)
  })
})
