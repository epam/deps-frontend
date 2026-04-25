
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { TEST_ID } from '../constants'
import { Actions } from './Actions'

jest.mock('@/utils/env', () => mockEnv)

const defaultProps = {
  disabled: false,
  onEditButtonClick: jest.fn(),
}

test('renders edit button correctly', () => {
  render(<Actions {...defaultProps} />)

  expect(screen.getByTestId(TEST_ID.EDIT_BUTTON)).toBeInTheDocument()
  expect(screen.queryByTestId(TEST_ID.RETRY_BUTTON)).not.toBeInTheDocument()
})

test('renders correct tooltip on edit button hover', async () => {
  render(<Actions {...defaultProps} />)

  const editBtn = screen.getByTestId(TEST_ID.EDIT_BUTTON)
  await userEvent.hover(editBtn)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.EDIT))
  })
})

test('renders retry button correctly if onRetryButtonClick is provided', () => {
  render(
    <Actions
      {...defaultProps}
      onRetryButtonClick={jest.fn()}
    />,
  )

  expect(screen.getByTestId(TEST_ID.RETRY_BUTTON)).toBeInTheDocument()
  expect(screen.queryByTestId(TEST_ID.EDIT_BUTTON)).not.toBeInTheDocument()
})

test('renders correct tooltip on retry button hover if onRetryButtonClick is provided', async () => {
  render(
    <Actions
      {...defaultProps}
      onRetryButtonClick={jest.fn()}
    />,
  )

  const retryBtn = screen.getByTestId(TEST_ID.RETRY_BUTTON)
  await userEvent.hover(retryBtn)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.RETRY))
  })
})

test('disables edit button if prop disabled is true', () => {
  render(
    <Actions
      {...defaultProps}
      disabled={true}
    />,
  )

  expect(screen.getByTestId(TEST_ID.EDIT_BUTTON)).toBeDisabled()
})

test('disables retry button if prop disabled is true', () => {
  const onRetryButtonClick = jest.fn()
  render(
    <Actions
      {...defaultProps}
      disabled={true}
      onRetryButtonClick={onRetryButtonClick}
    />,
  )

  expect(screen.getByTestId(TEST_ID.RETRY_BUTTON)).toBeDisabled()
})

test('calls onEditButtonClick on edit button click', async () => {
  const onEditButtonClick = jest.fn()
  render(
    <Actions
      {...defaultProps}
      onEditButtonClick={onEditButtonClick}
    />,
  )

  const editBtn = screen.getByTestId(TEST_ID.EDIT_BUTTON)
  await userEvent.click(editBtn)
  expect(onEditButtonClick).toHaveBeenCalled()
})

test('calls onRetryButtonClick on retry button click', async () => {
  const onRetryButtonClick = jest.fn()
  render(
    <Actions
      {...defaultProps}
      onRetryButtonClick={onRetryButtonClick}
    />,
  )

  const retryBtn = screen.getByTestId(TEST_ID.RETRY_BUTTON)
  await userEvent.click(retryBtn)
  expect(onRetryButtonClick).toHaveBeenCalled()
})
