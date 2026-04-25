
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { FIELD_FORM_CODE } from '@/containers/ManageBatch/constants'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { AddBatchForm } from './AddBatchForm'

jest.mock('@/components/Form', () => ({
  ...jest.requireActual('@/components/Form'),
  FormItem: (props) => (
    <div data-testid={`form-item-${props.field?.code}`}>
      {props.label}
      Form Item
    </div>
  ),
}))

jest.mock('@/utils/env', () => mockEnv)

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders batch name field when form is rendered', () => {
  render(<AddBatchForm />)

  const batchNameField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.BATCH_NAME}`)
  expect(batchNameField).toBeInTheDocument()
  expect(batchNameField).toHaveTextContent(localize(Localization.NAME))
})

test('renders document type field when form is rendered', () => {
  render(<AddBatchForm />)

  const documentTypeField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.DOCUMENT_TYPE}`)
  expect(documentTypeField).toBeInTheDocument()
  expect(documentTypeField).toHaveTextContent(localize(Localization.DOCUMENT_TYPE))
})

test('renders engine field when form is rendered', () => {
  render(<AddBatchForm />)

  const engineField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.ENGINE}`)
  expect(engineField).toBeInTheDocument()
  expect(engineField).toHaveTextContent(localize(Localization.ENGINE))
})

test('renders parsing features field when form is rendered', () => {
  render(<AddBatchForm />)

  const parsingFeaturesField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.PARSING_FEATURES}`)
  expect(parsingFeaturesField).toBeInTheDocument()
  expect(parsingFeaturesField).toHaveTextContent(localize(Localization.PARSING_FEATURES))
})

test('renders files upload field when form is rendered', () => {
  render(<AddBatchForm />)

  const filesField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.FILES}`)
  expect(filesField).toBeInTheDocument()
})

test('renders group field when FEATURE_DOCUMENT_TYPES_GROUPS is true', () => {
  render(<AddBatchForm />)

  const groupField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.GROUP}`)
  expect(groupField).toBeInTheDocument()
  expect(groupField).toHaveTextContent(localize(Localization.GROUP))
})

test('does not render group field when FEATURE_DOCUMENT_TYPES_GROUPS is false', () => {
  mockEnv.ENV.FEATURE_DOCUMENT_TYPES_GROUPS = false
  render(<AddBatchForm />)

  const groupField = screen.queryByTestId(`form-item-${FIELD_FORM_CODE.GROUP}`)
  expect(groupField).not.toBeInTheDocument()

  mockEnv.ENV.FEATURE_DOCUMENT_TYPES_GROUPS = true
})

test('renders LLM type field when FEATURE_LLM_DATA_EXTRACTION is true', () => {
  render(<AddBatchForm />)

  const llmTypeField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.LLM_TYPE}`)
  expect(llmTypeField).toBeInTheDocument()
  expect(llmTypeField).toHaveTextContent(localize(Localization.LLM_TYPE))
})

test('does not render LLM type field when FEATURE_LLM_DATA_EXTRACTION is false', () => {
  mockEnv.ENV.FEATURE_LLM_DATA_EXTRACTION = false
  render(<AddBatchForm />)

  const llmTypeField = screen.queryByTestId(`form-item-${FIELD_FORM_CODE.LLM_TYPE}`)
  expect(llmTypeField).not.toBeInTheDocument()

  mockEnv.ENV.FEATURE_LLM_DATA_EXTRACTION = true
})
