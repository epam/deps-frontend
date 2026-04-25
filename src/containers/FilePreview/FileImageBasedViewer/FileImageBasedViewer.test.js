
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { clearActivePolygons, setHighlightedField } from '@/actions/fileReviewPage'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { UiKeys } from '@/constants/navigation'
import { PdfViewer } from '@/containers/PdfViewer'
import { FileStatus } from '@/enums/FileStatus'
import { File, FileState } from '@/models/File'
import { uiSelector } from '@/selectors/navigation'
import { render } from '@/utils/rendererRTL'
import { FileImageBasedViewer } from './FileImageBasedViewer'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({ fileId: 'test-file-id' })),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileQuery: jest.fn(),
}))

jest.mock('@/actions/navigation', () => ({
  setUi: jest.fn(() => ({ type: 'mockType' })),
}))

jest.mock('@/selectors/navigation', () => ({
  uiSelector: jest.fn(),
}))

jest.mock('@/actions/fileReviewPage', () => ({
  clearActivePolygons: jest.fn(() => ({ type: 'mockType' })),
  setHighlightedField: jest.fn(() => ({ type: 'mockType' })),
}))

jest.mock('@/selectors/fileReviewPage', () => ({
  highlightedFieldSelector: jest.fn(() => null),
}))

jest.mock('../FileImagePreview', () => mockShallowComponent('FileImagePreview'))
jest.mock('@/containers/ImagePageSwitcher', () => mockShallowComponent('ImagePageSwitcher'))
jest.mock('@/containers/PdfViewer', () => mockShallowComponent('PdfViewer'))

let defaultFile

beforeEach(() => {
  jest.clearAllMocks()

  defaultFile = new File({
    id: 'test-file-id',
    tenantId: 'test-tenant-id',
    name: 'test-file.pdf',
    path: 'path/to/file.pdf',
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

  uiSelector.mockReturnValue({
    [UiKeys.ACTIVE_PAGE]: 1,
  })
})

test('renders FileImagePreview when file extension is JPG', () => {
  const file = new File({
    ...defaultFile,
    name: 'image.jpg',
    path: 'path/to/image.jpg',
  })
  useFetchFileQuery.mockReturnValue({ data: file })

  render(<FileImageBasedViewer />)

  expect(screen.getByTestId('FileImagePreview')).toBeInTheDocument()
  expect(screen.queryByTestId('PdfViewer')).not.toBeInTheDocument()
})

test('renders FileImagePreview when file extension is JPEG', () => {
  const file = new File({
    ...defaultFile,
    name: 'image.jpeg',
    path: 'path/to/image.jpeg',
  })
  useFetchFileQuery.mockReturnValue({ data: file })

  render(<FileImageBasedViewer />)

  expect(screen.getByTestId('FileImagePreview')).toBeInTheDocument()
  expect(screen.queryByTestId('PdfViewer')).not.toBeInTheDocument()
})

test('renders FileImagePreview when file extension is PNG', () => {
  const file = new File({
    ...defaultFile,
    name: 'image.png',
    path: 'path/to/image.png',
  })
  useFetchFileQuery.mockReturnValue({ data: file })

  render(<FileImageBasedViewer />)

  expect(screen.getByTestId('FileImagePreview')).toBeInTheDocument()
  expect(screen.queryByTestId('PdfViewer')).not.toBeInTheDocument()
})

test('renders FileImagePreview when file extension is TIFF', () => {
  const file = new File({
    ...defaultFile,
    name: 'image.tiff',
    path: 'path/to/image.tiff',
  })
  useFetchFileQuery.mockReturnValue({ data: file })

  render(<FileImageBasedViewer />)

  expect(screen.getByTestId('FileImagePreview')).toBeInTheDocument()
  expect(screen.queryByTestId('PdfViewer')).not.toBeInTheDocument()
})

test('renders FileImagePreview when file extension is TIF', () => {
  const file = new File({
    ...defaultFile,
    name: 'image.tif',
    path: 'path/to/image.tif',
  })
  useFetchFileQuery.mockReturnValue({ data: file })

  render(<FileImageBasedViewer />)

  expect(screen.getByTestId('FileImagePreview')).toBeInTheDocument()
  expect(screen.queryByTestId('PdfViewer')).not.toBeInTheDocument()
})

test('renders PdfViewer when file extension is PDF and FEATURE_PDF_VIEWER is enabled', () => {
  render(<FileImageBasedViewer />)

  expect(screen.getByTestId('PdfViewer')).toBeInTheDocument()
  expect(screen.queryByTestId('FileImagePreview')).not.toBeInTheDocument()
})

test('renders FileImagePreview when file extension is PDF and FEATURE_PDF_VIEWER is disabled', () => {
  mockEnv.ENV.FEATURE_PDF_VIEWER = false

  render(<FileImageBasedViewer />)

  expect(screen.getByTestId('FileImagePreview')).toBeInTheDocument()
  expect(screen.queryByTestId('PdfViewer')).not.toBeInTheDocument()
  mockEnv.ENV.FEATURE_PDF_VIEWER = true
})

test('passes correct props to PdfViewer when rendering PDF', () => {
  render(<FileImageBasedViewer />)

  const pdfViewer = screen.getByTestId('PdfViewer')
  expect(pdfViewer).toHaveAttribute('data-pageswitcher', 'mock-PageSwitcher')
  expect(pdfViewer).toHaveAttribute('data-setactivepage', 'mock-setActivePage')
  expect(pdfViewer).toHaveAttribute('data-url', expect.stringContaining('path/to/file.pdf'))
})

test('handles uppercase file extensions correctly', () => {
  const file = new File({
    ...defaultFile,
    name: 'IMAGE.PNG',
    path: 'path/to/IMAGE.PNG',
  })
  useFetchFileQuery.mockReturnValue({ data: file })

  render(<FileImageBasedViewer />)

  expect(screen.getByTestId('FileImagePreview')).toBeInTheDocument()
})

test('handles mixed case file extensions correctly', () => {
  const file = new File({
    ...defaultFile,
    name: 'document.PdF',
    path: 'path/to/document.PdF',
  })
  useFetchFileQuery.mockReturnValue({ data: file })

  render(<FileImageBasedViewer />)

  expect(screen.getByTestId('PdfViewer')).toBeInTheDocument()
})

test('calls clearActivePolygons when setActivePage is called', () => {
  render(<FileImageBasedViewer />)

  const pdfViewerProps = PdfViewer.getProps()
  const setActivePage = pdfViewerProps.setActivePage

  setActivePage(2)

  expect(clearActivePolygons).toHaveBeenCalled()
})

test('calls setHighlightedField with null when setActivePage is called', () => {
  render(<FileImageBasedViewer />)

  const pdfViewerProps = PdfViewer.getProps()
  const setActivePage = pdfViewerProps.setActivePage

  setActivePage(3)

  expect(setHighlightedField).nthCalledWith(1, null)
})
