
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchDocumentType } from '@/actions/documentType'
import { FieldBusinessRuleModal } from '@/containers/FieldBusinessRuleModal'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { ValidationRuleSeverity } from '@/enums/ValidationRuleSeverity'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { Localization, localize } from '@/localization/i18n'
import { CrossFieldValidator, IssueMessage } from '@/models/CrossFieldValidator'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { render } from '@/utils/rendererRTL'
import { EditBusinessRuleButton } from './EditBusinessRuleButton'

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
  useUpdateCrossFieldValidatorMutation: jest.fn(() => [
    mockUpdateCrossFieldValidator,
    { isLoading: false },
  ]),
}))

const mockUpdateCrossFieldValidator = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/containers/FieldBusinessRuleModal', () => mockShallowComponent('FieldBusinessRuleModal'))

const mockDispatch = jest.fn()

const mockRenderTrigger = ({ disabled, onClick }) => (
  <button
    data-testid={'edit-trigger'}
    disabled={disabled}
    onClick={onClick}
  />
)

const mockValidatorId = 'mockValidatorId'

const mockFieldRule = new CrossFieldValidator({
  id: mockValidatorId,
  name: 'Rule Name',
  issueMessage: new IssueMessage({
    message: 'Issue message',
    dependentFields: [],
  }),
  rule: 'Test Rule',
  severity: ValidationRuleSeverity.WARNING,
  validatedFields: ['fieldCode1', 'fieldCode2'],
  forAny: false,
  forEach: false,
})

const mockDocumentType = new ExtendedDocumentType({
  code: 'mockDocumentTypeCode',
  name: 'mockDocumentTypeName',
  crossFieldValidators: [mockFieldRule],
})

const mockData = {
  name: 'Updated Rule name',
}

beforeEach(() => {
  jest.clearAllMocks()
  documentTypeStateSelector.mockReturnValue(mockDocumentType)
})

const renderTriggerAndSubmit = async () => {
  render(
    <EditBusinessRuleButton
      renderTrigger={mockRenderTrigger}
      validatorCategory={ValidatorCategory.CROSS_FIELD_VALIDATOR}
      validatorId={mockValidatorId}
    />,
  )

  const editButton = screen.getByTestId('edit-trigger')
  await userEvent.click(editButton)

  const { onSubmit } = FieldBusinessRuleModal.getProps()
  await act(async () => await onSubmit(mockData))
}

test('disables edit trigger and shows correct tooltip message if rule is a single validator', async () => {
  render(
    <EditBusinessRuleButton
      renderTrigger={mockRenderTrigger}
      validatorCategory={ValidatorCategory.VALIDATOR}
      validatorId={mockValidatorId}
    />,
  )
  const trigger = screen.getByTestId('edit-trigger')
  await userEvent.hover(trigger)

  expect(trigger).toBeDisabled()
  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.BUSINESS_RULE_UPDATE_AVAILABLE_FOR_CROSS_FIELD_VALIDATION))
  })
})

test('shows FieldBusinessRuleModal for correct validation rule on edit trigger click', async () => {
  render(
    <EditBusinessRuleButton
      renderTrigger={mockRenderTrigger}
      validatorCategory={ValidatorCategory.CROSS_FIELD_VALIDATOR}
      validatorId={mockValidatorId}
    />,
  )

  const editButton = screen.getByTestId('edit-trigger')
  await userEvent.click(editButton)

  const { fieldRule } = FieldBusinessRuleModal.getProps()

  expect(screen.getByTestId('FieldBusinessRuleModal')).toBeInTheDocument()
  expect(fieldRule).toBe(mockFieldRule)
})

test('calls updateCrossFieldValidator with correct arguments on validation rule updating', async () => {
  await renderTriggerAndSubmit()

  expect(mockUpdateCrossFieldValidator).nthCalledWith(1, {
    documentTypeId: mockDocumentType.code,
    validatorId: mockValidatorId,
    data: mockData,
  })
})

test('calls notifySuccess with correct message in case successful updating', async () => {
  await renderTriggerAndSubmit()

  expect(mockNotification.notifySuccess).nthCalledWith(
    1,
    localize(Localization.BUSINESS_RULE_UPDATED),
  )
})

test('calls notifyWarning with correct message in case of updating failed', async () => {
  const mockError = new Error('test')

  mockUpdateCrossFieldValidator.mockImplementationOnce(() => ({
    unwrap: () => Promise.reject(mockError),
  }))

  await renderTriggerAndSubmit()

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})

test('calls notifyWarning with correct message in case of updating failed with known code', async () => {
  const mockError = {
    data: {
      code: ErrorCode.invalidSyntax,
    },
  }

  mockUpdateCrossFieldValidator.mockImplementationOnce(() => ({
    unwrap: () => Promise.reject(mockError),
  }))

  await renderTriggerAndSubmit()

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    RESOURCE_ERROR_TO_DISPLAY[ErrorCode.invalidSyntax],
  )
})

test('calls fetch document type actions with correct arguments after rule updating', async () => {
  await renderTriggerAndSubmit()

  expect(mockDispatch).toHaveBeenCalledTimes(1)

  expect(fetchDocumentType).nthCalledWith(
    1,
    mockDocumentType.code,
    [DocumentTypeExtras.VALIDATORS],
  )
})
