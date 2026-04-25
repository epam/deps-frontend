
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { ValidationRuleSeverity } from '@/enums/ValidationRuleSeverity'
import { Localization, localize } from '@/localization/i18n'
import { CrossFieldValidator, IssueMessage } from '@/models/CrossFieldValidator'
import { render } from '@/utils/rendererRTL'
import { ListMode } from './constants'
import { FieldBusinessRuleModal } from './FieldBusinessRuleModal'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    formState: {
      isValid: true,
    },
    getValues: jest.fn(() => mockValues),
    handleSubmit: jest.fn((fn) => fn),
  })),
}))

jest.mock('./FieldBusinessRuleForm', () => ({
  FieldBusinessRuleForm: () => <div data-testid={businessRuleFormTestId} />,
}))

const businessRuleFormTestId = 'businessRuleForm'
const mockFieldCode1 = 'fieldCode1'
const mockFieldCode2 = 'fieldCode2'

const mockValues = {
  name: 'Test Rule',
  validatedFields: ['code1'],
  issueMessage: 'Test error message',
  rule: 'rule here',
  listMode: ListMode.FOR_ANY,
  severity: ValidationRuleSeverity.ERROR,
}

const mockFieldRule = new CrossFieldValidator({
  id: 'v1',
  name: 'Rule Name',
  issueMessage: new IssueMessage({
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Please check ${fieldCode1} and ${fieldCode2}',
    dependentFields: [mockFieldCode1, mockFieldCode2],
  }),
  rule: 'Test Rule',
  severity: ValidationRuleSeverity.WARNING,
  validatedFields: [mockFieldCode1, mockFieldCode2],
  forAny: true,
  forEach: false,
})

test('renders modal with content', () => {
  render(
    <FieldBusinessRuleModal
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={jest.fn()}
      visible={true}
    />,
  )

  expect(screen.getByText(localize(Localization.CREATE_BUSINESS_RULE))).toBeInTheDocument()
  expect(screen.getByTestId(businessRuleFormTestId)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: localize(Localization.CANCEL) })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: localize(Localization.CREATE) })).toBeInTheDocument()
})

test('renders modal with correct content if fieldRule is passed', () => {
  render(
    <FieldBusinessRuleModal
      fieldRule={mockFieldRule}
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={jest.fn()}
      visible={true}
    />,
  )

  expect(screen.getByText(localize(Localization.EDIT_BUSINESS_RULE))).toBeInTheDocument()
  expect(screen.getByTestId(businessRuleFormTestId)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: localize(Localization.CANCEL) })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: localize(Localization.SAVE) })).toBeInTheDocument()
})

test('calls onCancel prop on cancel button click', async () => {
  const onCancel = jest.fn()

  render(
    <FieldBusinessRuleModal
      isLoading={false}
      onCancel={onCancel}
      onSubmit={jest.fn()}
      visible={true}
    />,
  )

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.CANCEL) }))
  expect(onCancel).toHaveBeenCalled()
})

test('disables submit button when form is invalid', () => {
  useForm.mockImplementationOnce(() => ({
    formState: {
      isValid: false,
    },
    getValues: jest.fn(() => { }),
    handleSubmit: jest.fn((fn) => fn),
  }))

  render(
    <FieldBusinessRuleModal
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={jest.fn()}
      visible={true}
    />,
  )

  expect(screen.getByRole('button', { name: localize(Localization.CREATE) })).toBeDisabled()
})

test('disables cancel button when isLoading is true', () => {
  render(
    <FieldBusinessRuleModal
      isLoading={true}
      onCancel={jest.fn()}
      onSubmit={jest.fn()}
      visible={true}
    />,
  )

  expect(screen.getByRole('button', { name: localize(Localization.CANCEL) })).toBeDisabled()
})

test('enables create button when form is valid and calls onSubmit on button click', async () => {
  const onSubmit = jest.fn()

  render(
    <FieldBusinessRuleModal
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={onSubmit}
      visible={true}
    />,
  )

  const submitButton = screen.getByRole('button', { name: localize(Localization.CREATE) })

  await userEvent.click(submitButton)

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      name: mockValues.name,
      validatedFields: mockValues.validatedFields,
      issueMessage: mockValues.issueMessage,
      rule: mockValues.rule,
      forEach: mockValues.listMode === ListMode.FOR_EACH,
      forAny: mockValues.listMode === ListMode.FOR_ANY,
      severity: mockValues.severity,
      dependentFields: [],
    })
  })
})

test('sets default values if fieldRule is passed', () => {
  jest.clearAllMocks()

  render(
    <FieldBusinessRuleModal
      fieldRule={mockFieldRule}
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={jest.fn()}
      visible={true}
    />,
  )

  expect(useForm).toHaveBeenCalledWith({
    defaultValues: {
      dependentFields: mockFieldRule.issueMessage.dependentFields,
      issueMessage: mockFieldRule.issueMessage.message,
      listMode: ListMode.FOR_ANY,
      name: mockFieldRule.name,
      rule: mockFieldRule.rule,
      severity: mockFieldRule.severity,
      validatedFields: mockFieldRule.validatedFields,
    },
    mode: expect.any(String),
    shouldUnregister: expect.any(Boolean),
  })
})

test('enables save button when form is valid and calls onSubmit on button click if fieldRule is edited', async () => {
  const onSubmit = jest.fn()
  render(
    <FieldBusinessRuleModal
      fieldRule={mockFieldRule}
      isLoading={false}
      onCancel={jest.fn()}
      onSubmit={onSubmit}
      visible={true}
    />,
  )

  const submitButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  await userEvent.click(submitButton)

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      name: mockValues.name,
      validatedFields: mockValues.validatedFields,
      issueMessage: mockValues.issueMessage,
      rule: mockValues.rule,
      forEach: mockValues.listMode === ListMode.FOR_EACH,
      forAny: mockValues.listMode === ListMode.FOR_ANY,
      severity: mockValues.severity,
      dependentFields: [],
    })
  })
})
