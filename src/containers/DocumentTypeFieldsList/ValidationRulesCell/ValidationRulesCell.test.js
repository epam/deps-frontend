
import { mockEnv } from '@/mocks/mockEnv'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useDeleteValidationRuleAction } from '@/containers/DeleteValidationRuleButton'
import { FieldType } from '@/enums/FieldType'
import { ValidationRuleSeverity, RESOURCE_VALIDATION_RULE_SEVERITY } from '@/enums/ValidationRuleSeverity'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { CrossFieldValidator, IssueMessage } from '@/models/CrossFieldValidator'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { ValidatorRule } from '@/models/Validator'
import { render } from '@/utils/rendererRTL'
import { ValidationRulesCell } from './ValidationRulesCell'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/LongTagsList', () => ({
  LongTagsList: jest.fn(({ tags, renderVisibleTagContent, onTagClose }) => tags.map((t) => (
    <div key={t.id}>
      {renderVisibleTagContent(t)}
      <button
        data-testid='close-button'
        onClick={() => onTagClose(t)}
      />
    </div>
  ))),
}))

jest.mock('@/components/Dropdown', () => ({
  Dropdown: ({ children, dropdownRender }) => (
    <>
      <div data-testid='dropdown-trigger'>
        {children}
      </div>
      <div data-testid='dropdown-overlay'>
        {dropdownRender?.()}
      </div>
    </>
  ),
}))

jest.mock('@/components/LongText', () => ({
  LongText: jest.fn(({ text }) => text),
}))

jest.mock('@/containers/DeleteValidationRuleButton', () => ({
  useDeleteValidationRuleAction: jest.fn(() => mockHookData),
}))

const mockHookData = {
  confirmAndDeleteValidationRule: jest.fn(),
}

const mockExtractionFieldCode = 'fieldCode'
const mockExtraFieldCode = 'extraFieldCode'

const extractionField = new DocumentTypeField(
  mockExtractionFieldCode,
  'Extraction Field Name',
  {},
  FieldType.STRING,
  false,
  2,
  'mockDocumentTypeCode',
  2,
)

const extraField = new DocumentTypeExtraField({
  code: mockExtraFieldCode,
  name: 'Extra Field Name',
  order: 1,
})

const mockCrossFieldValidator = new CrossFieldValidator({
  id: 'mockId',
  name: 'Cross Field Validator Name',
  forEach: false,
  forAny: false,
  rule: '',
  severity: ValidationRuleSeverity.ERROR,
  validatedFields: [mockExtractionFieldCode, mockExtraFieldCode],
  issueMessage: new IssueMessage({
    message: '${' + `${mockExtractionFieldCode}` + '} should be equal ${' + `${mockExtraFieldCode}` + '}',
  }),
})

const mockValidatorRule = new ValidatorRule({
  name: 'Validator Rule Name',
  forEach: false,
  forAny: false,
  rule: 'Validator Rule',
  severity: ValidationRuleSeverity.WARNING,
  issueMessage: 'Validator Issue Message',
  needWarningEvenIfOptional: false,
  checkOptionalFields: false,
})

test('shows validators names correctly', () => {
  render(
    <ValidationRulesCell
      extraFields={[extraField]}
      extractionFields={[extractionField]}
      fieldCode={mockExtractionFieldCode}
      validationRules={
        [
          mockValidatorRule,
          mockCrossFieldValidator,
        ]
      }
    />,
  )

  const [ruleName1, ruleName2] = screen.getAllByTestId('dropdown-trigger')

  expect(ruleName1).toHaveTextContent(mockValidatorRule.name)
  expect(ruleName2).toHaveTextContent(mockCrossFieldValidator.name)
})

test('shows details correctly for single validator rule', () => {
  render(
    <ValidationRulesCell
      extraFields={[extraField]}
      extractionFields={[extractionField]}
      fieldCode={mockExtractionFieldCode}
      validationRules={
        [
          mockValidatorRule,
          mockCrossFieldValidator,
        ]
      }
    />,
  )
  const [validatorRule] = screen.getAllByTestId('dropdown-overlay')
  const fieldName = within(validatorRule).getByTestId('tag')

  expect(within(validatorRule).getByText(mockValidatorRule.name)).toBeInTheDocument()
  expect(within(validatorRule).getByText(RESOURCE_VALIDATION_RULE_SEVERITY[mockValidatorRule.severity])).toBeInTheDocument()
  expect(within(validatorRule).getByText(mockValidatorRule.issueMessage)).toBeInTheDocument()
  expect(fieldName).toHaveTextContent(extractionField.name)
})

test('shows details correctly for cross field validator rule', () => {
  const expectedErrorMessage = `${extractionField.name} should be equal ${extraField.name}`

  render(
    <ValidationRulesCell
      extraFields={[extraField]}
      extractionFields={[extractionField]}
      fieldCode={mockExtractionFieldCode}
      validationRules={
        [
          mockValidatorRule,
          mockCrossFieldValidator,
        ]
      }
    />,
  )

  const [, crossFieldRule] = screen.getAllByTestId('dropdown-overlay')
  const [fieldName1, fieldName2] = within(crossFieldRule).getAllByTestId('tag')

  expect(within(crossFieldRule).getByText(mockCrossFieldValidator.name)).toBeInTheDocument()
  expect(within(crossFieldRule).getByText(RESOURCE_VALIDATION_RULE_SEVERITY[mockCrossFieldValidator.severity])).toBeInTheDocument()
  expect(within(crossFieldRule).getByText(expectedErrorMessage)).toBeInTheDocument()
  expect(fieldName1).toHaveTextContent(extractionField.name)
  expect(fieldName2).toHaveTextContent(extraField.name)
})

test('calls hook useDeleteValidationRuleAction', async () => {
  render(
    <ValidationRulesCell
      extraFields={[extraField]}
      extractionFields={[extractionField]}
      fieldCode={mockExtractionFieldCode}
      validationRules={[mockCrossFieldValidator]}
    />,
  )

  expect(useDeleteValidationRuleAction).toHaveBeenCalled()
})

test('calls delete action with correct arguments on close button click for single validator rule', async () => {
  jest.clearAllMocks()

  render(
    <ValidationRulesCell
      extraFields={[extraField]}
      extractionFields={[extractionField]}
      fieldCode={mockExtractionFieldCode}
      validationRules={[mockValidatorRule]}
    />,
  )

  const closeButton = screen.getByTestId('close-button')
  await userEvent.click(closeButton)

  expect(mockHookData.confirmAndDeleteValidationRule).nthCalledWith(1, {
    fieldNames: [extractionField.name],
    ruleName: mockValidatorRule.name,
    validatorCategory: ValidatorCategory.VALIDATOR,
    validatorId: extractionField.code,
  })
})

test('calls delete action with correct arguments on close button click for cross field validator rule', async () => {
  jest.clearAllMocks()

  render(
    <ValidationRulesCell
      extraFields={[extraField]}
      extractionFields={[extractionField]}
      fieldCode={mockExtractionFieldCode}
      validationRules={[mockCrossFieldValidator]}
    />,
  )

  const closeButton = screen.getByTestId('close-button')
  await userEvent.click(closeButton)

  expect(mockHookData.confirmAndDeleteValidationRule).nthCalledWith(1, {
    fieldNames: [extractionField.name, extraField.name],
    ruleName: mockCrossFieldValidator.name,
    validatorCategory: ValidatorCategory.CROSS_FIELD_VALIDATOR,
    validatorId: mockCrossFieldValidator.id,
  })
})
