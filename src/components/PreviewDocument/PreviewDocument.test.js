
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { FileExtension, FILE_EXTENSION_TO_DISPLAY_TEXT } from '@/enums/FileExtension'
import { render } from '@/utils/rendererRTL'
import { PreviewDocument } from './PreviewDocument'

jest.mock('@/utils/env', () => mockEnv)

test('renders file extension text when fileExtension is provided', () => {
  render(<PreviewDocument fileExtension={FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.PDF]} />)

  expect(screen.getByText(FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.PDF])).toBeInTheDocument()
})

test('does not render extension text when fileExtension is not provided', () => {
  render(<PreviewDocument />)

  expect(screen.queryByTestId('file-extension-text')).not.toBeInTheDocument()
})

test('renders child documents count when childDocuments is provided', () => {
  render(
    <PreviewDocument
      childDocuments={5}
      fileExtension={FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.XLSX]}
    />,
  )

  expect(screen.getByText('5')).toBeInTheDocument()
  expect(screen.getByText(FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.XLSX])).toBeInTheDocument()
})

test('does not render child documents count when childDocuments is not provided', () => {
  render(<PreviewDocument fileExtension={FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.PDF]} />)

  expect(screen.getByText(FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.PDF])).toBeInTheDocument()
  expect(screen.queryByTestId('documents-count')).not.toBeInTheDocument()
})

test('renders both file extension and child documents count', () => {
  render(
    <PreviewDocument
      childDocuments={3}
      fileExtension={FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.DOCX]}
    />,
  )

  expect(screen.getByText(FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.DOCX])).toBeInTheDocument()
  expect(screen.getByText('3')).toBeInTheDocument()
})

test.each([
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.PDF],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.XLSX],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.DOCX],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.CSV],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.JSON],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.XML],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.MSG],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.EML],
])('renders file extension text for %s', (ext) => {
  render(<PreviewDocument fileExtension={ext} />)
  expect(screen.getByText(ext)).toBeInTheDocument()
})
