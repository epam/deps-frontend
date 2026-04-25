
import { SplittableFile } from '../viewModels'
import { mapFilesToFilesData, mapFilesToSplittableFiles } from './mappers'

jest.mock('@/containers/PdfSplitting', () => ({
  PdfSplitter: {
    getSplittedFilesData: jest.fn(() => [
      {
        name: mockPdfFile.name,
        file: mockPdfFile,
        documentTypeId: 'type1',
      },
    ]),
  },
}))

const mockPdfFile = new File(['content'], 'test1.pdf', { type: 'application/pdf' })
const mockNonPdfFile = { name: 'test2.txt' }

describe('mappers: mapFilesToFilesData', () => {
  test('maps files to files data correctly', async () => {
    const mockSplittableFiles = [
      new SplittableFile({
        source: {
          name: mockPdfFile.name,
          uid: mockPdfFile.uid,
        },
        segments: [],
        batchName: null,
      }),
    ]

    const mockBatchFiles = [
      {
        name: mockNonPdfFile.name,
        uid: mockNonPdfFile.uid,
      },
    ]

    const result = await mapFilesToFilesData(mockSplittableFiles, mockBatchFiles)

    expect(result).toEqual([
      {
        file: mockNonPdfFile,
      },
      {
        file: mockPdfFile,
        documentTypeId: 'type1',
        name: mockPdfFile.name,
      },
    ])
  })
})

describe('mappers: mapFilesToSplittableFiles', () => {
  test('returns the same files to splittable files if they already exist', () => {
    const mockSplittableFile = new SplittableFile({
      source: mockPdfFile,
      segments: [],
      batchName: null,
    })

    const result = mapFilesToSplittableFiles([mockPdfFile], [mockSplittableFile])

    expect(result[0]).toEqual(mockSplittableFile)
  })

  test('maps files to splittable files correctly', () => {
    const result = mapFilesToSplittableFiles([mockPdfFile], [])

    expect(result[0]).toEqual(new SplittableFile({
      source: mockPdfFile,
      segments: [],
      batchName: null,
    }))
  })

  test('returns empty array if no pdf files are provided', () => {
    const result = mapFilesToSplittableFiles([mockNonPdfFile], [])

    expect(result).toEqual([])
  })
})
