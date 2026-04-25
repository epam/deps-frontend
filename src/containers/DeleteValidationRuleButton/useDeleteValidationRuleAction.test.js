
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { fetchDocumentType } from '@/actions/documentType'
import { Modal } from '@/components/Modal'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { Localization, localize } from '@/localization/i18n'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { render } from '@/utils/rendererRTL'
import { useDeleteValidationRuleAction } from './useDeleteValidationRuleAction'

jest.mock('@/selectors/documentType')
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/actions/documentType', () => ({
  fetchDocumentType: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useDeleteCrossFieldValidatorMutation: jest.fn(() => [mockDeleteCrossFieldValidatorFunction]),
  useDeleteValidatorRuleMutation: jest.fn(() => [mockDeleteValidatorRuleFunction]),
}))

Modal.confirm = jest.fn((config) => config.onOk())

const mockDeleteCrossFieldValidatorFunction = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve()),
}))

const mockDeleteValidatorRuleFunction = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve()),
}))

const mockDispatch = jest.fn()

const mockValidatorId = 'mockValidatorId'
const mockRuleName = 'mockRuleName'
const mockFieldName1 = 'Field Name 1'
const mockFieldName2 = 'Field Name 2'

const mockDocumentType = new ExtendedDocumentType({
  code: 'mockDocumentTypeCode',
  name: 'mockDocumentTypeName',
})

beforeEach(() => {
  jest.clearAllMocks()
  documentTypeStateSelector.mockReturnValue(mockDocumentType)
})

test('returns expected API', () => {
  const { result } = renderHook(() => useDeleteValidationRuleAction())
  const { confirmAndDeleteValidationRule } = result.current

  expect(confirmAndDeleteValidationRule).toEqual(expect.any(Function))
})

test('renders confirmation modal correctly in case validator rule deletion', async () => {
  Modal.confirm.mockImplementationOnce((config) => {
    render(
      <div>
        <div>{config.title}</div>
        <div>{config.content}</div>
      </div>,
    )
  })

  const { result } = renderHook(() => useDeleteValidationRuleAction())
  const { confirmAndDeleteValidationRule } = result.current

  await confirmAndDeleteValidationRule({
    fieldNames: [mockFieldName1],
    ruleName: mockRuleName,
    validatorCategory: ValidatorCategory.VALIDATOR,
    validatorId: mockValidatorId,
  })

  expect(screen.getByText(localize(Localization.DELETE_VALIDATION_RULE_CONFIRM_TITLE))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.DELETE_VALIDATION_RULE_CONFIRM), { exact: false })).toBeInTheDocument()
  expect(screen.getByText(mockFieldName1)).toBeInTheDocument()
})

test('renders confirmation modal correctly in case cross field validator rule deletion', async () => {
  Modal.confirm.mockImplementationOnce((config) => {
    render(
      <div>
        <div>{config.title}</div>
        <div>{config.content}</div>
      </div>,
    )
  })

  const { result } = renderHook(() => useDeleteValidationRuleAction())
  const { confirmAndDeleteValidationRule } = result.current

  await confirmAndDeleteValidationRule({
    fieldNames: [mockFieldName1, mockFieldName2],
    ruleName: mockRuleName,
    validatorCategory: ValidatorCategory.CROSS_FIELD_VALIDATOR,
    validatorId: mockValidatorId,
  })

  expect(screen.getByText(localize(Localization.DELETE_CROSS_FIELD_VALIDATION_RULE_CONFIRM_TITLE))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.DELETE_CROSS_FIELD_VALIDATION_RULE_CONFIRM), { exact: false })).toBeInTheDocument()
  expect(screen.getByText(`${mockFieldName1}; ${mockFieldName2}`)).toBeInTheDocument()
})

test('calls deleteValidatorRule with correct arguments if case validator rule deletion', async () => {
  const { result } = renderHook(() => useDeleteValidationRuleAction())
  const { confirmAndDeleteValidationRule } = result.current

  await confirmAndDeleteValidationRule({
    fieldNames: [mockFieldName1],
    ruleName: mockRuleName,
    validatorCategory: ValidatorCategory.VALIDATOR,
    validatorId: mockValidatorId,
  })

  expect(mockDeleteValidatorRuleFunction).nthCalledWith(1, {
    documentTypeId: mockDocumentType.code,
    validatorCode: mockValidatorId,
    ruleName: mockRuleName,
  })
})

test('calls deleteCrossFieldValidator with correct arguments in case cross field validator rule deletion', async () => {
  const { result } = renderHook(() => useDeleteValidationRuleAction())
  const { confirmAndDeleteValidationRule } = result.current

  await confirmAndDeleteValidationRule({
    fieldNames: [mockFieldName1, mockFieldName2],
    ruleName: mockRuleName,
    validatorCategory: ValidatorCategory.CROSS_FIELD_VALIDATOR,
    validatorId: mockValidatorId,
  })

  expect(mockDeleteCrossFieldValidatorFunction).nthCalledWith(1, {
    documentTypeId: mockDocumentType.code,
    validatorId: mockValidatorId,
  })
})

test('calls notifySuccess with correct message in case successful deletion', async () => {
  const { result } = renderHook(() => useDeleteValidationRuleAction())
  const { confirmAndDeleteValidationRule } = result.current

  await confirmAndDeleteValidationRule({
    fieldNames: [mockFieldName1, mockFieldName2],
    ruleName: mockRuleName,
    validatorCategory: ValidatorCategory.CROSS_FIELD_VALIDATOR,
    validatorId: mockValidatorId,
  })

  expect(mockNotification.notifySuccess).nthCalledWith(
    1,
    localize(Localization.VALIDATION_RULE_SUCCESS_DELETION, { ruleName: mockRuleName }),
  )
})

test('calls notifyWarning with correct message in case of deletion failed', async () => {
  const mockError = new Error('test')

  mockDeleteCrossFieldValidatorFunction.mockImplementationOnce(() => ({
    unwrap: () => Promise.reject(mockError),
  }))

  const { result } = renderHook(() => useDeleteValidationRuleAction())
  const { confirmAndDeleteValidationRule } = result.current

  await confirmAndDeleteValidationRule({
    fieldNames: [mockFieldName1, mockFieldName2],
    ruleName: mockRuleName,
    validatorCategory: ValidatorCategory.CROSS_FIELD_VALIDATOR,
    validatorId: mockValidatorId,
  })

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})

test('calls notifyWarning with correct message in case of deletion failed with known code', async () => {
  const mockError = {
    data: {
      code: ErrorCode.invalidSyntax,
    },
  }

  mockDeleteCrossFieldValidatorFunction.mockImplementationOnce(() => ({
    unwrap: () => Promise.reject(mockError),
  }))

  const { result } = renderHook(() => useDeleteValidationRuleAction())
  const { confirmAndDeleteValidationRule } = result.current

  await confirmAndDeleteValidationRule({
    fieldNames: [mockFieldName1, mockFieldName2],
    ruleName: mockRuleName,
    validatorCategory: ValidatorCategory.CROSS_FIELD_VALIDATOR,
    validatorId: mockValidatorId,
  })

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    RESOURCE_ERROR_TO_DISPLAY[ErrorCode.invalidSyntax],
  )
})

test('calls fetch document type actions with correct arguments after rule deleting', async () => {
  const { result } = renderHook(() => useDeleteValidationRuleAction())
  const { confirmAndDeleteValidationRule } = result.current

  await confirmAndDeleteValidationRule({
    fieldNames: [mockFieldName1, mockFieldName2],
    ruleName: mockRuleName,
    validatorCategory: ValidatorCategory.CROSS_FIELD_VALIDATOR,
    validatorId: mockValidatorId,
  })

  expect(mockDispatch).toHaveBeenCalledTimes(1)

  expect(fetchDocumentType).nthCalledWith(
    1,
    mockDocumentType.code,
    [DocumentTypeExtras.VALIDATORS],
  )
})
