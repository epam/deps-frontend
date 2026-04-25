
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY } from '@/constants/navigation'
import { useQueryParams } from '@/hooks/useQueryParams'
import { render } from '@/utils/rendererRTL'
import { FilePromptCalibrationStudio } from './FilePromptCalibrationStudioGuard'

const mockSetQueryParams = jest.fn()

jest.mock('@/utils/env', () => mockEnv)
jest.mock('./NotConfiguredStateModal', () => mockShallowComponent('NotConfiguredStateModal'))
jest.mock('./FilePromptCalibrationStudioModal', () => mockShallowComponent('FilePromptCalibrationStudioModal'))

jest.mock('@/hooks/useQueryParams', () => ({
  useQueryParams: jest.fn(() => ({
    queryParams: {},
    setQueryParams: mockSetQueryParams,
  })),
}))

beforeEach(() => {
  jest.clearAllMocks()

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
})

test('renders nothing when query param is not set', () => {
  render(<FilePromptCalibrationStudio />)

  expect(screen.queryByTestId('FilePromptCalibrationStudioModal')).not.toBeInTheDocument()
  expect(screen.queryByTestId('NotConfiguredStateModal')).not.toBeInTheDocument()
})

test('renders nothing when feature flag is disabled', () => {
  mockEnv.ENV = {
    ...mockEnv.ENV,
    FEATURE_PROMPT_CALIBRATION_STUDIO: false,
  }

  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<FilePromptCalibrationStudio />)

  expect(screen.queryByTestId('FilePromptCalibrationStudioModal')).not.toBeInTheDocument()
  expect(screen.queryByTestId('NotConfiguredStateModal')).not.toBeInTheDocument()
})

test('renders NotConfiguredStateModal when studio is not configured', () => {
  mockEnv.ENV = {
    ...mockEnv.ENV,
    FEATURE_PROMPT_CALIBRATION_STUDIO_MODEL: null,
  }

  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<FilePromptCalibrationStudio />)

  expect(screen.getByTestId('NotConfiguredStateModal')).toBeInTheDocument()
  expect(screen.queryByTestId('FilePromptCalibrationStudioModal')).not.toBeInTheDocument()
})

test('renders FilePromptCalibrationStudioModal when query param is set and studio is configured', () => {
  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<FilePromptCalibrationStudio />)

  expect(screen.getByTestId('FilePromptCalibrationStudioModal')).toBeInTheDocument()
  expect(screen.queryByTestId('NotConfiguredStateModal')).not.toBeInTheDocument()
})

test('renders NotConfiguredStateModal when temperature is null', () => {
  mockEnv.ENV = {
    ...mockEnv.ENV,
    FEATURE_PROMPT_CALIBRATION_STUDIO_TEMPERATURE: null,
  }

  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<FilePromptCalibrationStudio />)

  expect(screen.getByTestId('NotConfiguredStateModal')).toBeInTheDocument()
})

test('renders NotConfiguredStateModal when topP is null', () => {
  mockEnv.ENV = {
    ...mockEnv.ENV,
    FEATURE_PROMPT_CALIBRATION_STUDIO_TOP_P: null,
  }

  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<FilePromptCalibrationStudio />)

  expect(screen.getByTestId('NotConfiguredStateModal')).toBeInTheDocument()
})

test('renders NotConfiguredStateModal when groupingFactor is null', () => {
  mockEnv.ENV = {
    ...mockEnv.ENV,
    FEATURE_PROMPT_CALIBRATION_STUDIO_GROUPING_FACTOR: null,
  }

  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<FilePromptCalibrationStudio />)

  expect(screen.getByTestId('NotConfiguredStateModal')).toBeInTheDocument()
})
