
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import { DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY } from '@/constants/navigation'
import { DocumentState } from '@/enums/DocumentState'
import { useQueryParams } from '@/hooks/useQueryParams'
import { Document } from '@/models/Document'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { documentSelector, documentTypeSelector } from '@/selectors/documentReviewPage'
import { render } from '@/utils/rendererRTL'
import { DocumentPromptCalibrationStudio } from './DocumentPromptCalibrationStudioGuard'

const mockSetQueryParams = jest.fn()

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')
jest.mock('react-redux', () => mockReactRedux)
jest.mock('./NotConfiguredStateModal', () => mockShallowComponent('NotConfiguredStateModal'))
jest.mock('./DocumentPromptCalibrationStudioModal', () => mockShallowComponent('DocumentPromptCalibrationStudioModal'))

jest.mock('@/hooks/useQueryParams', () => ({
  useQueryParams: jest.fn(() => ({
    queryParams: {},
    setQueryParams: mockSetQueryParams,
  })),
}))

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()

  documentSelector.mockReturnValue(
    new Document({
      id: 'mock-document-id',
      state: DocumentState.IN_REVIEW,
    }),
  )

  useQueryParams.mockReturnValue({
    queryParams: {},
    setQueryParams: mockSetQueryParams,
  })

  mockEnv.ENV = {
    ...mockEnv.ENV,
    FEATURE_PROMPT_CALIBRATION_STUDIO: true,
    FEATURE_PROMPT_CALIBRATION_STUDIO_MODEL: 'test-model',
    FEATURE_PROMPT_CALIBRATION_STUDIO_TOP_P: 0.9,
    FEATURE_PROMPT_CALIBRATION_STUDIO_TEMPERATURE: 0.7,
    FEATURE_PROMPT_CALIBRATION_STUDIO_GROUPING_FACTOR: 5,
  }

  defaultProps = {}
})

test('renders nothing when query param is not set', () => {
  render(<DocumentPromptCalibrationStudio {...defaultProps} />)

  expect(screen.queryByTestId('DocumentPromptCalibrationStudioModal')).not.toBeInTheDocument()
  expect(screen.queryByTestId('NotConfiguredStateModal')).not.toBeInTheDocument()
})

test('renders nothing when feature flag is disabled', () => {
  mockEnv.ENV = {
    ...mockEnv.ENV,
    FEATURE_PROMPT_CALIBRATION_STUDIO: false,
  }

  useQueryParams.mockReturnValue({
    queryParams: { [DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<DocumentPromptCalibrationStudio {...defaultProps} />)

  expect(screen.queryByTestId('DocumentPromptCalibrationStudioModal')).not.toBeInTheDocument()
  expect(screen.queryByTestId('NotConfiguredStateModal')).not.toBeInTheDocument()
})

test('renders nothing when document is not in IN_REVIEW state', () => {
  documentSelector.mockReturnValue(new Document({
    id: 'mock-document-id',
    state: DocumentState.NEW,
  }))

  useQueryParams.mockReturnValue({
    queryParams: { [DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<DocumentPromptCalibrationStudio {...defaultProps} />)

  expect(screen.queryByTestId('DocumentPromptCalibrationStudioModal')).not.toBeInTheDocument()
  expect(screen.queryByTestId('NotConfiguredStateModal')).not.toBeInTheDocument()
})

test('renders NotConfiguredStateModal when studio is not configured', () => {
  mockEnv.ENV = {
    ...mockEnv.ENV,
    FEATURE_PROMPT_CALIBRATION_STUDIO_MODEL: null,
  }

  useQueryParams.mockReturnValue({
    queryParams: { [DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<DocumentPromptCalibrationStudio {...defaultProps} />)

  expect(screen.getByTestId('NotConfiguredStateModal')).toBeInTheDocument()
  expect(screen.queryByTestId('DocumentPromptCalibrationStudioModal')).not.toBeInTheDocument()
})

test('renders DocumentPromptCalibrationStudioModal when query param is set and studio is configured', () => {
  useQueryParams.mockReturnValue({
    queryParams: { [DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<DocumentPromptCalibrationStudio {...defaultProps} />)

  expect(screen.getByTestId('DocumentPromptCalibrationStudioModal')).toBeInTheDocument()
  expect(screen.queryByTestId('NotConfiguredStateModal')).not.toBeInTheDocument()
})

test('renders NotConfiguredStateModal when temperature is null', () => {
  mockEnv.ENV = {
    ...mockEnv.ENV,
    FEATURE_PROMPT_CALIBRATION_STUDIO_TEMPERATURE: null,
  }

  useQueryParams.mockReturnValue({
    queryParams: { [DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<DocumentPromptCalibrationStudio {...defaultProps} />)

  expect(screen.getByTestId('NotConfiguredStateModal')).toBeInTheDocument()
})

test('renders NotConfiguredStateModal when topP is null', () => {
  mockEnv.ENV = {
    ...mockEnv.ENV,
    FEATURE_PROMPT_CALIBRATION_STUDIO_TOP_P: null,
  }

  useQueryParams.mockReturnValue({
    queryParams: { [DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<DocumentPromptCalibrationStudio {...defaultProps} />)

  expect(screen.getByTestId('NotConfiguredStateModal')).toBeInTheDocument()
})

test('renders NotConfiguredStateModal when groupingFactor is null', () => {
  mockEnv.ENV = {
    ...mockEnv.ENV,
    FEATURE_PROMPT_CALIBRATION_STUDIO_GROUPING_FACTOR: null,
  }

  useQueryParams.mockReturnValue({
    queryParams: { [DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<DocumentPromptCalibrationStudio {...defaultProps} />)

  expect(screen.getByTestId('NotConfiguredStateModal')).toBeInTheDocument()
})

test('renders nothing when documentType is UNKNOWN_DOCUMENT_TYPE', () => {
  documentTypeSelector.mockReturnValue(UNKNOWN_DOCUMENT_TYPE)

  useQueryParams.mockReturnValue({
    queryParams: { [DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<DocumentPromptCalibrationStudio {...defaultProps} />)

  expect(screen.queryByTestId('DocumentPromptCalibrationStudioModal')).not.toBeInTheDocument()
  expect(screen.queryByTestId('NotConfiguredStateModal')).not.toBeInTheDocument()
})
