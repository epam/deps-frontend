/* eslint-disable testing-library/no-node-access */

import { mockEnv } from '@/mocks/mockEnv'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { SelectOption } from '@/components/Select'
import { KeyCode } from '@/enums/KeyCode'
import { render } from '@/utils/rendererRTL'
import { PageSelector } from './PageSelector'

const enterKey = {
  key: 'Enter',
  code: 'Enter',
  keyCode: KeyCode.ENTER,
}

const mockValue = '2'

const mockOptions = [
  new SelectOption(
    '1',
    '1',
    null,
    false,
  ),
  new SelectOption(
    '2',
    '2',
    null,
    false,
  ),
  new SelectOption(
    '3',
    '3',
    null,
    true,
  ),
]

jest.mock('@/utils/env', () => mockEnv)

test('show Page Range selector correctly', async () => {
  render(
    <PageSelector
      isValid={true}
      onChange={jest.fn()}
      options={mockOptions}
      value={mockValue}
    />,
  )

  expect(screen.getByRole('combobox')).toBeInTheDocument()
  expect(screen.getByTitle(mockValue)).toHaveTextContent(mockValue)
})

test('call onChange with proper value if user selected page', async () => {
  const mockOnChange = jest.fn()

  render(
    <PageSelector
      isValid={true}
      onChange={mockOnChange}
      options={mockOptions}
      value={mockValue}
    />,
  )

  const pageSelector = screen.getByTitle(mockValue)
  await userEvent.click(pageSelector)

  const [firstOption] = document.querySelectorAll('.ant-select-item-option')
  await userEvent.click(firstOption, { pointerEventsCheck: PointerEventsCheckLevel.Never })

  expect(mockOnChange).nthCalledWith(1, firstOption.title, expect.any(Object))
})

test('call onChange with proper value if user entered page', async () => {
  const mockOnChange = jest.fn()
  const newPageValue = '0'

  render(
    <PageSelector
      isValid={true}
      onChange={mockOnChange}
      options={mockOptions}
      value={mockValue}
    />,
  )

  const input = screen.getByRole('combobox')
  fireEvent.change(input, { target: { value: newPageValue } })
  fireEvent.keyDown(input, enterKey)

  await waitFor(() => {
    expect(mockOnChange).nthCalledWith(1, newPageValue)
  })
})
