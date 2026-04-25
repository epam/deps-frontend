
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { ProgressModal } from '@/containers/ProgressModal'
import { FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { readFileData } from '@/utils/file'
import { jsonTryParse } from '@/utils/jsonTryParse'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { mockDocumentTypeData } from './__mocks__/mockDocumentTypeData'
import { DocumentTypeImportButton } from './DocumentTypeImportButton'
import { useUploadDocumentType } from './hooks/useUploadDocumentType'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/utils/file', () => ({
  readFileData: jest.fn(async () => mockFileContent),
}))

jest.mock('@/utils/jsonTryParse', () => ({
  jsonTryParse: jest.fn(() => mockDocumentTypeData),
}))

jest.mock('./hooks/useUploadDocumentType', () => ({
  useUploadDocumentType: jest.fn(() => mockHookData),
}))

jest.mock('./DocumentTypeImportDrawer', () => ({
  DocumentTypeImportDrawer: ({ upload }) => (
    <div data-testid='import-drawer'>
      <button
        data-testid='upload-button'
        onClick={() => upload(mockFormValues)}
      />
    </div>
  ),
}))

jest.mock('./FileUpload', () => ({
  FileUpload: ({ setData }) => (
    <button
      data-testid={fileUploadTestId}
      onClick={() => setData(mockFile)}
    />
  ),
}))

jest.mock('@/containers/ProgressModal', () => mockShallowComponent('ProgressModal'))

const fileUploadTestId = 'file-upload'
const mockFileName = `DocumentTypeFile${FileExtension.JSON}`
const mockFileContent = 'mock file content'
const mockFile = {
  name: mockFileName,
}
const mockFormValues = {
  name: 'New Doc Type Name',
}

const mockHookData = {
  isValidatingDocumentTypeName: false,
  isUploading: false,
  onUpload: jest.fn(),
  currentRequestsCount: 0,
  totalRequestsCount: 0,
}

const renderAndClickButton = async () => {
  render(<DocumentTypeImportButton />)
  const button = screen.getByTestId(fileUploadTestId)
  await userEvent.click(button)
}

test('renders button correctly', async () => {
  render(<DocumentTypeImportButton />)

  expect(screen.getByTestId(fileUploadTestId)).toBeInTheDocument()
})

test('calls parse imported file on button click', async () => {
  await renderAndClickButton()

  expect(readFileData).nthCalledWith(1, mockFile)
  expect(jsonTryParse).nthCalledWith(1, mockFileContent)
})

test('shows error notification if import file is incorrect', async () => {
  jest.clearAllMocks()
  readFileData.mockImplementationOnce(null)

  await renderAndClickButton()

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.SELECTED_FILE_ERROR),
  )
})

test('shows error notification if import file data is not parsed', async () => {
  jest.clearAllMocks()
  jsonTryParse.mockImplementationOnce(() => null)

  await renderAndClickButton()

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.SELECTED_FILE_ERROR),
  )
})

test('shows error notification if import file data does not contain all fields', async () => {
  jest.clearAllMocks()
  jsonTryParse.mockImplementationOnce(() => ({
    name: mockDocumentTypeData.name,
  }))

  await renderAndClickButton()

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.SELECTED_FILE_ERROR),
  )
})

test('renders DocumentTypeImportDrawer after file data is parsed', async () => {
  await renderAndClickButton()

  expect(screen.getByTestId('import-drawer')).toBeInTheDocument()
})

test('calls onUpload on upload button click', async () => {
  await renderAndClickButton()

  const uploadButton = screen.getByTestId('upload-button')
  await userEvent.click(uploadButton)

  expect(mockHookData.onUpload).nthCalledWith(
    1,
    {
      ...mockDocumentTypeData,
      name: mockFormValues.name,
    },
  )
})

test('renders Progress modal with correct progress percent while document type is uploading', async () => {
  jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()])
  jest.spyOn(React, 'useState').mockReturnValueOnce([mockDocumentTypeData, jest.fn()])
  jest.spyOn(React, 'useState').mockReturnValueOnce([mockFile.name, jest.fn()])

  const mockCurrent = 6
  const mockTotal = 10

  useUploadDocumentType.mockImplementationOnce(() => ({
    ...mockHookData,
    isUploading: true,
    currentRequestsCount: mockCurrent,
    totalRequestsCount: mockTotal,
  }))

  render(<DocumentTypeImportButton />)

  const progressModal = screen.getByTestId('ProgressModal')
  const { current, title, total } = ProgressModal.getProps()

  expect(progressModal).toBeInTheDocument()
  expect(title).toBe(mockDocumentTypeData.name)
  expect(current).toBe(mockCurrent)
  expect(total).toBe(mockTotal)
})
