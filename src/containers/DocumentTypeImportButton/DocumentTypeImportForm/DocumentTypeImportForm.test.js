
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { useForm, FormProvider } from 'react-hook-form'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FORM_FIELD_CODES } from '../constants'
import { DocumentTypeImportForm } from './DocumentTypeImportForm'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('../FileUpload', () => ({
  FileUpload: ({ value }) => (
    <div data-testid='file-upload'>
      {value}
    </div>
  ),
}))

const { result } = renderHook(() => useForm())
const methods = result.current

const mockDocumentTypeName = 'Doc Type Name'
const mockFileName = 'File Name'

methods.setValue(FORM_FIELD_CODES.DOCUMENT_TYPE_NAME, mockDocumentTypeName)
methods.setValue(FORM_FIELD_CODES.FILE, mockFileName)

test('displays name field correctly', () => {
  render(
    <FormProvider {...methods}>
      <DocumentTypeImportForm
        disabled={false}
        handleSubmit={jest.fn()}
        onSubmit={jest.fn()}
        setData={jest.fn()}
      />
    </FormProvider>,
  )

  const nameInput = screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))

  expect(screen.getByText(localize(Localization.NAME))).toBeInTheDocument()
  expect(nameInput).toBeInTheDocument()
  expect(nameInput).toHaveValue(mockDocumentTypeName)
})

test('displays file upload field correctly', () => {
  render(
    <FormProvider {...methods}>
      <DocumentTypeImportForm
        disabled={false}
        handleSubmit={jest.fn()}
        onSubmit={jest.fn()}
        setData={jest.fn()}
      />
    </FormProvider>,
  )

  expect(screen.getByTestId('file-upload')).toBeInTheDocument()
  expect(screen.getByText(mockFileName)).toBeInTheDocument()
})
