
import { PdfSegment, UserPage } from '@/containers/PdfSplitting/models'
import { FileExtension } from '@/enums/FileExtension'
import { PdfSplitter } from './PdfSplitter'

jest.mock('pdf-lib/dist/pdf-lib.js', () => ({
  PDFDocument: {
    load: jest.fn(),
    create: jest.fn(() => ({
      copyPages: () => [],
      addPage: jest.fn(),
      save: () => new Blob(),
    })),
  },
}))

const mockPdfFile = {
  arrayBuffer: jest.fn(() => Promise.resolve(new ArrayBuffer(8))),
}

const mockDocumentName = 'documentName'

const mockSegments = [
  new PdfSegment({
    id: '1',
    documentTypeId: 'type1',
    userPages: [
      new UserPage({
        page: 0,
        segmentId: '1',
      }),
      new UserPage({
        page: 1,
        segmentId: '1',
      }),
    ],
  }),
  new PdfSegment({
    id: '2',
    documentTypeId: 'type2',
    userPages: [
      new UserPage({
        page: 2,
        segmentId: '2',
      }),
    ],
  }),
]

test('returns correct filesData when call PdfSplitter.getSplittedFilesData method', async () => {
  const args = {
    pdfFile: mockPdfFile,
    documentName: mockDocumentName,
    segments: mockSegments,
  }

  const filesData = await PdfSplitter.getSplittedFilesData(args)

  expect(filesData).toEqual([
    {
      name: `${mockDocumentName}_1${FileExtension.PDF}`,
      file: expect.any(File),
      documentTypeId: 'type1',
    },
    {
      name: `${mockDocumentName}_2${FileExtension.PDF}`,
      file: expect.any(File),
      documentTypeId: 'type2',
    },
  ])
})

test('handles segments with excluded pages correctly', async () => {
  const segmentsWithExcludedPages = [
    new PdfSegment({
      id: '1',
      documentTypeId: 'type1',
      userPages: [
        new UserPage({
          page: 0,
          segmentId: '1',
          isExcluded: false,
        }),
        new UserPage({
          page: 1,
          segmentId: '1',
          isExcluded: true,
        }),
        new UserPage({
          page: 2,
          segmentId: '1',
          isExcluded: false,
        }),
      ],
    }),
  ]

  const args = {
    pdfFile: mockPdfFile,
    documentName: mockDocumentName,
    segments: segmentsWithExcludedPages,
  }

  const filesData = await PdfSplitter.getSplittedFilesData(args)

  expect(filesData).toEqual([
    {
      name: `${mockDocumentName}_1${FileExtension.PDF}`,
      file: expect.any(File),
      documentTypeId: 'type1',
    },
  ])
})
