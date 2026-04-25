
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Document } from '@/models/Document'
import { render } from '@/utils/rendererRTL'
import { DocumentImageBasedViewer } from './DocumentImageBasedViewer'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../DocumentImagePageSwitcher', () => mockShallowComponent('DocumentImagePageSwitcher'))
jest.mock('../DocumentImagePreview', () => mockShallowComponent('DocumentImagePreview'))
jest.mock('@/containers/PdfViewer', () => mockShallowComponent('PdfViewer'))

let defaultProps
let defaultDocument

beforeEach(() => {
  jest.clearAllMocks()

  defaultDocument = new Document({
    _id: 'test-document-id',
    title: 'test-document',
    documentType: {
      name: 'Test Document Type',
      code: 'test-type',
    },
    files: [
      {
        url: 'http://example.com/test-file.pdf',
        blobName: 'test-file.pdf',
      },
    ],
  })

  defaultProps = {
    addActivePolygons: jest.fn(),
    clearActivePolygons: jest.fn(),
    activePage: 1,
    activeSourceId: null,
    document: defaultDocument,
    highlightedField: null,
    onChangeActiveImagePage: jest.fn(),
    previewAvailable: true,
  }
})

test('renders PdfViewer when file extension is PDF and FEATURE_PDF_VIEWER is enabled', () => {
  render(<DocumentImageBasedViewer {...defaultProps} />)

  expect(screen.getByTestId('PdfViewer')).toBeInTheDocument()
  expect(screen.queryByTestId('DocumentImagePreview')).not.toBeInTheDocument()
})

test('renders DocumentImagePreview when file extension is PDF and FEATURE_PDF_VIEWER is disabled', () => {
  mockEnv.ENV.FEATURE_PDF_VIEWER = false

  render(<DocumentImageBasedViewer {...defaultProps} />)

  expect(screen.getByTestId('DocumentImagePreview')).toBeInTheDocument()
  expect(screen.queryByTestId('PdfViewer')).not.toBeInTheDocument()

  mockEnv.ENV.FEATURE_PDF_VIEWER = true
})

test('renders DocumentImagePreview when file extension is JPG', () => {
  const document = new Document({
    ...defaultDocument,
    files: [
      {
        url: 'http://example.com/image.jpg',
        blobName: 'image.jpg',
      },
    ],
  })

  render(
    <DocumentImageBasedViewer
      {...defaultProps}
      document={document}
    />,
  )

  expect(screen.getByTestId('DocumentImagePreview')).toBeInTheDocument()
  expect(screen.queryByTestId('PdfViewer')).not.toBeInTheDocument()
})

test('renders DocumentImagePreview when file extension is PNG', () => {
  const document = new Document({
    ...defaultDocument,
    files: [
      {
        url: 'http://example.com/image.png',
        blobName: 'image.png',
      },
    ],
  })

  render(
    <DocumentImageBasedViewer
      {...defaultProps}
      document={document}
    />,
  )

  expect(screen.getByTestId('DocumentImagePreview')).toBeInTheDocument()
  expect(screen.queryByTestId('PdfViewer')).not.toBeInTheDocument()
})

test('renders DocumentImagePreview when file extension is TIFF', () => {
  const document = new Document({
    ...defaultDocument,
    files: [
      {
        url: 'http://example.com/image.tiff',
        blobName: 'image.tiff',
      },
    ],
  })

  render(
    <DocumentImageBasedViewer
      {...defaultProps}
      document={document}
    />,
  )

  expect(screen.getByTestId('DocumentImagePreview')).toBeInTheDocument()
  expect(screen.queryByTestId('PdfViewer')).not.toBeInTheDocument()
})

test('passes correct props to PdfViewer when rendering PDF', () => {
  render(<DocumentImageBasedViewer {...defaultProps} />)

  const pdfViewer = screen.getByTestId('PdfViewer')
  expect(pdfViewer).toHaveAttribute('data-pageswitcher', 'mock-PageSwitcher')
  expect(pdfViewer).toHaveAttribute('data-setactivepage', 'mock-setActivePage')
  expect(pdfViewer).toHaveAttribute('data-url', expect.stringContaining('test-file.pdf'))
})

test('passes correct props to DocumentImagePreview when rendering image file', () => {
  const document = new Document({
    ...defaultDocument,
    files: [
      {
        url: 'http://example.com/image.jpg',
        blobName: 'image.jpg',
      },
    ],
  })

  render(
    <DocumentImageBasedViewer
      {...defaultProps}
      document={document}
    />,
  )

  const imagePreview = screen.getByTestId('DocumentImagePreview')
  expect(imagePreview).toHaveAttribute('data-activepage', '1')
  expect(imagePreview).toHaveAttribute('data-renderpageswitcher', 'mock-renderPageSwitcher')
})

test('passes activePage prop to DocumentImagePreview', () => {
  const document = new Document({
    ...defaultDocument,
    files: [
      {
        url: 'http://example.com/image.png',
        blobName: 'image.png',
      },
    ],
  })

  render(
    <DocumentImageBasedViewer
      {...defaultProps}
      activePage={5}
      document={document}
    />,
  )

  const imagePreview = screen.getByTestId('DocumentImagePreview')
  expect(imagePreview).toHaveAttribute('data-activepage', '5')
})

test('passes activeSourceId prop to DocumentImagePreview when provided', () => {
  const document = new Document({
    ...defaultDocument,
    files: [
      {
        url: 'http://example.com/image.jpg',
        blobName: 'image.jpg',
      },
    ],
  })

  render(
    <DocumentImageBasedViewer
      {...defaultProps}
      activeSourceId="test-source-id"
      document={document}
    />,
  )

  const imagePreview = screen.getByTestId('DocumentImagePreview')
  expect(imagePreview).toHaveAttribute('data-activesourceid', 'test-source-id')
})

test('passes highlightedField prop to DocumentImagePreview when provided', () => {
  const document = new Document({
    ...defaultDocument,
    files: [
      {
        url: 'http://example.com/image.png',
        blobName: 'image.png',
      },
    ],
  })

  const highlightedField = [
    [0, 10],
    [20, 30],
  ]

  render(
    <DocumentImageBasedViewer
      {...defaultProps}
      document={document}
      highlightedField={highlightedField}
    />,
  )

  const imagePreview = screen.getByTestId('DocumentImagePreview')
  expect(imagePreview).toHaveAttribute('data-highlightedfield', JSON.stringify(highlightedField))
})

test('handles uppercase file extensions correctly', () => {
  const document = new Document({
    ...defaultDocument,
    files: [
      {
        url: 'http://example.com/IMAGE.PNG',
        blobName: 'IMAGE.PNG',
      },
    ],
  })

  render(
    <DocumentImageBasedViewer
      {...defaultProps}
      document={document}
    />,
  )

  expect(screen.getByTestId('DocumentImagePreview')).toBeInTheDocument()
})

test('handles mixed case file extensions correctly for PDF', () => {
  const document = new Document({
    ...defaultDocument,
    files: [
      {
        url: 'http://example.com/document.PdF',
        blobName: 'document.PdF',
      },
    ],
  })

  render(
    <DocumentImageBasedViewer
      {...defaultProps}
      document={document}
    />,
  )

  expect(screen.getByTestId('PdfViewer')).toBeInTheDocument()
})
