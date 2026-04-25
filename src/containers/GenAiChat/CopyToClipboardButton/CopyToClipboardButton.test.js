
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { CopyToClipboardButton } from './CopyToClipboardButton'

jest.mock('@/components/Icons/CopyIcon', () => ({
  CopyIcon: () => <div data-testid='copy-icon' />,
}))

jest.mock('@/components/Icons/CheckDouble', () => ({
  CheckDouble: () => <div data-testid='check-double' />,
}))

jest.mock('@/utils/env', () => mockEnv)

const mockTextToCopy = 'Hello, world!'
const mockedWriteText = jest.fn()

navigator.clipboard = {
  writeText: mockedWriteText,
}

test('copies text to clipboard and updates button icon', async () => {
  render(
    <CopyToClipboardButton
      text={mockTextToCopy}
    />,
  )

  expect(screen.queryByText('check-double')).not.toBeInTheDocument()

  await userEvent.click(screen.getByTestId('copy-icon'))

  expect(mockedWriteText).nthCalledWith(1, mockTextToCopy)
  expect(screen.getByTestId('check-double')).toBeInTheDocument()

  await act(() => new Promise((resolve) => setTimeout(resolve, 2000)))

  expect(screen.queryByText('check-double')).not.toBeInTheDocument()
  expect(screen.getByTestId('copy-icon')).toBeInTheDocument()
})

test('shows a tooltip with correct title after text is copied', async () => {
  render(
    <CopyToClipboardButton
      text={mockTextToCopy}
    />,
  )

  await userEvent.click(screen.getByTestId('copy-icon'))

  const tooltip = screen.queryByRole(
    'tooltip',
    { name: localize(Localization.COPIED) },
  )

  expect(tooltip).toBeInTheDocument()
})
