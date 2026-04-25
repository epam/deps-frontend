
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchDocumentType } from '@/actions/documentType'
import { useCreateCrossFieldValidatorMutation } from '@/apiRTK/documentTypeApi'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { RESOURCE_ERROR_TO_DISPLAY, ErrorCode } from '@/enums/Errors'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { render } from '@/utils/rendererRTL'
import { AddBusinessRule } from './AddBusinessRule'

jest.mock('@/selectors/documentType')
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/actions/documentType', () => ({
  fetchDocumentType: jest.fn(),
}))

const mockCreateCrossFieldValidator = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useCreateCrossFieldValidatorMutation: jest.fn(() => ([
    mockCreateCrossFieldValidator,
    { isLoading: false },
  ])),
}))

jest.mock('@/containers/FieldBusinessRuleModal', () => ({
  FieldBusinessRuleModal: ({ visible, onCancel, onSubmit }) => {
    onCancel && (mockOnCancelHandler = onCancel)
    onSubmit && (mockOnSubmitHandler = onSubmit)

    return (
      visible ? (
        <div data-testid={mockModalTestId} />
      ) : null
    )
  },
}))

const mockDocumentType = new ExtendedDocumentType({
  code: 'code',
  name: 'Document Type',
  fields: [
    new DocumentTypeField(
      'field-id',
      'Field name',
      {},
      FieldType.STRING,
    ),
  ],
})

let mockOnCancelHandler
let mockOnSubmitHandler
const mockRuleDto = { name: 'rule name' }
const mockModalTestId = 'mock-modal'

beforeEach(() => {
  jest.clearAllMocks()
  documentTypeStateSelector.mockReturnValue(mockDocumentType)
})

test('opens modal on button click and closes on cancel', async () => {
  render(<AddBusinessRule />)

  const openButton = screen.getByRole('button', { name: localize(Localization.ADD_BUSINESS_RULE) })

  await userEvent.click(openButton)
  await waitFor(() => {
    expect(screen.getByTestId(mockModalTestId)).toBeInTheDocument()
  })

  act(() => {
    mockOnCancelHandler()
  })
  expect(screen.queryByTestId(mockModalTestId)).not.toBeInTheDocument()
})

test('renders custom trigger when provided', async () => {
  const customTriggerText = 'custom trigger'
  const renderTrigger = jest.fn(({ disabled, onClick }) => (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {customTriggerText}
    </button>
  ))

  render(<AddBusinessRule renderTrigger={renderTrigger} />)

  expect(renderTrigger).toHaveBeenCalledWith(expect.objectContaining({
    disabled: false,
    onClick: expect.any(Function),
  }))

  await userEvent.click(screen.getByRole('button', { name: customTriggerText }))

  await waitFor(() => {
    expect(screen.getByTestId(mockModalTestId)).toBeInTheDocument()
  })
})

test('disables default trigger when document type has no fields', () => {
  documentTypeStateSelector.mockReturnValue({
    ...mockDocumentType,
    fields: [],
  })

  render(<AddBusinessRule />)

  expect(screen.getByRole('button', { name: localize(Localization.ADD_BUSINESS_RULE) })).toBeDisabled()
})

test('disables trigger while validator creation is loading', () => {
  documentTypeStateSelector.mockReturnValue({
    ...mockDocumentType,
    fields: [{ id: 'field-id' }],
  })

  useCreateCrossFieldValidatorMutation.mockImplementationOnce(() => ([
    mockCreateCrossFieldValidator,
    { isLoading: true },
  ]))

  render(<AddBusinessRule />)

  expect(screen.getByRole('button', { name: localize(Localization.ADD_BUSINESS_RULE) })).toBeDisabled()
})

test('submits rule and calls api with documentType id and data', async () => {
  render(<AddBusinessRule />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.ADD_BUSINESS_RULE) }))
  mockOnSubmitHandler(mockRuleDto)

  await waitFor(() => {
    expect(mockCreateCrossFieldValidator).toHaveBeenCalledWith({
      documentTypeId: mockDocumentType.code,
      data: mockRuleDto,
    })
  })
})

test('calls notifySuccess and refetch document type after validator creation', async () => {
  render(<AddBusinessRule />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.ADD_BUSINESS_RULE) }))
  mockOnSubmitHandler(mockRuleDto)

  await waitFor(() => {
    expect(mockNotification.notifySuccess).toHaveBeenCalledWith(localize(Localization.BUSINESS_RULE_CREATED))
  })

  expect(fetchDocumentType).toHaveBeenCalledWith(mockDocumentType.code, [DocumentTypeExtras.VALIDATORS])
})

test('shows mapped warning on known error code', async () => {
  const mockUnwrap = jest.fn().mockRejectedValue({
    data: {
      code: ErrorCode.alreadyExistsError,
    },
  })

  mockCreateCrossFieldValidator.mockImplementationOnce(() => ({ unwrap: mockUnwrap }))

  render(<AddBusinessRule />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.ADD_BUSINESS_RULE) }))
  mockOnSubmitHandler(mockRuleDto)

  await waitFor(() => {
    expect(mockNotification.notifyWarning).toHaveBeenCalledWith(RESOURCE_ERROR_TO_DISPLAY[ErrorCode.alreadyExistsError])
  })
})

test('shows default warning on unknown error code', async () => {
  const mockUnwrap = jest.fn().mockRejectedValue({
    response: {
      data: {
        code: 'unknown_error',
      },
    },
  })
  mockCreateCrossFieldValidator.mockImplementationOnce(() => ({ unwrap: mockUnwrap }))

  render(<AddBusinessRule />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.ADD_BUSINESS_RULE) }))
  mockOnSubmitHandler(mockRuleDto)

  await waitFor(() => {
    expect(mockNotification.notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
  })
})
