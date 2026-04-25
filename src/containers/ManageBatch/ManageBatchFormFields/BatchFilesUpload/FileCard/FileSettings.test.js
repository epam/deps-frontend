
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import { KnownParsingFeature, KnownParsingFeature as MockKnownParsingFeature } from '@/enums/KnownParsingFeature'
import { render } from '@/utils/rendererRTL'
import { FileSettings } from './FileSettings'

const LLM_TEST_ID = 'llm-select'
const DOC_TYPE_SELECT = 'doc-type-select'
const ENGINE_SELECT = 'engine-select'
const PARSING_FEATURES_SWITCH = 'parsing-features-switch'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => mockReactHookForm)
jest.mock('@/selectors/documentTypesListPage')

jest.mock('@/containers/ExtractionLLMSelect', () => ({
  ExtractionLLMSelect: () => <div data-testid={LLM_TEST_ID} />,
}))

jest.mock('@/containers/ManageBatch/ManageBatchFormFields/DocTypeSelect', () => ({
  DocTypeSelect: ({ innerRef, ...props }) => (
    <div
      ref={innerRef}
      data-testid={DOC_TYPE_SELECT}
      {...props}
    />
  ),
}))

jest.mock('@/containers/ManageBatch/ManageBatchFormFields/EngineSelect', () => ({
  EngineSelect: () => <div data-testid={ENGINE_SELECT} />,
}))

jest.mock('@/containers/ParsingFeaturesSwitch', () => ({
  ParsingFeaturesSwitch: ({ onChange, value }) => (
    <div
      data-default-value={JSON.stringify(value)}
      data-testid={PARSING_FEATURES_SWITCH}
      onClick={() => onChange([MockKnownParsingFeature.TEXT])}
    />
  ),
}))

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    index: 0,
  }
})

test('renders DocTypeSelect and all fields when LLM feature is enabled', () => {
  mockEnv.ENV.FEATURE_LLM_DATA_EXTRACTION = true
  render(<FileSettings {...defaultProps} />)

  expect(screen.getByTestId(DOC_TYPE_SELECT)).toBeInTheDocument()
  expect(screen.getByTestId(ENGINE_SELECT)).toBeInTheDocument()
  expect(screen.getByTestId(LLM_TEST_ID)).toBeInTheDocument()
  expect(screen.getByTestId(PARSING_FEATURES_SWITCH)).toBeInTheDocument()
})

test('renders DocTypeSelect but not LLM select when LLM feature is disabled', () => {
  mockEnv.ENV.FEATURE_LLM_DATA_EXTRACTION = false
  render(<FileSettings {...defaultProps} />)

  expect(screen.getByTestId(DOC_TYPE_SELECT)).toBeInTheDocument()
  expect(screen.getByTestId(ENGINE_SELECT)).toBeInTheDocument()
  expect(screen.queryByTestId(LLM_TEST_ID)).not.toBeInTheDocument()
  expect(screen.getByTestId(PARSING_FEATURES_SWITCH)).toBeInTheDocument()
})

test('sets TEXT as default switch on for parsing features', () => {
  render(<FileSettings {...defaultProps} />)

  const parsingFeaturesSelect = screen.getByTestId(PARSING_FEATURES_SWITCH)
  expect(parsingFeaturesSelect).toBeInTheDocument()
  expect(parsingFeaturesSelect.getAttribute('data-default-value')).toBe(`["${KnownParsingFeature.TEXT}"]`)
})
