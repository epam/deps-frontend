
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY } from '@/constants/navigation'
import { useQueryParams } from '@/hooks/useQueryParams'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { NotConfiguredStateModal } from './NotConfiguredStateModal'

const mockSetQueryParams = jest.fn()

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/hooks/useQueryParams', () => ({
  useQueryParams: jest.fn(),
}))

jest.mock('./NotConfiguredState', () => ({
  NotConfiguredState: jest.fn(() => <div data-testid="NotConfiguredState" />),
}))

beforeEach(() => {
  jest.clearAllMocks()

  useQueryParams.mockReturnValue({
    queryParams: {},
    setQueryParams: mockSetQueryParams,
  })
})

test('renders modal when documentPromptCalibrationStudio query param is true', () => {
  useQueryParams.mockReturnValue({
    queryParams: {
      [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: true,
    },
    setQueryParams: mockSetQueryParams,
  })

  render(<NotConfiguredStateModal />)

  expect(screen.getByText(localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO))).toBeInTheDocument()
  expect(screen.getByTestId('NotConfiguredState')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: localize(Localization.CLOSE_STUDIO) })).toBeInTheDocument()
})

test('does not render modal when query params are not set', () => {
  useQueryParams.mockReturnValue({
    queryParams: {},
    setQueryParams: mockSetQueryParams,
  })

  render(<NotConfiguredStateModal />)

  expect(screen.queryByText(localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO))).not.toBeInTheDocument()
  expect(screen.queryByTestId('NotConfiguredState')).not.toBeInTheDocument()
})

test('calls setQueryParams with undefined values when Close Studio button is clicked', async () => {
  useQueryParams.mockReturnValue({
    queryParams: {
      [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: true,
    },
    setQueryParams: mockSetQueryParams,
  })

  render(<NotConfiguredStateModal />)

  const closeButton = screen.getByRole('button', { name: localize(Localization.CLOSE_STUDIO) })
  await userEvent.click(closeButton)

  expect(mockSetQueryParams).nthCalledWith(1, {
    [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: undefined,
  })
})
