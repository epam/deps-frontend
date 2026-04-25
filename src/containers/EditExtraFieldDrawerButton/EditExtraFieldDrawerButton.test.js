
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import {
  fireEvent,
  screen,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { updateExtraFields } from '@/api/enrichmentApi'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { EditExtraFieldDrawerButton } from './EditExtraFieldDrawerButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/api/enrichmentApi', () => ({
  updateExtraFields: jest.fn(() => Promise.resolve({})),
}))
jest.mock('@/utils/notification', () => mockNotification)

const mockDocumentType = new DocumentType(
  'DocType1',
  'Doc Type2',
)

const mockExtraField = new DocumentTypeExtraField({
  code: 'mockFieldCode',
  name: 'Field Name',
  order: 1,
  type: FieldType.STRING,
  autoFilled: false,
})

const editIconTestId = 'edit-icon'
jest.mock('@/components/Icons/PenIcon', () => ({
  PenIcon: () => <div data-testid={editIconTestId} />,
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('shows extra field editing drawer in case of button click', async () => {
  render(
    <EditExtraFieldDrawerButton
      documentTypeCode={mockDocumentType.code}
      field={mockExtraField}
      onAfterEditing={jest.fn()}
    />,
  )

  const editButton = screen.getByTestId(editIconTestId)

  await userEvent.click(editButton)

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
})

test('calls updateExtraFields api with correct parameters when save field', async () => {
  render(
    <EditExtraFieldDrawerButton
      documentTypeCode={mockDocumentType.code}
      field={mockExtraField}
      onAfterEditing={jest.fn()}
    />,
  )

  const editButton = screen.getByTestId(editIconTestId)

  await userEvent.click(editButton)

  const input = screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))
  const submitButton = screen.getByRole('button', {
    name: (localize(Localization.SUBMIT)),
  })

  fireEvent.change(input, { target: { value: mockExtraField.name } })

  await userEvent.click(submitButton)

  expect(updateExtraFields).toHaveBeenCalledWith(
    mockDocumentType.code,
    [
      {
        code: mockExtraField.code,
        name: mockExtraField.name,
        order: mockExtraField.order,
      },
    ],
  )
})

test('calls notifySuccess and onAfterEditing prop in case editing was successful', async () => {
  const mockOnAfterEditing = jest.fn()

  render(
    <EditExtraFieldDrawerButton
      documentTypeCode={mockDocumentType.code}
      field={mockExtraField}
      onAfterEditing={mockOnAfterEditing}
    />,
  )

  const editButton = screen.getByTestId(editIconTestId)

  await userEvent.click(editButton)

  const submitButton = screen.getByRole('button', {
    name: (localize(Localization.SUBMIT)),
  })

  await userEvent.click(submitButton)

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.FIELD_UPDATE_SUCCESS_MESSAGE),
  )

  expect(mockOnAfterEditing).toHaveBeenCalledTimes(1)
})

test('calls notifyWarning with appropriate error message when editing fails with known error code', async () => {
  const errorCode = 'already_exists_error'
  const mockError = {
    response: {
      data: {
        code: errorCode,
      },
    },
  }

  updateExtraFields.mockImplementation(() => Promise.reject(mockError))

  render(
    <EditExtraFieldDrawerButton
      documentTypeCode={mockDocumentType.code}
      field={mockExtraField}
      onAfterEditing={jest.fn()}
    />,
  )

  const editButton = screen.getByTestId(editIconTestId)

  await userEvent.click(editButton)

  const submitButton = screen.getByRole('button', {
    name: (localize(Localization.SUBMIT)),
  })

  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    RESOURCE_ERROR_TO_DISPLAY[errorCode],
  )
})

test('calls notifyWarning with default error message when editing fails with unknown error code', async () => {
  const mockUnknownError = new Error('')

  updateExtraFields.mockImplementation(() => Promise.reject(mockUnknownError))

  render(
    <EditExtraFieldDrawerButton
      documentTypeCode={mockDocumentType.code}
      field={mockExtraField}
      onAfterEditing={jest.fn()}
    />,
  )

  const editButton = screen.getByTestId(editIconTestId)

  await userEvent.click(editButton)

  const submitButton = screen.getByRole('button', {
    name: (localize(Localization.SUBMIT)),
  })

  await userEvent.click(submitButton)

  expect(notifyWarning).toHaveBeenCalledWith(
    localize(Localization.DEFAULT_ERROR),
  )
  expect(notifyWarning).toHaveBeenCalledTimes(1)
})
