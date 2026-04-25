
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import flushPromises from 'flush-promises'
import { createProfileOutput } from '@/api/outputProfilesApi'
import { FILE_EXTENSION_TO_DOWNLOAD_FORMAT, FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import { ExtractedDataSchema, OutputProfile, ExportingType } from '@/models/OutputProfile'
import { render } from '@/utils/rendererRTL'
import { OutputProfileExportDrawer } from './OutputProfileExportDrawer'

const mockDownloadOutput = jest.fn()

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/hooks/useDownload', () => ({
  useDownload: jest.fn(() => ({
    isLoading: false,
    downloadOutput: mockDownloadOutput,
  })),
}))

jest.mock('@/api/outputProfilesApi', () => ({
  createProfileOutput: jest.fn(() => Promise.resolve({
    filePath: 'testPath',
  })),
}))

jest.mock('./ProfilesTabs', () => ({
  ProfilesTabs: jest.fn(() => <div data-testid="profiles-tabs">ProfilesTabs Mock</div>),
}))

const mockProfile = new OutputProfile({
  id: 'id',
  name: 'name',
  creationDate: '12-12-2000',
  version: '1.0.0',
  schema: new ExtractedDataSchema({
    fields: [],
    needsValidationResults: false,
  }),
  format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
  exportingType: ExportingType.BUILT_IN,
})

const mockDocumentType = new ExtendedDocumentType({
  code: 'DocType1',
  name: 'Doc Type 1',
  profiles: [mockProfile],
})

const defaultProps = {
  isVisible: true,
  onClose: jest.fn(),
  documentId: 'id',
  documentTitle: 'Document Title',
  documentType: mockDocumentType,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('should render OutputProfileExportDrawer', () => {
  render(<OutputProfileExportDrawer {...defaultProps} />)
  expect(screen.getByTestId('profiles-tabs')).toBeInTheDocument()
})

test('should call onClose when click on CancelButton', async () => {
  render(<OutputProfileExportDrawer {...defaultProps} />)
  await userEvent.click(screen.getByTestId('cancel-button'))
  expect(defaultProps.onClose).toHaveBeenCalled()
})

test('should call downloadOutput when click on DownloadButton', async () => {
  render(<OutputProfileExportDrawer {...defaultProps} />)
  await userEvent.click(screen.getByTestId('download-button'))
  await flushPromises()
  expect(mockDownloadOutput).toHaveBeenCalled()
})

test('should call notifyWarning if createProfileOutput is rejected with error', async () => {
  createProfileOutput.mockImplementationOnce(() => Promise.reject(new Error('test')))

  render(<OutputProfileExportDrawer {...defaultProps} />)
  await userEvent.click(screen.getByTestId('download-button'))
  await flushPromises()
  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
})

test('should disable footer buttons when no profiles available', () => {
  const props = {
    ...defaultProps,
    documentType: {
      ...mockDocumentType,
      profiles: [],
    },
  }
  render(<OutputProfileExportDrawer {...props} />)
  expect(screen.getByTestId('download-button')).toBeDisabled()
  expect(screen.getByTestId('cancel-button')).toBeDisabled()
})

test('should render no data component if no profiles', () => {
  const props = {
    ...defaultProps,
    documentType: {
      ...mockDocumentType,
      profiles: [],
    },
  }
  render(<OutputProfileExportDrawer {...props} />)
  expect(screen.getByTestId('no-data')).toBeInTheDocument()
})
