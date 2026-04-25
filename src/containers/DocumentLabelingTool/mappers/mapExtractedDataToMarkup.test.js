
import { mockEnv } from '@/mocks/mockEnv'
import { mapExtractedDataToMarkup } from './mapExtractedDataToMarkup'
import { mockInvalidDocumentType } from './mocks/invalidDocumentType'
import { mockInvalidExtractedData } from './mocks/invalidExtractedData'
import { mockDocumentType } from './mocks/validDocumentType'
import { mockExtractedData, mockExtractedData2 } from './mocks/validExtractedData'
import { mockMarkup } from './mocks/validMarkup'

jest.mock('uuid', () => ({ v4: () => 'uuid' }))
jest.mock('@/utils/env', () => mockEnv)

describe('Mapper: mapExtractedDataToMarkup', () => {
  it('should map extracted data to markup correctly', async () => {
    const newMarkup = await mapExtractedDataToMarkup(mockExtractedData, mockDocumentType.fields)

    for (const [newPage, newPageMarkup] of Object.entries(newMarkup)) {
      for (const newMarkupObjects of Object.values(newPageMarkup)) {
        for (const newMarkupObject of newMarkupObjects) {
          const validMarkupObject = (
            mockMarkup[newPage]?.labels?.find((mo) => (
              mo.fieldCode === newMarkupObject.fieldCode &&
              mo.type === newMarkupObject.type &&
              mo.index === newMarkupObject.index
            )) ||
            mockMarkup[newPage]?.tables?.find((mo) => (
              mo.fieldCode === newMarkupObject.fieldCode &&
              mo.index === newMarkupObject.index
            ))
          )
          expect(validMarkupObject).toEqual(newMarkupObject)
        }
      }
    }
  })

  it('should map extracted data with fields with multicoordinates to markup correctly', async () => {
    const newMarkup = await mapExtractedDataToMarkup(mockExtractedData2, mockDocumentType.fields)

    for (const [newPage, newPageMarkup] of Object.entries(newMarkup)) {
      for (const newMarkupObjects of Object.values(newPageMarkup)) {
        for (const newMarkupObject of newMarkupObjects) {
          const validMarkupObject = (
            mockMarkup[newPage]?.labels?.find((mo) => (
              mo.fieldCode === newMarkupObject.fieldCode &&
              mo.type === newMarkupObject.type &&
              mo.index === newMarkupObject.index
            )) ||
            mockMarkup[newPage]?.tables?.find((mo) => (
              mo.fieldCode === newMarkupObject.fieldCode &&
              mo.index === newMarkupObject.index
            ))
          )

          expect(validMarkupObject.length).toEqual(newMarkupObject.length)
        }
      }
    }
  })

  it('should return null if pass invalid extracted data and document type', async () => {
    const newMarkup = await mapExtractedDataToMarkup(mockInvalidExtractedData, mockInvalidDocumentType.fields)
    expect(newMarkup).toEqual(null)
  })

  it('should return null in case of empty extracted data', async () => {
    expect(await mapExtractedDataToMarkup(null)).toEqual(null)
    expect(await mapExtractedDataToMarkup({})).toEqual(null)
    expect(await mapExtractedDataToMarkup([])).toEqual(null)
    expect(await mapExtractedDataToMarkup([{}])).toEqual(null)
  })

  it('should not return markup for extracted data field that not present in document type', async () => {
    const newMarkup = await mapExtractedDataToMarkup(mockExtractedData, [])

    expect(newMarkup).toEqual(null)
  })
})
