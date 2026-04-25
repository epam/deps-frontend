
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import { FieldType } from '@/enums/FieldType'
import { ValidationRuleSeverity } from '@/enums/ValidationRuleSeverity'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta, TableFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import {
  LLMExtractor,
  LLMExtractionParams,
  LLMReference,
} from '@/models/LLMExtractor'
import { Validator, ValidatorRule, ValidatorType } from '@/models/Validator'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { ENV } from '@/utils/env'
import { render } from '@/utils/rendererRTL'
import { DocumentTypeFieldsList } from './DocumentTypeFieldsList'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentType')
jest.mock('@/selectors/requests')

const reorderFieldsButtonTestId = 'reorder-fields-button'
const addFieldButtonTestId = 'add-field-button'
const moreFieldsActionsTestId = 'more-fields-actions'

jest.mock('@/containers/ReorderDocumentTypeFieldsButton', () => ({
  ReorderDocumentTypeFieldsButton: () => <div data-testid={reorderFieldsButtonTestId} />,
}))
jest.mock('@/containers/AddDocumentTypeFieldModalButton', () => ({
  AddDocumentTypeFieldModalButton: () => <div data-testid={addFieldButtonTestId} />,
}))
jest.mock('./MoreFieldsActions', () => ({
  MoreFieldsActions: () => <div data-testid={moreFieldsActionsTestId} />,
}))

const mockExtraFields = [
  new DocumentTypeExtraField({
    code: 'mockExtraFieldCode1',
    name: 'mockExtraFieldName1',
    order: 0,
  }),
  new DocumentTypeExtraField({
    code: 'mockExtraFieldCode2',
    name: 'mockExtraFieldName2',
    order: 1,
  }),
]

const mockRules = [
  new ValidatorRule({
    name: 'rule',
    severity: ValidationRuleSeverity.ERROR,
    rule: 'rule',
    needWarningEvenIfOptional: false,
    forEach: true,
    forAny: true,
    checkOptionalFields: false,
  }),
]

const mockValidatorType = new ValidatorType({
  description: {
    maxLength: 1000,
  },
  type: FieldType.STRING,
})

const mockValidators = [
  new Validator({
    code: 'validator',
    isRequired: false,
    rules: mockRules,
    type: mockValidatorType,
  }),
]

const mockLLMExtractor = new LLMExtractor({
  extractorId: 'extractorId',
  name: 'LLM Extractor Name',
  extractionParams: new LLMExtractionParams({
    customInstruction: 'Test Instructions',
    groupingFactor: 1,
    temperature: 0.5,
    topP: 0.3,
  }),
  llmReference: new LLMReference({
    model: 'mockModel',
    provider: 'mockProvider',
  }),
  queries: [],
})

const mockDocumentType = new ExtendedDocumentType({
  code: 'mockDocumentTypeCode',
  name: 'mockDocumentTypeName',
  fields: [
    new DocumentTypeField(
      'docTypeCode1',
      'docTypeName1',
      new DocumentTypeFieldMeta('BC', 'A'),
      FieldType.STRING,
      false,
      2,
      'mockDocumentTypeCode1',
      2,
    ),
    new DocumentTypeField(
      'docTypeCode2',
      'docTypeName2',
      new TableFieldMeta([]),
      FieldType.TABLE,
      false,
      3,
      'mockDocumentTypeCode2',
      3,
    ),
  ],
  extraFields: mockExtraFields,
  llmExtractors: [mockLLMExtractor],
  validators: mockValidators,
})

const totalFieldsLength = mockDocumentType.fields.length + mockExtraFields.length

const originalFeatureFlags = { ...mockEnv.ENV }

afterEach(() => {
  Object.assign(mockEnv.ENV, originalFeatureFlags)
})

beforeAll(() => {
  documentTypeStateSelector.mockReturnValue(mockDocumentType)
})

test('shows document type info panel', async () => {
  render(<DocumentTypeFieldsList />)

  const totalFieldsLabel = screen.getByText(localize(Localization.TOTAL_NUMBER))
  const totalFieldsNumber = screen.getByText(totalFieldsLength)
  const addFieldButton = screen.getByTestId(addFieldButtonTestId)
  const reorderFieldsButton = screen.getByTestId(reorderFieldsButtonTestId)
  const moreFieldsActions = screen.getByTestId(moreFieldsActionsTestId)

  await waitFor(() => {
    expect(totalFieldsLabel).toBeInTheDocument()
  })
  expect(totalFieldsNumber).toBeInTheDocument()
  expect(addFieldButton).toBeInTheDocument()
  expect(reorderFieldsButton).toBeInTheDocument()
  expect(moreFieldsActions).toBeInTheDocument()
})

test('shows correct document type all fields table', async () => {
  render(<DocumentTypeFieldsList />)

  const columns = screen.getAllByRole('columnheader')
  const [
    fieldNameColumn,
    fieldCategoryColumn,
    fieldTypeColumn,
    fieldLLMExtractorColumn,
    fieldValidationRulesColumn,
    fieldPromptChainColumn,
    fieldDisplayModeColumn,
  ] = columns

  await waitFor(() => {
    expect(columns).toHaveLength(8)
  })

  expect(fieldNameColumn).toHaveTextContent(localize(Localization.NAME))
  expect(fieldCategoryColumn).toHaveTextContent(localize(Localization.CATEGORY))
  expect(fieldTypeColumn).toHaveTextContent(localize(Localization.FIELD_TYPE))
  expect(fieldLLMExtractorColumn).toHaveTextContent(localize(Localization.LLM_EXTRACTOR))
  expect(fieldValidationRulesColumn).toHaveTextContent(localize(Localization.BUSINESS_RULES))
  expect(fieldPromptChainColumn).toHaveTextContent(localize(Localization.PROMPTS))
  expect(fieldDisplayModeColumn).toHaveTextContent(localize(Localization.DISPLAY_MODE))

  mockDocumentType.fields.forEach((f) => {
    expect(screen.getByText(f.name)).toBeInTheDocument()
  })
})

test('does not show LLM Extractor column if feature flag FEATURE_LLM_EXTRACTORS is false', async () => {
  ENV.FEATURE_LLM_EXTRACTORS = false

  render(<DocumentTypeFieldsList />)

  await waitFor(() => {
    expect(screen.queryByText(localize(Localization.LLM_EXTRACTOR))).not.toBeInTheDocument()
  })
})

test('does not show Display Mode column if feature flag FEATURE_FIELDS_DISPLAY_MODE is false', async () => {
  ENV.FEATURE_FIELDS_DISPLAY_MODE = false

  render(<DocumentTypeFieldsList />)

  await waitFor(() => {
    expect(screen.queryByText(localize(Localization.DISPLAY_MODE))).not.toBeInTheDocument()
  })
})

test('does not show Prompt Value column if feature flag FEATURE_LLM_DATA_EXTRACTION is false', async () => {
  ENV.FEATURE_LLM_EXTRACTORS = false

  render(<DocumentTypeFieldsList />)

  await waitFor(() => {
    expect(screen.queryByText(localize(Localization.PROMPTS))).not.toBeInTheDocument()
  })
})

test('does not show Business Rules column if feature flag FEATURE_VALIDATION_BUSINESS_RULES is false', async () => {
  ENV.FEATURE_VALIDATION_BUSINESS_RULES = false

  render(<DocumentTypeFieldsList />)

  await waitFor(() => {
    expect(screen.queryByText(localize(Localization.BUSINESS_RULES))).not.toBeInTheDocument()
  })
})
