
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { AddFilesToBatchDrawerButton } from './AddFilesToBatchDrawerButton'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ id: 'mockBatchId' })),
}))

jest.mock('react-hook-form', () => mockReactHookForm)

jest.mock('@/utils/notification', () => mockNotification)

const mockUploadFilesToBatch = jest.fn((d) => ({
  unwrap: () => Promise.resolve(d),
}))

jest.mock('@/apiRTK/batchesApi', () => ({
  useUploadFilesToBatchMutation: jest.fn(() => [
    mockUploadFilesToBatch,
    { isLoading: false },
  ]),
  useFetchBatchQuery: jest.fn(() => ({
    data: {
      id: 'mockBatchId',
      name: 'Mock Batch',
      group: { id: 'group-id' },
    },
  })),
}))

const mockUploadFiles = jest.fn(() => Promise.resolve([{
  path: 'file1.png',
  file: {
    name: 'file1.png',
    settings: {
      documentType: 'image',
      engine: 'default',
      llmType: 'basic',
      parsingFeatures: ['kvps', 'tables'],
    },
  },
  settings: {
    name: 'batch name',
    group: {
      id: 'group-id',
    },
    documentType: '123',
    engine: 'default',
    llmType: 'basic',
    parsingFeatures: ['kvps', 'tables'],
  },
}]))

jest.mock('../useUploadBatchFiles', () => ({
  useUploadBatchFiles: jest.fn(() => ({
    uploadFiles: mockUploadFiles,
    areFilesUploading: false,
    completedRequests: 0,
    resetRequestsCounter: jest.fn(),
  })),
}))

const mockFormValues = {
  batchId: 'mockBatchId',
  files: [
    {
      path: 'file1.png',
      name: undefined,
      documentTypeId: '123',
      processingParams: {
        engine: 'default',
        language: undefined,
        llmType: 'basic',
        parsingFeatures: ['kvps', 'tables'],
      },
    },
  ],
}

useForm.mockImplementation(() => ({
  watch: jest.fn(() => mockFormValues),
  getValues: jest.fn(() => mockFormValues),
}))

jest.mock('./AddFilesForm', () => mockShallowComponent('AddFilesForm'))

test('shows drawer when trigger is clicked', async () => {
  render(<AddFilesToBatchDrawerButton />)

  await userEvent.click(screen.getByTestId('add-files-drawer-add-files-button'))

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
})

test('calls upload files with expected files', async () => {
  render(<AddFilesToBatchDrawerButton />)

  await userEvent.click(screen.getByTestId('add-files-drawer-add-files-button'))
  await userEvent.click(screen.getByTestId('add-files-drawer-save-button'))

  expect(mockUploadFilesToBatch).nthCalledWith(1, mockFormValues)
})

test('calls notifySuccess with expected message', async () => {
  jest.clearAllMocks()

  render(<AddFilesToBatchDrawerButton />)

  await userEvent.click(screen.getByTestId('add-files-drawer-add-files-button'))

  await userEvent.click(screen.getByTestId('add-files-drawer-save-button'))

  expect(notifySuccess).nthCalledWith(1, localize(Localization.FILES_UPLOADED_SUCCESSFULLY))
})

test('calls notifyWarning with expected message in case create batch api error', async () => {
  jest.clearAllMocks()

  const mockError = new Error('')

  mockUploadFilesToBatch.mockImplementation(() => ({
    unwrap: () => Promise.reject(mockError),
  }))

  render(<AddFilesToBatchDrawerButton />)

  await userEvent.click(screen.getByTestId('add-files-drawer-add-files-button'))

  await userEvent.click(screen.getByTestId('add-files-drawer-save-button'))

  expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
})

test('renders ProgressModal when files are uploading', () => {
  jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()])
  jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()])

  render(<AddFilesToBatchDrawerButton />)

  expect(screen.getByText(localize(Localization.UPLOAD_FILES))).toBeInTheDocument()
})
