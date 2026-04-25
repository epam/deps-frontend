
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { TableFieldColumn, TableFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { PrototypeFieldType } from '@/models/PrototypeField'
import {
  PrototypeTableField,
  PrototypeTableHeader,
  PrototypeTabularMapping,
  TableHeaderType,
} from '@/models/PrototypeTableField'
import { render } from '@/utils/rendererRTL'
import { EditTableFieldButton } from './EditTableFieldButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/components/Icons/PenIcon', () => mockShallowComponent('PenIcon'))

const columnName = 'Column name'

const mockTableField = new PrototypeTableField({
  id: 'fieldId',
  prototypeId: 'mockPrototypeId',
  name: 'Test Table Field',
  fieldType: new PrototypeFieldType({
    typeCode: FieldType.TABLE,
    description: new TableFieldMeta(
      [new TableFieldColumn(columnName)],
    ),
  }),
  tabularMapping: new PrototypeTabularMapping({
    headerType: TableHeaderType.COLUMNS,
    headers: [
      new PrototypeTableHeader({
        name: columnName,
        aliases: [columnName],
      }),
    ],
    occurrenceIndex: 1,
  }),
})

test('shows drawer on button click', async () => {
  render(
    <EditTableFieldButton
      field={mockTableField}
      isEditMode={true}
      updateField={jest.fn()}
    />,
  )

  const button = screen.getByTestId('PenIcon')
  await userEvent.click(button)

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
})

test('calls updateField with correct data on modified field save', async () => {
  const mockUpdateFn = jest.fn()
  const newFieldName = 'hey'

  render(
    <EditTableFieldButton
      field={mockTableField}
      isEditMode={true}
      updateField={mockUpdateFn}
    />,
  )

  const button = screen.getByTestId('PenIcon')
  await userEvent.click(button)

  const nameInput = screen.getByDisplayValue(mockTableField.name)
  await userEvent.clear(nameInput)
  await userEvent.type(nameInput, newFieldName)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })
  await userEvent.click(saveButton)

  expect(mockUpdateFn).nthCalledWith(1, {
    ...mockTableField,
    name: newFieldName,
    fieldType: {
      ...mockTableField.fieldType,
      description: new TableFieldMeta(
        [new TableFieldColumn(columnName)],
      ),
    },
  })
})
