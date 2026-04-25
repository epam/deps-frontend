
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { RetryPreviousStepButton } from '.'

jest.mock('@/utils/env', () => mockEnv)
Modal.confirm = jest.fn()

const mockRenderTrigger = (onClick) => (
  <button
    data-testid={'trigger'}
    onClick={onClick}
  />
)

test('renders button correctly', () => {
  render(
    <RetryPreviousStepButton
      disabled={false}
      retryLastStep={jest.fn()}
    />,
  )

  expect(screen.getByRole('button', {
    name: localize(Localization.RETRY_PREVIOUS_STEP),
  })).toBeInTheDocument()
})

test('renders button correctly if renderTrigger passed', () => {
  render(
    <RetryPreviousStepButton
      renderTrigger={mockRenderTrigger}
      retryLastStep={jest.fn()}
    />,
  )

  expect(screen.getByTestId('trigger')).toBeInTheDocument()
})

test('calls Modal.confirm with correct arguments in case of button click', async () => {
  const mockConfirmContent = 'mockConfirmContent'
  render(
    <RetryPreviousStepButton
      confirmContent={mockConfirmContent}
      disabled={false}
      retryLastStep={jest.fn()}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.RETRY_PREVIOUS_STEP),
  })

  await userEvent.click(button)

  expect(Modal.confirm).nthCalledWith(1, {
    content: mockConfirmContent,
    title: localize(Localization.RETRY_LAST_STEP_CONFIRM_TITLE),
    onOk: expect.any(Function),
    okText: localize(Localization.RETRY),
    cancelText: localize(Localization.CANCEL),
  })
})

test('calls retryLastStep when clicking on modal confirm', async () => {
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const mockRetryLastStep = jest.fn()
  render(
    <RetryPreviousStepButton
      disabled={false}
      retryLastStep={mockRetryLastStep}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.RETRY_PREVIOUS_STEP),
  })

  await userEvent.click(button)

  expect(mockRetryLastStep).toHaveBeenCalled()
})
