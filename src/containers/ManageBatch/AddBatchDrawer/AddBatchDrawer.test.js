
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { AddBatchDrawer } from '.'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-hook-form', () => mockReactHookForm)

jest.mock('@/utils/notification', () => mockNotification)

const TEST_ID = {
  SAVE_BUTTON: 'add-batch-drawer-save-button',
  ADD_BATCH_DRAWER: 'add-batch-drawer',
}

const mockCreateBatch = jest.fn((d) => ({
  unwrap: () => Promise.resolve(d),
}))

jest.mock('@/apiRTK/batchesApi', () => ({
  useCreateBatchMutation: jest.fn(() => [
    mockCreateBatch,
    { isLoading: false }]),
}))

const mockUploadFiles = jest.fn(() => Promise.resolve([{
  name: 'file1.png',
  path: 'file1.png',
  settings: {
    documentType: 'image',
    engine: 'default',
    llmType: 'basic',
    parsingFeatures: ['kvps', 'tables'],
  },
}]))

jest.mock('../useUploadBatchFiles', () => ({
  useUploadBatchFiles: jest.fn(() => ({
    uploadFiles: mockUploadFiles,
    completedRequests: 0,
    resetRequestsCounter: jest.fn(),
  })),
}))

const mockFormValues = {
  files: [{
    name: 'file1.png',
  }],
  name: 'batch name',
  group: {
    id: 'group-id',
  },
  documentType: 'image',
  engine: 'default',
  llmType: 'basic',
  parsingFeatures: ['kvps', 'tables'],
}

const mockForm = {
  getValues: jest.fn(() => mockFormValues),
  watch: jest.fn(() => mockFormValues),
  reset: jest.fn(),
}

useForm.mockImplementation(() => mockForm)

jest.mock('./AddBatchForm',
  () => mockShallowComponent('AddBatchForm'),
)

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}))

beforeEach(() => {
  jest.clearAllMocks()
  useSelector.mockReturnValue(true)
})

test('uploads files with correct data when Save is clicked', async () => {
  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<AddBatchDrawer {...defaultProps} />)

  await userEvent.click(screen.getByTestId(TEST_ID.SAVE_BUTTON))

  expect(mockUploadFiles).toHaveBeenCalledWith(mockFormValues.files)
})

test('creates batch with correct parameters when Save is clicked', async () => {
  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<AddBatchDrawer {...defaultProps} />)

  await userEvent.click(screen.getByTestId(TEST_ID.SAVE_BUTTON))

  expect(mockCreateBatch).toHaveBeenCalledWith({
    files: [{
      name: 'file1.png',
      path: 'file1.png',
      documentTypeId: 'image',
      processingParams: {
        engine: 'default',
        llmType: 'basic',
        parsingFeatures: ['kvps', 'tables'],
      },
    }],
    groupId: 'group-id',
    name: 'batch name',
  })
})

test('shows success notification when batch is created successfully', async () => {
  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<AddBatchDrawer {...defaultProps} />)

  await userEvent.click(screen.getByTestId(TEST_ID.SAVE_BUTTON))

  expect(notifySuccess).toHaveBeenCalledWith(localize(Localization.BATCH_WAS_CREATED))
})

test('shows warning notification when batch creation fails', async () => {
  const mockError = new Error('')

  mockCreateBatch.mockImplementationOnce(() => ({
    unwrap: () => Promise.reject(mockError),
  }))

  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<AddBatchDrawer {...defaultProps} />)

  await userEvent.click(screen.getByTestId(TEST_ID.SAVE_BUTTON))

  expect(notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
})

test('disables Save button when batch name is empty', () => {
  useForm.mockImplementationOnce(() => ({
    ...mockForm,
    watch: jest.fn(() => ({
      ...mockFormValues,
      name: '',
    })),
  }))

  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<AddBatchDrawer {...defaultProps} />)

  expect(screen.getByTestId(TEST_ID.SAVE_BUTTON)).toBeDisabled()
})

test('disables Save button when no files are selected', () => {
  useForm.mockImplementationOnce(() => ({
    ...mockForm,
    watch: jest.fn(() => ({
      ...mockFormValues,
      files: [],
    })),
  }))

  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<AddBatchDrawer {...defaultProps} />)

  expect(screen.getByTestId(TEST_ID.SAVE_BUTTON)).toBeDisabled()
})

test('renders ProgressModal when files are uploading', () => {
  jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()])

  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<AddBatchDrawer {...defaultProps} />)

  expect(screen.getByText(localize(Localization.UPLOAD_FILES))).toBeInTheDocument()
})
