
import { mockEnv } from '@/mocks/mockEnv'
import { fireEvent, screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ExtraFieldName } from './ExtraFieldName'

jest.mock('@/utils/env', () => mockEnv)

const mockName = 'Test Name'

test('show input with correct label', () => {
  render(
    <ExtraFieldName
      name={mockName}
      updateField={jest.fn()}
    />,
  )

  expect(screen.getByText(localize(Localization.NAME))).toBeInTheDocument()
})

test('show passed name as input value', () => {
  render(
    <ExtraFieldName
      name={mockName}
      updateField={jest.fn()}
    />,
  )

  const input = screen.getByRole('textbox')
  expect(input.value).toEqual(mockName)
})

test('call updateField if name was changed', () => {
  const mockUpdateField = jest.fn()

  render(
    <ExtraFieldName
      name={mockName}
      updateField={mockUpdateField}
    />,
  )

  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'New Name' } })

  expect(mockUpdateField).nthCalledWith(1, expect.any(Function))
})
