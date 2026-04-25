
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { FieldType, RESOURCE_FIELD_TYPE } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ExtraFieldType } from './ExtraFieldType'

jest.mock('@/utils/env', () => mockEnv)

const mockType = FieldType.STRING

test('show ExtraFieldType input with correct label', () => {
  render(
    <ExtraFieldType
      type={mockType}
    />,
  )

  expect(screen.getByText(localize(Localization.TYPE))).toBeInTheDocument()
})

test('show input with a correct state and value', () => {
  render(
    <ExtraFieldType
      type={mockType}
    />,
  )

  const input = screen.getByRole('textbox')

  expect(input).toBeDisabled()
  expect(input.value).toEqual(RESOURCE_FIELD_TYPE[mockType])
})
