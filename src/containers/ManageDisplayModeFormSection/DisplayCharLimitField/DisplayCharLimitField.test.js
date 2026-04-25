
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { FieldType } from '@/enums/FieldType'
import { render } from '@/utils/rendererRTL'
import { DisplayCharLimitField } from './DisplayCharLimitField'

jest.mock('@/utils/env', () => mockEnv)

test('show char limit input with correct value', async () => {
  const mockDisplayCharLimit = 3

  render(
    <DisplayCharLimitField
      charLimit={mockDisplayCharLimit}
      fieldType={FieldType.STRING}
    />,
  )

  const input = screen.getByDisplayValue(mockDisplayCharLimit)

  expect(input).toBeInTheDocument()
  expect(input).toHaveAttribute('aria-valuemin', '0')
})

test('show example field with correct label', async () => {
  const mockDisplayCharLimit = 3

  render(
    <DisplayCharLimitField
      charLimit={mockDisplayCharLimit}
      fieldType={FieldType.STRING}
    />,
  )

  expect(screen.getByText(/field example/i)).toBeInTheDocument()
})

test('show example field with correct input value for string field', async () => {
  const mockDisplayCharLimit = 0
  const exampleText = 'Field Example'

  render(
    <DisplayCharLimitField
      charLimit={mockDisplayCharLimit}
      fieldType={FieldType.STRING}
    />,
  )

  const input = screen.getByDisplayValue('*'.repeat(exampleText.length))

  expect(input).toBeInTheDocument()
})

test('show example field with correct input value for date field', async () => {
  const mockDisplayCharLimit = 0
  const exampleText = '07-07-2027'

  render(
    <DisplayCharLimitField
      charLimit={mockDisplayCharLimit}
      fieldType={FieldType.DATE}
    />,
  )

  const input = screen.getByDisplayValue('*'.repeat(exampleText.length))

  expect(input).toBeInTheDocument()
})
