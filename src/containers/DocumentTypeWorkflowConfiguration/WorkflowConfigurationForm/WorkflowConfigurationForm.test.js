
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import { WORKFLOW_FORM_FIELD_CODES } from '@/containers/DocumentTypeWorkflowConfiguration/constants'
import { ReviewPolicy } from '@/enums/ReviewPolicy'
import { Localization, localize } from '@/localization/i18n'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import { WorkflowConfiguration } from '@/models/WorkflowConfiguration'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { render } from '@/utils/rendererRTL'
import { WorkflowConfigurationForm } from './WorkflowConfigurationForm'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentType')

jest.mock('react-hook-form', () => mockReactHookForm)

jest.mock('@/components/Form/ReactHookForm', () => ({
  ...jest.requireActual('@/components/Form/ReactHookForm'),
  Form: ({ children }) => <form data-testid="form">{children}</form>,
  FormItem: (props) => (
    <div data-testid={`form-item-${props.field?.code}`}>
      {props.label}
      {props.field?.hint && <span data-testid={`hint-${props.field?.code}`}>{props.field.hint}</span>}
      Form Item
    </div>
  ),
}))

const mockDocumentType = new ExtendedDocumentType({
  code: 'test-doc-type',
  name: 'Test Document Type',
  workflowConfiguration: new WorkflowConfiguration({
    needsExtraction: true,
    needsReview: ReviewPolicy.ALWAYS_REVIEW,
    needsValidation: false,
  }),
})

beforeEach(() => {
  jest.clearAllMocks()
  documentTypeStateSelector.mockReturnValue(mockDocumentType)
})

const defaultProps = {
  onSubmit: jest.fn(),
  handleSubmit: jest.fn(),
}

test('renders form element', () => {
  render(<WorkflowConfigurationForm {...defaultProps} />)

  expect(screen.getByTestId('form')).toBeInTheDocument()
})

test('renders needs review field with hint', () => {
  render(<WorkflowConfigurationForm {...defaultProps} />)

  const field = screen.getByTestId(`form-item-${WORKFLOW_FORM_FIELD_CODES.NEEDS_REVIEW}`)
  expect(field).toBeInTheDocument()
  expect(field).toHaveTextContent(localize(Localization.WORKFLOW_REVIEW_POLICY))

  const hint = screen.getByTestId(`hint-${WORKFLOW_FORM_FIELD_CODES.NEEDS_REVIEW}`)
  expect(hint).toHaveTextContent(localize(Localization.WORKFLOW_REVIEW_POLICY_HINT))
})

test('renders needs extraction field with hint', () => {
  render(<WorkflowConfigurationForm {...defaultProps} />)

  const field = screen.getByTestId(`form-item-${WORKFLOW_FORM_FIELD_CODES.NEEDS_EXTRACTION}`)
  expect(field).toBeInTheDocument()
  expect(field).toHaveTextContent(localize(Localization.WORKFLOW_NEEDS_EXTRACTION))

  const hint = screen.getByTestId(`hint-${WORKFLOW_FORM_FIELD_CODES.NEEDS_EXTRACTION}`)
  expect(hint).toHaveTextContent(localize(Localization.WORKFLOW_NEEDS_EXTRACTION_HINT))
})

test('renders needs validation field with hint', () => {
  render(<WorkflowConfigurationForm {...defaultProps} />)

  const field = screen.getByTestId(`form-item-${WORKFLOW_FORM_FIELD_CODES.NEEDS_VALIDATION}`)
  expect(field).toBeInTheDocument()
  expect(field).toHaveTextContent(localize(Localization.WORKFLOW_NEEDS_VALIDATION))

  const hint = screen.getByTestId(`hint-${WORKFLOW_FORM_FIELD_CODES.NEEDS_VALIDATION}`)
  expect(hint).toHaveTextContent(localize(Localization.WORKFLOW_NEEDS_VALIDATION_HINT))
})
