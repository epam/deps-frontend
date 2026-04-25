
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { useWatch } from 'react-hook-form'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FilesUpload } from './FilesUpload'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/FilesPicker', () => ({
  ...jest.requireActual('@/components/FilesPicker'),
  ...mockShallowComponent('FilesPicker'),
}))

jest.mock('@/components/Icons/UploadFilledIcon', () => mockShallowComponent('UploadFilledIcon'))

jest.mock('@/components/Icons/PlusFilledIcon', () => mockShallowComponent('PlusFilledIcon'))

jest.mock('./FileTag', () => mockShallowComponent('FileTag'))

jest.mock('@/utils/getMime', () => ({
  getMime: jest.fn(() => Promise.resolve('application/pdf')),
}))

jest.mock('@/utils/notification', () => ({
  notifyWarning: jest.fn(),
  notifyError: jest.fn(),
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
  useWatch: jest.fn(() => [{
    uid: 'test-uid-1',
    name: 'file.txt',
  }]),
}))

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    onChange: mockOnChange,
  }
})

test('displays Upload button when no files are selected', () => {
  useWatch.mockReturnValueOnce([])
  render(<FilesUpload {...defaultProps} />)

  expect(screen.getByText(localize(Localization.ADD_FILES))).toBeInTheDocument()
})

test('does not display Upload button when files are present', () => {
  render(<FilesUpload {...defaultProps} />)

  expect(screen.queryByText(localize(Localization.UPLOAD))).not.toBeInTheDocument()
})

test('displays FileTag component for each selected file', () => {
  const mockFiles = [
    {
      uid: 'uid-1',
      name: 'file1.pdf',
    },
    {
      uid: 'uid-2',
      name: 'file2.docx',
    },
  ]

  useWatch.mockReturnValueOnce(mockFiles)

  render(<FilesUpload {...defaultProps} />)

  expect(screen.getAllByTestId('FileTag')).toHaveLength(2)
})

test('displays no FileTag when no files are selected', () => {
  useWatch.mockReturnValueOnce([])

  render(<FilesUpload {...defaultProps} />)

  expect(screen.queryByTestId('FileTag')).not.toBeInTheDocument()
})
