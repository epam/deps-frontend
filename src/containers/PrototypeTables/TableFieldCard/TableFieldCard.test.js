
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
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
import { TableFieldCard } from './TableFieldCard'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/XMarkIcon', () => mockShallowComponent('XMarkIcon'))
jest.mock('@/containers/PrototypeTables/MappingHeaders', () => mockShallowComponent('MappingHeaders'))
jest.mock('@/containers/PrototypeTables/EditTableFieldButton', () => mockShallowComponent('EditTableFieldButton'))

jest.mock('lodash/debounce', () =>
  jest.fn((fn) => fn),
)

const mockField = new PrototypeTableField({
  id: 'fieldId',
  prototypeId: 'prototypeId',
  name: 'Test Table Field',
  fieldType: new PrototypeFieldType({
    typeCode: FieldType.TABLE,
    description: new TableFieldMeta(
      [new TableFieldColumn('Col name')],
    ),
  }),
  tabularMapping: new PrototypeTabularMapping({
    headerType: TableHeaderType.COLUMNS,
    headers: [
      new PrototypeTableHeader({
        name: 'Col name',
        aliases: ['Col name'],
      }),
    ],
    occurrenceIndex: 1,
  }),
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders field name input with correct value and placeholder', () => {
  render(
    <TableFieldCard
      field={mockField}
      isEditMode={true}
      removeField={jest.fn()}
      updateField={jest.fn()}
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.ENTER_FIELD_NAME))

  expect(input).toBeInTheDocument()
  expect(input).toHaveValue(mockField.name)
})

test('renders occurrence index input with correct value', () => {
  render(
    <TableFieldCard
      field={mockField}
      isEditMode={true}
      removeField={jest.fn()}
      updateField={jest.fn()}
    />,
  )

  const input = screen.getByRole('spinbutton')

  expect(input).toBeInTheDocument()
  expect(input).toHaveValue('1')
})

test('calls removeField on delete icon click', async () => {
  const mockRemoveField = jest.fn()

  render(
    <TableFieldCard
      field={mockField}
      isEditMode={true}
      removeField={mockRemoveField}
      updateField={jest.fn()}
    />,
  )

  const deleteBtn = screen.getByTestId(('XMarkIcon'))
  await userEvent.click(deleteBtn)

  expect(mockRemoveField).nthCalledWith(1, mockField.id)
})

test('calls updateField on field name change', async () => {
  const mockUpdateField = jest.fn()

  render(
    <TableFieldCard
      field={mockField}
      isEditMode={true}
      removeField={jest.fn()}
      updateField={mockUpdateField}
    />,
  )

  const input = screen.getByDisplayValue(mockField.name)
  await userEvent.clear(input)

  expect(mockUpdateField).nthCalledWith(1, {
    ...mockField,
    name: '',
  })
})

test('calls updateField on occurrence index change', async () => {
  const mockUpdateField = jest.fn()

  render(
    <TableFieldCard
      field={mockField}
      isEditMode={true}
      removeField={jest.fn()}
      updateField={mockUpdateField}
    />,
  )

  const input = screen.getByDisplayValue(mockField.tabularMapping.occurrenceIndex)

  await userEvent.clear(input)
  await userEvent.type(input, '4')

  expect(mockUpdateField).nthCalledWith(2, {
    ...mockField,
    tabularMapping: {
      ...mockField.tabularMapping,
      occurrenceIndex: 4,
    },
  })
})

test('shows readonly layout if edit mode is false', () => {
  render(
    <TableFieldCard
      field={mockField}
      isEditMode={false}
      removeField={jest.fn()}
      updateField={jest.fn()}
    />,
  )

  const deleteBtn = screen.queryByTestId(('XMarkIcon'))
  const fieldNameInput = screen.getByPlaceholderText(localize(Localization.ENTER_FIELD_NAME))
  const occurrenceIndexInput = screen.getByRole('spinbutton')

  expect(deleteBtn).not.toBeInTheDocument()
  expect(fieldNameInput).toBeDisabled()
  expect(occurrenceIndexInput).toBeDisabled()
})

test('renders MappingHeaders and EditTableField', () => {
  render(
    <TableFieldCard
      field={mockField}
      isEditMode={true}
      removeField={jest.fn()}
      updateField={jest.fn()}
    />,
  )

  expect(screen.getByTestId('MappingHeaders')).toBeInTheDocument()
  expect(screen.getByTestId('EditTableFieldButton')).toBeInTheDocument()
})

test('does not render buttons to edit and delete field if it is not edit mode', () => {
  render(
    <TableFieldCard
      field={mockField}
      isEditMode={false}
      removeField={jest.fn()}
      updateField={jest.fn()}
    />,
  )

  expect(screen.queryByTestId('EditTableFieldButton')).not.toBeInTheDocument()
  expect(screen.queryByTestId('XMarkIcon')).not.toBeInTheDocument()
})
