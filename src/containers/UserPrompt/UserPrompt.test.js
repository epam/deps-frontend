
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { TEST_ID } from './constants'
import { UserPrompt } from '.'

jest.mock('@/utils/env', () => mockEnv)

const defaultProps = {
  message: 'test',
  time: '11:12',
  areActionsDisabled: false,
  onEdit: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders correct layout', () => {
  render(<UserPrompt {...defaultProps} />)

  expect(screen.getByText(defaultProps.time)).toBeInTheDocument()
  expect(screen.getByText(defaultProps.message)).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.YOU))).toBeInTheDocument()
})

test('toggles actions visibility on mouse enter and leave', async () => {
  render(<UserPrompt {...defaultProps} />)

  const messageText = screen.getByText(defaultProps.message)
  await userEvent.hover(messageText)
  expect(screen.getByTestId(TEST_ID.EDIT_BUTTON)).toBeInTheDocument()

  await userEvent.unhover(messageText)
  await waitFor(() => {
    expect(screen.queryByTestId(TEST_ID.EDIT_BUTTON)).not.toBeInTheDocument()
  })
})

test('calls onEdit on edit button click', async () => {
  const onEdit = jest.fn()
  render(
    <UserPrompt
      {...defaultProps}
      onEdit={onEdit}
    />,
  )

  const messageText = screen.getByText(defaultProps.message)
  await userEvent.hover(messageText)
  await userEvent.click(screen.getByTestId(TEST_ID.EDIT_BUTTON))

  expect(onEdit).toHaveBeenCalled()
})

test('renders retry button when onRetry is provided', async () => {
  const onRetry = jest.fn()
  render(
    <UserPrompt
      {...defaultProps}
      onRetry={onRetry}
    />,
  )

  const messageText = screen.getByText(defaultProps.message)
  await userEvent.hover(messageText)

  expect(screen.getByTestId(TEST_ID.RETRY_BUTTON)).toBeInTheDocument()
  expect(screen.queryByTestId(TEST_ID.EDIT_BUTTON)).not.toBeInTheDocument()
})

test('calls onRetry on retry button click', async () => {
  const onRetry = jest.fn()
  render(
    <UserPrompt
      {...defaultProps}
      onRetry={onRetry}
    />,
  )

  const messageText = screen.getByText(defaultProps.message)
  await userEvent.hover(messageText)
  await userEvent.click(screen.getByTestId(TEST_ID.RETRY_BUTTON))

  expect(onRetry).toHaveBeenCalled()
})

test('disables edit button when areActionsDisabled is true', async () => {
  render(
    <UserPrompt
      {...defaultProps}
      areActionsDisabled={true}
    />,
  )

  const messageText = screen.getByText(defaultProps.message)
  await userEvent.hover(messageText)

  expect(screen.getByTestId(TEST_ID.EDIT_BUTTON)).toBeDisabled()
})

test('disables retry button when areActionsDisabled is true', async () => {
  const onRetry = jest.fn()
  render(
    <UserPrompt
      {...defaultProps}
      areActionsDisabled={true}
      onRetry={onRetry}
    />,
  )

  const messageText = screen.getByText(defaultProps.message)
  await userEvent.hover(messageText)

  expect(screen.getByTestId(TEST_ID.RETRY_BUTTON)).toBeDisabled()
})
