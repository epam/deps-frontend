
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { EmptyPromptState } from './EmptyPromptState'

jest.mock('@/utils/env', () => mockEnv)

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()

  defaultProps = {
    onClick: jest.fn(),
  }
})

test('renders empty state text', () => {
  render(<EmptyPromptState {...defaultProps} />)

  const emptyStateText = screen.getByText(localize(Localization.NO_ITEMS_MESSAGE))

  expect(emptyStateText).toBeInTheDocument()
})

test('renders add prompt button', () => {
  render(<EmptyPromptState {...defaultProps} />)

  const addPromptButton = screen.getByRole('button', {
    name: new RegExp(localize(Localization.ADD_PROMPT)),
  })

  expect(addPromptButton).toBeInTheDocument()
})

test('calls onClick when button is clicked', async () => {
  const user = userEvent.setup()
  render(<EmptyPromptState {...defaultProps} />)

  const addPromptButton = screen.getByRole('button', {
    name: new RegExp(localize(Localization.ADD_PROMPT)),
  })

  await user.click(addPromptButton)

  expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
})
