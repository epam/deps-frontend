
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import {
  FieldType,
  RESOURCE_FIELD_TYPE,
  RESOURCE_FIELDS_TYPES,
} from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { ListFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { render } from '@/utils/rendererRTL'
import { FieldTypeCell } from './FieldTypeCell'

jest.mock('@/components/Icons/StringFieldIcon', () => ({
  StringFieldIcon: () => <div data-testid='string-field-icon' />,
}))
jest.mock('@/components/Icons/CheckboxFieldIcon', () => ({
  CheckboxFieldIcon: () => <div data-testid='checkbox-field-icon' />,
}))
jest.mock('@/utils/env', () => mockEnv)

test('shows correct icon and text for a simple field type', () => {
  render(
    <FieldTypeCell
      fieldType={FieldType.CHECKMARK}
    />,
  )

  expect(screen.getByTestId('checkbox-field-icon')).toBeInTheDocument()
  expect(screen.getByText(RESOURCE_FIELD_TYPE[FieldType.CHECKMARK])).toBeInTheDocument()
})

test('shows correct icon and text for a list of fields', () => {
  render(
    <FieldTypeCell
      fieldMeta={new ListFieldMeta(FieldType.STRING)}
      fieldType={FieldType.LIST}
    />,
  )

  const listFieldText = localize(
    Localization.LIST_OF,
    { value: RESOURCE_FIELDS_TYPES[FieldType.STRING] },
  )

  expect(screen.getByTestId('string-field-icon')).toBeInTheDocument()
  expect(screen.getByText(listFieldText)).toBeInTheDocument()
})
