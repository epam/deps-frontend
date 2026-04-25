
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { UploadConfirmationButton } from './UploadConfirmationButton'

jest.mock('@/utils/env', () => mockEnv)

test('renders upload confirmation button correctly', () => {
  const defaultProps = {
    onClick: jest.fn(),
    withConfirm: false,
    onConfirm: jest.fn(),
  }

  render(<UploadConfirmationButton {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.NEXT_STEP) })

  expect(button).toBeInTheDocument()
})

test('calls onClick when clicked and showConfirmation is false', async () => {
  jest.clearAllMocks()

  const defaultProps = {
    onClick: jest.fn(),
    withConfirm: false,
    onConfirm: jest.fn(),
  }

  render(<UploadConfirmationButton {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.NEXT_STEP) })
  await userEvent.click(button)

  expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
})

test('calls onConfirm when clicked and withConfirm is true', async () => {
  const defaultProps = {
    onClick: jest.fn(),
    withConfirm: true,
    onConfirm: jest.fn(),
  }

  render(<UploadConfirmationButton {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.NEXT_STEP) })
  await userEvent.click(button)

  const confirmButton = screen.getByRole('button', { name: localize(Localization.OK) })
  await userEvent.click(confirmButton)

  expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
})
