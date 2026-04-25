
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { useWatch } from 'react-hook-form'
import { FilesPicker } from '@/components/FilesPicker'
import { SUPPORTED_EXTENSIONS_DOCUMENTS } from '@/constants/common'
import { FIELD_FORM_CODE } from '@/containers/ManageBatch/constants'
import { PickedFile } from '@/containers/ManageBatch/PickedFile'
import { FileExtension } from '@/enums/FileExtension'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { BatchFilesUpload } from './BatchFilesUpload'

const TEST_ID = {
  FILES_PICKER: 'files-picker',
  ADD_FILES_BUTTON: 'add-files-button',
  FILES_WRAPPER: 'files-wrapper',
  UPLOAD_BUTTON: 'upload-button',
}

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/FilesPicker', () => ({
  ...jest.requireActual('@/components/FilesPicker'),
  ...mockShallowComponent('FilesPicker'),
}))

jest.mock('@/components/Icons/UploadFilledIcon', () => mockShallowComponent('UploadFilledIcon'))

jest.mock('@/components/Icons/PlusFilledIcon', () => mockShallowComponent('PlusFilledIcon'))

const MOCK_TEST_ID = 'FileCard'

jest.mock('./FileCard', () => ({
  FileCard: ({ fileData, index }) => (
    <div
      key={fileData.file.uid}
      data-testid={MOCK_TEST_ID}
    >
      FileCard
      {index}
      :
      {fileData.file.name}
    </div>
  ),
}))

jest.mock('@/utils/getMime', () => ({
  getMime: jest.fn(() => Promise.resolve('application/pdf')),
}))

jest.mock('@/utils/notification', () => ({
  notifyWarning: jest.fn(),
  notifyError: jest.fn(),
}))

jest.mock('@/containers/UnsupportedFilesList', () => ({
  UnsupportedFilesList: () => 'mocked-unsupported-files-list',
}))

const mockParsingFeatures = ['kvps', 'tables', 'text']
const mockDocumentType = 'test'
const mockEngine = 'some'
const mockLlmType = 'basic'

const mockGetValues = jest.fn(() => ({
  engine: mockEngine,
  documentType: mockDocumentType,
  llmType: mockLlmType,
  parsingFeatures: mockParsingFeatures,
}))

const mockOnChange = jest.fn()

jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(() => ({
    getValues: mockGetValues,
    engine: 'some',
    documentType: 'hola',
    group: 'id',
    parsingFeatures: ['kvps'],
  })),
  useWatch: jest.fn(),
}))

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    onChange: mockOnChange,
  }

  useWatch.mockReturnValue([
    new PickedFile(
      {
        uid: 'test-uid-1',
        name: 'file.txt',
      },
      {
        documentType: 'test',
      },
    )])
})

test('displays Upload button when no files are selected', () => {
  useWatch.mockReturnValueOnce([])
  render(<BatchFilesUpload {...defaultProps} />)

  expect(screen.getByText(localize(Localization.UPLOAD))).toBeInTheDocument()
})

test('does not display Upload button when files are present', () => {
  render(<BatchFilesUpload {...defaultProps} />)

  expect(screen.queryByText(localize(Localization.UPLOAD))).not.toBeInTheDocument()
})

test('displays FileCard component for each selected file', () => {
  const mockFiles = [
    new PickedFile(
      {
        uid: 'uid-1',
        name: 'file1.pdf',
      },
      {
        documentType: 'pdf',
        engine: 'test-engine',
      },
    ),
    new PickedFile(
      {
        uid: 'uid-2',
        name: 'file2.docx',
      },
      {
        documentType: 'docx',
        engine: 'test-engine',
      },
    ),
  ]

  useWatch.mockReturnValueOnce(mockFiles)

  render(<BatchFilesUpload {...defaultProps} />)

  expect(screen.getAllByTestId(MOCK_TEST_ID)).toHaveLength(2)
})

test('displays no FileCard when no files are selected', () => {
  useWatch.mockReturnValueOnce([])

  render(<BatchFilesUpload {...defaultProps} />)

  expect(screen.queryByTestId(MOCK_TEST_ID)).not.toBeInTheDocument()
})

test('calls onChange with new PickedFile instances when files are added', () => {
  useWatch.mockReturnValueOnce([])

  const mockFiles = [
    new File(['content'], 'test1.pdf', { type: 'application/pdf' }),
    new File(['content'], 'test2.txt', { type: 'text/plain' }),
  ]

  render(<BatchFilesUpload {...defaultProps} />)

  const onFilesSelected = FilesPicker.getProps().onFilesSelected

  onFilesSelected(mockFiles)

  expect(mockOnChange).toHaveBeenCalledWith([
    new PickedFile(
      mockFiles[0],
      {
        engine: mockEngine,
        documentType: mockDocumentType,
        llmType: mockLlmType,
        parsingFeatures: mockParsingFeatures,
      },
    ),
    new PickedFile(
      mockFiles[1],
      {
        engine: mockEngine,
        documentType: mockDocumentType,
        llmType: mockLlmType,
        parsingFeatures: mockParsingFeatures,
      },
    ),
  ])
})

test('watches FILES field from form context', () => {
  const mockFiles = [
    new PickedFile(
      {
        uid: 'test-uid',
        name: 'test.pdf',
      },
      { documentType: 'test' },
    ),
  ]

  useWatch.mockReturnValueOnce(mockFiles)

  render(<BatchFilesUpload {...defaultProps} />)

  expect(useWatch).toHaveBeenCalledWith({ name: FIELD_FORM_CODE.FILES })
})

test('renders FilesPicker when no files are selected', () => {
  useWatch.mockReturnValueOnce([])

  render(<BatchFilesUpload {...defaultProps} />)

  expect(screen.getByTestId('FilesPicker')).toBeInTheDocument()
  expect(screen.queryByTestId(TEST_ID.ADD_FILES_BUTTON)).not.toBeInTheDocument()
})

test('renders AddFilesButton when files are selected', () => {
  const mockFiles = [
    new PickedFile(
      {
        uid: 'test-uid',
        name: 'test.pdf',
      },
      { documentType: 'test' },
    ),
  ]

  useWatch.mockReturnValueOnce(mockFiles)

  render(<BatchFilesUpload {...defaultProps} />)

  expect(screen.getByTestId('FilesPicker')).toBeInTheDocument()
  expect(screen.queryByTestId(TEST_ID.FILES_PICKER)).not.toBeInTheDocument()
})

test('filters out MSG and EML extensions from supported formats', () => {
  const expectedFormats = SUPPORTED_EXTENSIONS_DOCUMENTS
    .filter((format) => format !== FileExtension.MSG && format !== FileExtension.EML)
    .join(', ')

  useWatch.mockReturnValueOnce([])

  render(<BatchFilesUpload {...defaultProps} />)

  const filesPickerProps = FilesPicker.getProps()
  expect(filesPickerProps.accept).toBe(expectedFormats)
})
