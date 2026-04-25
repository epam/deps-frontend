
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { ExtractionType } from '@/enums/ExtractionType'
import { FieldType } from '@/enums/FieldType'
import { ValidationRuleSeverity } from '@/enums/ValidationRuleSeverity'
import { ValidatorsFieldType } from '@/enums/ValidatorsFieldType'
import { Localization, localize } from '@/localization/i18n'
import { CrossFieldValidator, IssueMessage } from '@/models/CrossFieldValidator'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import { Validator, ValidatorRule, ValidatorType } from '@/models/Validator'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { isDocumentTypeFetchingSelector } from '@/selectors/requests'
import { render } from '@/utils/rendererRTL'
import { DocumentTypeBusinessRulesList } from './DocumentTypeBusinessRulesList'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentType')
jest.mock('@/selectors/requests')
jest.mock('@/containers/AddBusinessRule', () => ({
  AddBusinessRule: () => (
    <div data-testid="add-business-rule-action" />
  ),
}))
jest.mock('./ValidatorCard', () => ({
  ValidatorCard: jest.fn((props) => {
    const { name, message, severity, fieldsTags = [] } = props
    return (
      <div>
        <span>{name}</span>
        <span>{message}</span>
        <span>{severity}</span>
        {fieldsTags.map((t, i) => <span key={i}>{t.text}</span>)}
      </div>
    )
  }),
}))

const mockField1 = new DocumentTypeField(
  'f1',
  'Insurance Date',
  {},
  FieldType.STRING,
)
const mockField2 = new DocumentTypeField(
  'f2',
  'Payment',
  {},
  FieldType.STRING,
)
const mockField3 = new DocumentTypeField(
  'f3',
  'Contract Number',
  {},
  FieldType.STRING,
)

const mockCrossFieldValidators = [
  new CrossFieldValidator({
    id: 'v1',
    name: 'Some Name',
    issueMessage: new IssueMessage({
      // eslint-disable-next-line no-template-curly-in-string
      message: 'Please check ${f1} and ${f2}',
      dependentFields: [mockField1.code, mockField2.code],
    }),
    rule: 'rule1',
    severity: ValidationRuleSeverity.WARNING,
    validatedFields: [mockField1.code, mockField2.code],
  }),
  new CrossFieldValidator({
    id: 'v2',
    name: 'Rule Name',
    issueMessage: new IssueMessage({
      // eslint-disable-next-line no-template-curly-in-string
      message: 'Error in ${f3}',
      dependentFields: [],
    }),
    rule: 'rule2',
    severity: ValidationRuleSeverity.ERROR,
    validatedFields: [mockField3.code],
  }),
]

const mockDocumentType = new ExtendedDocumentType({
  code: 'DocType1',
  name: 'Doc Type 1',
  extractionType: ExtractionType.TEMPLATE,
  fields: [mockField1, mockField2, mockField3],
  extraFields: [],
  crossFieldValidators: mockCrossFieldValidators,
  validators: [],
})

beforeEach(() => {
  jest.clearAllMocks()
  isDocumentTypeFetchingSelector.mockReturnValue(false)
})

test('shows spinner when loading', () => {
  isDocumentTypeFetchingSelector.mockReturnValue(true)

  render(<DocumentTypeBusinessRulesList />)

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('shows empty state when there are no business rules', () => {
  documentTypeStateSelector.mockReturnValue({
    ...mockDocumentType,
    fields: [],
    validators: [],
    crossFieldValidators: [],
  })

  render(<DocumentTypeBusinessRulesList />)

  expect(screen.getByText(localize(Localization.BUSINESS_RULES_WERE_NOT_FOUND))).toBeInTheDocument()
})

test('shows total and renders all business rule cards', () => {
  documentTypeStateSelector.mockReturnValue(mockDocumentType)

  render(<DocumentTypeBusinessRulesList />)

  expect(screen.getByText(localize(Localization.TOTAL_NUMBER))).toHaveTextContent(mockCrossFieldValidators.length)
  mockCrossFieldValidators.forEach((v) => {
    expect(screen.getByText(v.name)).toBeInTheDocument()
  })
})

test('renders cross-field validators with replaced field names', () => {
  documentTypeStateSelector.mockReturnValueOnce(mockDocumentType)

  render(<DocumentTypeBusinessRulesList />)

  expect(screen.getByText(`Please check ${mockField1.name} and ${mockField2.name}`)).toBeInTheDocument()
  expect(screen.getByText(`Error in ${mockField3.name}`)).toBeInTheDocument()
  expect(screen.getByText(mockField1.name)).toBeInTheDocument()
  expect(screen.getByText(mockField2.name)).toBeInTheDocument()
  expect(screen.getByText(mockField3.name)).toBeInTheDocument()
})

test('renders single-field validator cards and sums total', () => {
  const mockSingleFieldValidatorRule = new ValidatorRule({
    name: 'Min Length',
    severity: ValidationRuleSeverity.WARNING,
    rule: 'min',
    issueMessage: 'Too short',
    needWarningEvenIfOptional: false,
    forEach: false,
    forAny: false,
    checkOptionalFields: false,
  })

  const mockSingleFieldValidators = [
    new Validator({
      code: mockField1.code,
      isRequired: true,
      type: new ValidatorType({
        description: { itemType: ValidatorsFieldType.STRING },
        type: ValidatorsFieldType.STRING,
      }),
      rules: [mockSingleFieldValidatorRule],
    }),
  ]

  documentTypeStateSelector.mockReturnValue(
    new ExtendedDocumentType({
      ...mockDocumentType,
      crossFieldValidators: [],
      validators: mockSingleFieldValidators,
    }))

  render(<DocumentTypeBusinessRulesList />)

  expect(screen.getByText(localize(Localization.TOTAL_NUMBER))).toHaveTextContent(1)
  expect(screen.getByText(mockSingleFieldValidatorRule.name)).toBeInTheDocument()
  expect(screen.getByText(mockSingleFieldValidatorRule.issueMessage)).toBeInTheDocument()
  expect(screen.getByText(mockField1.name)).toBeInTheDocument()
})

test('renders add business rule action within the info panel', () => {
  render(<DocumentTypeBusinessRulesList />)

  expect(screen.getByTestId('add-business-rule-action')).toBeInTheDocument()
})
