
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { FileExtension } from '@/enums/FileExtension'
import { FileStatus } from '@/enums/FileStatus'
import { Localization, localize } from '@/localization/i18n'
import { File, FileState } from '@/models/File'
import { render } from '@/utils/rendererRTL'
import { FilePreview } from './FilePreview'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({ fileId: 'test-file-id' })),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileQuery: jest.fn(),
}))

jest.mock('./FileImageBasedViewer', () => mockShallowComponent('FileImageBasedViewer'))
jest.mock('./FileDocxViewer', () => mockShallowComponent('FileDocxViewer'))
jest.mock('./FileTableViewer', () => mockShallowComponent('FileTableViewer'))

const VIEWER_COMPONENT_MAP = {
  FileImageBasedViewer: 'FileImageBasedViewer',
  FileDocxViewer: 'FileDocxViewer',
  FileTableViewer: 'FileTableViewer',
}

const FILE_EXTENSION_TO_VIEWER_MAP = [
  {
    extension: FileExtension.JPG,
    fileName: 'image.jpg',
    viewer: VIEWER_COMPONENT_MAP.FileImageBasedViewer,
  },
  {
    extension: FileExtension.JPEG,
    fileName: 'image.jpeg',
    viewer: VIEWER_COMPONENT_MAP.FileImageBasedViewer,
  },
  {
    extension: FileExtension.PNG,
    fileName: 'image.png',
    viewer: VIEWER_COMPONENT_MAP.FileImageBasedViewer,
  },
  {
    extension: FileExtension.TIFF,
    fileName: 'image.tiff',
    viewer: VIEWER_COMPONENT_MAP.FileImageBasedViewer,
  },
  {
    extension: FileExtension.TIF,
    fileName: 'image.tif',
    viewer: VIEWER_COMPONENT_MAP.FileImageBasedViewer,
  },
  {
    extension: FileExtension.PDF,
    fileName: 'document.pdf',
    viewer: VIEWER_COMPONENT_MAP.FileImageBasedViewer,
  },
  {
    extension: FileExtension.DOCX,
    fileName: 'document.docx',
    viewer: VIEWER_COMPONENT_MAP.FileDocxViewer,
  },
  {
    extension: FileExtension.XLSX,
    fileName: 'spreadsheet.xlsx',
    viewer: VIEWER_COMPONENT_MAP.FileTableViewer,
  },
  {
    extension: FileExtension.XLSM,
    fileName: 'spreadsheet.xlsm',
    viewer: VIEWER_COMPONENT_MAP.FileTableViewer,
  },
  {
    extension: FileExtension.XLTX,
    fileName: 'template.xltx',
    viewer: VIEWER_COMPONENT_MAP.FileTableViewer,
  },
  {
    extension: FileExtension.XLTM,
    fileName: 'template.xltm',
    viewer: VIEWER_COMPONENT_MAP.FileTableViewer,
  },
  {
    extension: FileExtension.XLS,
    fileName: 'spreadsheet.xls',
    viewer: VIEWER_COMPONENT_MAP.FileTableViewer,
  },
  {
    extension: FileExtension.CSV,
    fileName: 'data.csv',
    viewer: VIEWER_COMPONENT_MAP.FileTableViewer,
  },
]

let defaultFile

beforeEach(() => {
  jest.clearAllMocks()

  defaultFile = new File({
    id: 'test-file-id',
    tenantId: 'test-tenant-id',
    name: 'test-file.pdf',
    path: 'path/to/file',
    state: new FileState({
      status: FileStatus.COMPLETED,
      errorMessage: null,
    }),
    createdAt: '2025-07-01T00:00:00.000Z',
    updatedAt: '2025-07-01T00:00:00.000Z',
    labels: [],
  })

  useFetchFileQuery.mockReturnValue({
    data: defaultFile,
  })
})

FILE_EXTENSION_TO_VIEWER_MAP.forEach(({ extension, fileName, viewer }) => {
  test(`renders ${viewer} when file extension is ${extension}`, () => {
    const file = new File({
      ...defaultFile,
      name: fileName,
    })
    useFetchFileQuery.mockReturnValue({ data: file })

    render(<FilePreview />)

    expect(screen.getByTestId(viewer)).toBeInTheDocument()

    Object.values(VIEWER_COMPONENT_MAP)
      .filter((component) => component !== viewer)
      .forEach((otherViewer) => {
        expect(screen.queryByTestId(otherViewer)).not.toBeInTheDocument()
      })
  })
})

test('renders Empty component with message when file extension is not supported', () => {
  const unsupportedExtension = '.xyz'
  const unsupportedFile = new File({
    ...defaultFile,
    name: `Unsupported document${unsupportedExtension}`,
  })
  useFetchFileQuery.mockReturnValue({ data: unsupportedFile })

  render(<FilePreview />)

  const expectedMessage = localize(
    Localization.UNSUPPORTED_EXTENSION,
    { fileExtension: unsupportedExtension },
  )

  expect(screen.getByText(expectedMessage)).toBeInTheDocument()

  Object.values(VIEWER_COMPONENT_MAP).forEach((viewer) => {
    expect(screen.queryByTestId(viewer)).not.toBeInTheDocument()
  })
})
