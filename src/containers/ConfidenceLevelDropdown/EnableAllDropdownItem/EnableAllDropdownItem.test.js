
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { EnableAllDropdownItem } from './EnableAllDropdownItem'

jest.mock('@/utils/env', () => mockEnv)

test('shows correct label and toggle', async () => {
  const mockOnChange = jest.fn()

  render(
    <EnableAllDropdownItem
      checked={true}
      indeterminate={false}
      onChange={mockOnChange}
    />,
  )

  const label = screen.getByText(localize(Localization.ENABLE_ALL))
  const toggle = screen.getByRole('switch')

  expect(label).toBeInTheDocument()
  expect(toggle).toBeChecked()

  await userEvent.click(toggle)

  expect(mockOnChange).toHaveBeenCalled()
})
