
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import { fetchOCREngines } from '@/actions/engines'
import { FIELD_FORM_CODE } from '@/containers/UploadSplittingFilesDrawer/constants'
import { Localization, localize } from '@/localization/i18n'
import { ocrEnginesSelector } from '@/selectors/engines'
import { ENV } from '@/utils/env'
import { render } from '@/utils/rendererRTL'
import { BatchSettingsForm } from './BatchSettingsForm'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/requests')
jest.mock('@/selectors/engines')

jest.mock('@/components/Form', () => ({
  ...jest.requireActual('@/components/Form'),
  FormItem: (props) => (
    <div
      key={props.field?.code}
      data-testid={`form-item-${props.field?.code}`}
    >
      {props.label}
      Form Item
    </div>
  ),
}))

jest.mock('react-hook-form', () => mockReactHookForm)

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/actions/engines', () => ({
  fetchOCREngines: jest.fn(),
}))

const mockDispatch = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders automatic splitting field when form is rendered', () => {
  render(<BatchSettingsForm />)

  const automaticSplitting = screen.getByTestId(`form-item-${FIELD_FORM_CODE.AUTOMATIC_SPLITTING}`)
  expect(automaticSplitting).toBeInTheDocument()
  expect(automaticSplitting).toHaveTextContent(localize(Localization.AUTOMATIC_SPLITTING))
})

test('renders group select field when form is rendered', () => {
  render(<BatchSettingsForm />)

  const groupField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.GROUP}`)
  expect(groupField).toBeInTheDocument()
  expect(groupField).toHaveTextContent(localize(Localization.GROUP))
})

test('do not render group select field if FEATURE_DOCUMENT_TYPES_GROUPS is false', () => {
  ENV.FEATURE_DOCUMENT_TYPES_GROUPS = false
  render(<BatchSettingsForm />)

  const groupField = screen.queryByTestId(`form-item-${FIELD_FORM_CODE.GROUP}`)
  expect(groupField).not.toBeInTheDocument()

  ENV.FEATURE_DOCUMENT_TYPES_GROUPS = true
})

test('renders batch type switcher field when form is rendered', () => {
  render(<BatchSettingsForm />)

  const batchTypeSwitcherField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.BATCH_TYPE}`)
  expect(batchTypeSwitcherField).toBeInTheDocument()
  expect(batchTypeSwitcherField).toHaveTextContent(localize(Localization.BATCH_TYPE))
})

test('do not render llm type select field if FEATURE_LLM_DATA_EXTRACTION is false', () => {
  ENV.FEATURE_LLM_DATA_EXTRACTION = false
  render(<BatchSettingsForm />)

  const llmField = screen.queryByTestId(`form-item-${FIELD_FORM_CODE.LLM_TYPE}`)
  expect(llmField).not.toBeInTheDocument()

  ENV.FEATURE_LLM_DATA_EXTRACTION = true
})

test('renders engine select field when form is rendered', () => {
  render(<BatchSettingsForm />)

  const engineField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.ENGINE}`)
  expect(engineField).toBeInTheDocument()
  expect(engineField).toHaveTextContent(localize(Localization.ENGINE))
})

test('renders parsing features field when form is rendered', () => {
  render(<BatchSettingsForm />)

  const parsingFeaturesField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.PARSING_FEATURES}`)
  expect(parsingFeaturesField).toBeInTheDocument()
  expect(parsingFeaturesField).toHaveTextContent(localize(Localization.PARSING_FEATURES))
})

test('renders batch name field when form is rendered', () => {
  render(<BatchSettingsForm />)

  const batchNameField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.BATCH_NAME}`)
  expect(batchNameField).toBeInTheDocument()
  expect(batchNameField).toHaveTextContent(localize(Localization.BATCH_NAME))
})

test('calls fetchOCREngines when form is rendered if engines are empty', () => {
  ocrEnginesSelector.mockReturnValueOnce([])

  render(<BatchSettingsForm />)

  expect(mockDispatch).toHaveBeenCalledWith(fetchOCREngines())
})
