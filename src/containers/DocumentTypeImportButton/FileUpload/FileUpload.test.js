
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import { FilesPicker } from '@/components/FilesPicker'
import { MimeType } from '@/enums/MimeType'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { SUPPORTED_EXTENSIONS } from '../constants'
import { FileUpload } from './FileUpload'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/components/FilesPicker', () => ({
  ...jest.requireActual('@/components/FilesPicker'),
  ...mockShallowComponent('FilesPicker'),
}))

const mockFileName = 'FileName.json'
const mockFile = new File(['content'], 'test.json', { type: MimeType.APPLICATION_JSON })
const unsupportedFileName = 'test.pdf'

const defaultValue = {
  setData: jest.fn(),
}

test('renders file upload with correct content if value is passed', () => {
  render(
    <FileUpload
      setData={jest.fn()}
      value={mockFileName}
    />,
  )

  render(
    FilesPicker.getProps().renderUploadTrigger(),
  )

  expect(screen.getByRole('button', { name: localize(Localization.CHANGE) })).toBeInTheDocument()
  expect(screen.getByText(mockFileName)).toBeInTheDocument()
})

test('disables Change button if disable prop is true', () => {
  render(
    <FileUpload
      disabled={true}
      setData={jest.fn()}
      value={mockFileName}
    />,
  )

  render(
    FilesPicker.getProps().renderUploadTrigger(),
  )
  expect(screen.getByRole('button', { name: localize(Localization.CHANGE) })).toBeDisabled()
})

test('renders file upload with correct content if value is not passed', () => {
  render(
    <FileUpload
      setData={jest.fn()}
    />,
  )

  render(
    FilesPicker.getProps().renderUploadTrigger(),
  )

  expect(screen.getByRole('button', { name: localize(Localization.IMPORT) })).toBeInTheDocument()
})

test('calls setData with correct argument when file is selected', () => {
  render(
    <FileUpload {...defaultValue} />,
  )

  const onFilesSelected = FilesPicker.getProps().onFilesSelected
  onFilesSelected([mockFile])

  expect(defaultValue.setData).nthCalledWith(1, mockFile)
})

test('shows error notification if file validation is failed', () => {
  render(
    <FileUpload {...defaultValue} />,
  )

  const onFilesValidationFailed = FilesPicker.getProps().onFilesValidationFailed
  onFilesValidationFailed([unsupportedFileName])

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.FILE_UNSUPPORTED_FORMAT, { fileName: unsupportedFileName }),
  )
})

test('accepts files with supported extension ', () => {
  render(
    <FileUpload {...defaultValue} />,
  )

  const expectedFormats = SUPPORTED_EXTENSIONS.join(', ')
  const filesPickerProps = FilesPicker.getProps()

  expect(filesPickerProps.accept).toBe(expectedFormats)
})
