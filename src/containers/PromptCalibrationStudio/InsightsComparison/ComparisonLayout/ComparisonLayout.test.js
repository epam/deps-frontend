
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ComparisonLayout } from './ComparisonLayout'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/ArrowRightOutlined', () => ({
  ArrowRightOutlined: () => <div data-testid="arrow-right-outlined" />,
}))

jest.mock('@/components/Icons/ExclamationCircleOutlinedIcon', () => ({
  ExclamationCircleOutlinedIcon: () => <div data-testid="exclamation-circle-icon" />,
}))

jest.mock('@/containers/PromptCalibrationStudio/hooks', () => ({
  useFieldCalibration: jest.fn(() => ({
    activeField: {
      query: {
        reasoning: mockReasoning,
      },
    },
  })),
}))

const mockReasoning = 'This value was extracted from the header section'

const defaultProps = {
  hasExecutedValue: true,
  renderOldValue: jest.fn((borderProps) => (
    <div
      data-testid="old-value"
      style={{ borderColor: borderProps.borderColor }}
    >
      Old Value
    </div>
  )),
  renderNewValue: jest.fn((borderProps) => (
    <div
      data-testid="new-value"
      style={{ borderColor: borderProps.borderColor }}
    >
      New Value
    </div>
  )),
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders comparison layout with old and new values when hasExecutedValue is true', () => {
  render(<ComparisonLayout {...defaultProps} />)

  expect(screen.getByTestId('old-value')).toBeInTheDocument()
  expect(screen.getByTestId('new-value')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.OLD))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.NEW))).toBeInTheDocument()
  expect(screen.getByTestId('arrow-right-outlined')).toBeInTheDocument()
})

test('renders only old value without labels when hasExecutedValue is false', () => {
  const props = {
    ...defaultProps,
    hasExecutedValue: false,
  }

  render(<ComparisonLayout {...props} />)

  expect(screen.getByTestId('old-value')).toBeInTheDocument()
  expect(screen.queryByTestId('new-value')).not.toBeInTheDocument()
  expect(screen.queryByText(localize(Localization.OLD))).not.toBeInTheDocument()
  expect(screen.queryByText(localize(Localization.NEW))).not.toBeInTheDocument()
  expect(screen.queryByTestId('arrow-right-outlined')).not.toBeInTheDocument()
  expect(props.renderNewValue).not.toHaveBeenCalled()
})

test('calls renderOldValue with grey border props', () => {
  jest.clearAllMocks()

  render(<ComparisonLayout {...defaultProps} />)

  expect(defaultProps.renderOldValue).toHaveBeenCalledWith(
    expect.objectContaining({
      borderColor: expect.any(String),
    }),
  )
})

test('calls renderNewValue with success border props when hasExecutedValue is true', () => {
  jest.clearAllMocks()

  render(<ComparisonLayout {...defaultProps} />)

  expect(defaultProps.renderNewValue).toHaveBeenCalledWith(
    expect.objectContaining({
      borderColor: expect.any(String),
    }),
  )
})

test('renders tooltip with reasoning when reasoning prop is provided', async () => {
  const props = {
    ...defaultProps,
    reasoning: mockReasoning,
  }

  render(<ComparisonLayout {...props} />)

  const exclamationIcon = screen.getByTestId('exclamation-circle-icon')
  await userEvent.hover(exclamationIcon)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(props.reasoning)
  })
})

test('does not render icon with tooltip when reasoning prop is not provided', () => {
  useFieldCalibration.mockReturnValueOnce({
    activeField: {
      query: {
        reasoning: null,
      },
    },
  })

  render(<ComparisonLayout {...defaultProps} />)

  const exclamationIcon = screen.queryByTestId('exclamation-circle-icon')

  expect(exclamationIcon).not.toBeInTheDocument()
})
