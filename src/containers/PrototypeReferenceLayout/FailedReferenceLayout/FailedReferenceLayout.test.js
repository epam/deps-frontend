
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FailedReferenceLayout } from './FailedReferenceLayout'

jest.mock('@/utils/env', () => mockEnv)

test('show correct text', () => {
  render(
    <FailedReferenceLayout restartLayout={jest.fn()} />,
  )

  const textBlock = screen.getByText(localize(Localization.REFERENCE_LAYOUT_FAILED))

  expect(textBlock).toBeInTheDocument()
})

test('calls restartLayout when the button is clicked', async () => {
  const mockRestartLayout = jest.fn()

  render(
    <FailedReferenceLayout restartLayout={mockRestartLayout} />,
  )

  const button = screen.getByRole('button', { name: localize(Localization.RELOAD) })
  await userEvent.click(button)

  expect(mockRestartLayout).toHaveBeenCalledTimes(1)
})
