
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ParsingFeaturesSwitch } from './ParsingFeaturesSwitch'

jest.mock('@/utils/env', () => mockEnv)

const mockOnChange = jest.fn()
let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    onChange: mockOnChange,
    value: [KnownParsingFeature.TEXT],
  }
})

test('renders switches with correct labels', () => {
  render(<ParsingFeaturesSwitch {...defaultProps} />)

  expect(screen.getByText(localize(Localization.TEXT))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.IMAGES))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.KEY_VALUE_PAIRS))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.TABLES))).toBeInTheDocument()
})

test('calls onChange with updated features when toggling on', async () => {
  const user = userEvent.setup()
  render(<ParsingFeaturesSwitch {...defaultProps} />)

  const imagesSwitch = screen.getByText(localize(Localization.IMAGES))
  await user.click(imagesSwitch)

  expect(mockOnChange).toHaveBeenCalledWith([
    KnownParsingFeature.TEXT,
    KnownParsingFeature.IMAGES,
  ])
})

test('calls onChange with updated features when toggling off', async () => {
  const user = userEvent.setup()
  render(<ParsingFeaturesSwitch {...defaultProps} />)

  const textSwitch = screen.getByText(localize(Localization.TEXT))
  await user.click(textSwitch)

  expect(mockOnChange).toHaveBeenCalledWith([])
})
