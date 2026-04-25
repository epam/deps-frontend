
import { mockEnv } from '@/mocks/mockEnv'
import { DefaultFormValues } from '../constants'
import { mapDataToBatchDTO } from './mappers'

jest.mock('@/utils/env', () => mockEnv)

describe('mappers: mapDataToBatchDTO', () => {
  test('maps formValues and uploadedData correctly', () => {
    const mockUploadedData = [
      {
        name: 'file1.txt',
        path: '/path/to/file1.txt',
        documentTypeId: 'type1',
      },
      {
        name: 'file2.txt',
        path: '/path/to/file2.txt',
      },
    ]

    const result = mapDataToBatchDTO({
      formValues: DefaultFormValues,
      uploadedData: mockUploadedData,
    })

    const expected = {
      name: DefaultFormValues.batchName,
      groupId: DefaultFormValues.group?.id,
      files: [
        {
          ...mockUploadedData[0],
          processingParams: {
            engine: DefaultFormValues.engine,
            llmType: DefaultFormValues.llmType,
            parsingFeatures: DefaultFormValues.parsingFeatures,
          },
        },
        {
          ...mockUploadedData[1],
          documentTypeId: null,
          processingParams: {
            engine: DefaultFormValues.engine,
            llmType: DefaultFormValues.llmType,
            parsingFeatures: DefaultFormValues.parsingFeatures,
          },
        },
      ],
    }

    expect(result).toEqual(expected)
  })
})
