
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FORM_FIELD_CODES } from '../constants'
import { DocumentTypeImportDrawer } from './DocumentTypeImportDrawer'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../DocumentTypeImportForm', () => ({
  DocumentTypeImportForm: () => <div data-testid='import-form' />,
}))

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    getValues: jest.fn(() => mockFormValues),
    formState: {
      isValid: true,
    },
    handleSubmit: jest.fn(),
    setValue: mockSetValue,
  })),
}))

const mockSetValue = jest.fn()
const mockDocumentTypeName = 'Doc Type Name'
const mockFileName = 'FileName.json'

const mockFormValues = {
  name: 'New Doc Type Name',
}

test('renders Drawer correctly', () => {
  const props = {
    closeDrawer: jest.fn(),
    documentTypeName: mockDocumentTypeName,
    fileName: mockFileName,
    loading: false,
    setData: jest.fn(),
    upload: jest.fn(),
    visible: true,
  }

  render(<DocumentTypeImportDrawer {...props} />)

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
  expect(screen.getByTestId('import-form')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.IMPORT_DOCUMENT_TYPE))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.CANCEL))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.UPLOAD))).toBeInTheDocument()
})

test('calls closeDrawer when click on Cancel button', async () => {
  const props = {
    closeDrawer: jest.fn(),
    documentTypeName: mockDocumentTypeName,
    fileName: mockFileName,
    loading: false,
    setData: jest.fn(),
    upload: jest.fn(),
    visible: true,
  }

  render(<DocumentTypeImportDrawer {...props} />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.CANCEL) }))

  expect(props.closeDrawer).toHaveBeenCalled()
})

test('calls upload with correct arguments when click on Upload button', async () => {
  const props = {
    closeDrawer: jest.fn(),
    documentTypeName: mockDocumentTypeName,
    fileName: mockFileName,
    loading: false,
    setData: jest.fn(),
    upload: jest.fn(),
    visible: true,
  }

  render(<DocumentTypeImportDrawer {...props} />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.UPLOAD) }))

  expect(props.upload).nthCalledWith(1, mockFormValues)
})

test('sets Document type name and File name while component rendering', async () => {
  jest.clearAllMocks()

  const props = {
    closeDrawer: jest.fn(),
    documentTypeName: mockDocumentTypeName,
    fileName: mockFileName,
    loading: false,
    setData: jest.fn(),
    upload: jest.fn(),
    visible: true,
  }

  render(<DocumentTypeImportDrawer {...props} />)

  expect(mockSetValue).nthCalledWith(1, FORM_FIELD_CODES.DOCUMENT_TYPE_NAME, mockDocumentTypeName)
  expect(mockSetValue).nthCalledWith(2, FORM_FIELD_CODES.FILE, mockFileName)
})

test('disables Upload button if form data is not valid', () => {
  useForm.mockImplementationOnce(() => ({
    formState: {
      isValid: false,
    },
    setValue: mockSetValue,
  }))

  const props = {
    closeDrawer: jest.fn(),
    documentTypeName: mockDocumentTypeName,
    fileName: mockFileName,
    loading: false,
    setData: jest.fn(),
    upload: jest.fn(),
    visible: true,
  }

  render(<DocumentTypeImportDrawer {...props} />)

  const uploadButton = screen.getByRole('button', { name: localize(Localization.UPLOAD) })
  expect(uploadButton).toBeDisabled()
})

test('disables Upload and Cancel buttons if loading is true', () => {
  const props = {
    closeDrawer: jest.fn(),
    documentTypeName: mockDocumentTypeName,
    fileName: mockFileName,
    loading: true,
    setData: jest.fn(),
    upload: jest.fn(),
    visible: true,
  }

  render(<DocumentTypeImportDrawer {...props} />)

  const uploadButton = screen.getByRole('button', { name: new RegExp(localize(Localization.UPLOAD, 'i')) })
  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })

  expect(uploadButton).toHaveClass('ant-btn-loading')
  expect(uploadButton).toBeDisabled()
  expect(cancelButton).toBeDisabled()
})
