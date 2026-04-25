
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { refreshDocuments } from '@/actions/documentsListPage'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { DefaultFormValues, FIELD_FORM_CODE } from './constants'
import { UploadDocumentsDrawer } from './UploadDocumentsDrawer'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => mockReactHookForm)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/actions/documentsListPage', () => ({
  refreshDocuments: jest.fn(),
}))

jest.mock('react-redux', () => mockReactRedux)

jest.mock('./hooks', () => ({
  useUploadDocuments: jest.fn(() => ({
    uploadDocuments: mockUploadDocuments,
    areDocumentsUploading: false,
  })),
}))

jest.mock('./UploadFilesForm', () => mockShallowComponent('UploadFilesForm'))
jest.mock('./DocumentSettingsForm', () => mockShallowComponent('DocumentSettingsForm'))

useForm.mockImplementation(() => ({
  watch: jest.fn(() => mockFormValues),
  getValues: jest.fn(() => mockFormValues),
  reset: mockResetCallback,
}))

const mockUploadDocuments = jest.fn(() => Promise.resolve([]))

const mockFormValues = {
  ...DefaultFormValues,
  [FIELD_FORM_CODE.FILES]: [{
    name: 'file1.png',
    uid: 'uid1',
  }],
  [FIELD_FORM_CODE.DOCUMENT_TYPE]: 'test',
}

const mockResetCallback = jest.fn()

test('uploads documents with correct data when Upload btn is clicked', async () => {
  jest.clearAllMocks()

  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<UploadDocumentsDrawer {...defaultProps} />)

  const triggerBtn = screen.getByRole('button', {
    name: localize(Localization.UPLOAD),
  })

  await userEvent.click(triggerBtn)

  const saveBtn = screen.getByRole('button', {
    name: localize(Localization.UPLOAD),
    exact: false,
  })

  await userEvent.click(saveBtn)

  expect(mockUploadDocuments).nthCalledWith(1, mockFormValues)
})

test('calls refreshDocuments with correct args  when Upload btn is clicked', async () => {
  jest.clearAllMocks()

  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<UploadDocumentsDrawer {...defaultProps} />)

  const triggerBtn = screen.getByRole('button', {
    name: localize(Localization.UPLOAD),
  })

  await userEvent.click(triggerBtn)

  const saveBtn = screen.getByRole('button', {
    name: localize(Localization.UPLOAD),
    exact: false,
  })

  await userEvent.click(saveBtn)

  expect(refreshDocuments).toHaveBeenCalled()
})

test('disables Save button when no files are selected', async () => {
  useForm.mockImplementationOnce(() => ({
    watch: jest.fn(() => ({
      ...mockFormValues,
      files: [],
    })),
    getValues: jest.fn(() => ({
      ...mockFormValues,
      files: [],
    })),
  }))

  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<UploadDocumentsDrawer {...defaultProps} />)

  const saveBtn = screen.getByRole('button', {
    name: localize(Localization.UPLOAD),
    exact: false,
  })

  expect(saveBtn).toBeDisabled()
})

test('disables Save button when document type is not selected', async () => {
  useForm.mockImplementationOnce(() => ({
    watch: jest.fn(() => ({
      ...mockFormValues,
      documentType: null,
    })),
    getValues: jest.fn(() => ({
      ...mockFormValues,
      documentType: null,
    })),
  }))

  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<UploadDocumentsDrawer {...defaultProps} />)

  const saveBtn = screen.getByRole('button', {
    name: localize(Localization.UPLOAD),
    exact: false,
  })

  expect(saveBtn).toBeDisabled()
})

test('calls for reset when click on Reset All button', async () => {
  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<UploadDocumentsDrawer {...defaultProps} />)

  const resetBtn = screen.getByRole('button', {
    name: localize(Localization.RESET_SETTINGS),
    exact: false,
  })

  await userEvent.click(resetBtn)

  expect(mockResetCallback).nthCalledWith(1, {
    ...mockFormValues,
    [FIELD_FORM_CODE.DOCUMENT_TYPE]: null,
    [FIELD_FORM_CODE.FILES]: mockFormValues.files,
  })
})
