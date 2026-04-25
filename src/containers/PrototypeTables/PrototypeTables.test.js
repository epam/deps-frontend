
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { PrototypeFieldType } from '@/models/PrototypeField'
import {
  PrototypeTableField,
  PrototypeTableHeader,
  PrototypeTabularMapping,
  TableHeaderType,
} from '@/models/PrototypeTableField'
import { render } from '@/utils/rendererRTL'
import { PrototypeTables } from './PrototypeTables'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('./AddFieldButton', () => mockShallowComponent('AddFieldButton'))
jest.mock('./TableFieldCard', () => mockShallowComponent('TableFieldCard'))

const mockPrototypeId = 'mockPrototypeId'

const mockPrototypeField = new PrototypeTableField({
  id: 'fieldId',
  prototypeId: mockPrototypeId,
  name: 'Test Table Field',
  fieldType: new PrototypeFieldType({
    typeCode: FieldType.TABLE,
    description: {},
  }),
  tabularMapping: new PrototypeTabularMapping({
    headerType: TableHeaderType.ROWS,
    headers: [
      new PrototypeTableHeader({
        name: 'Row name',
        aliases: ['Row alias'],
      }),
    ],
    occurrenceIndex: 1,
  }),
})

test('shows correct header layout', async () => {
  render(
    <PrototypeTables
      addField={jest.fn()}
      fields={[mockPrototypeField]}
      fieldsColumnsCount={2}
      isEditMode={true}
      removeField={jest.fn()}
      toggleEditMode={jest.fn()}
      updateField={jest.fn()}
    />,
  )

  expect(screen.getByText(localize(Localization.LIST_OF_TABLES))).toBeInTheDocument()
  expect(screen.getByPlaceholderText(localize(Localization.SEARCH_FIELD))).toBeInTheDocument()
  expect(screen.getByTestId('AddFieldButton')).toBeInTheDocument()
})

test('does not show button to add fields if fields exists and it is not edit mode', async () => {
  render(
    <PrototypeTables
      addField={jest.fn()}
      fields={[mockPrototypeField]}
      fieldsColumnsCount={2}
      isEditMode={false}
      removeField={jest.fn()}
      toggleEditMode={jest.fn()}
      updateField={jest.fn()}
    />,
  )

  expect(screen.queryByTestId('AddFieldButton')).not.toBeInTheDocument()
})

test('shows correct content if no table fields', async () => {
  render(
    <PrototypeTables
      addField={jest.fn()}
      fields={[]}
      fieldsColumnsCount={2}
      isEditMode={false}
      removeField={jest.fn()}
      toggleEditMode={jest.fn()}
      updateField={jest.fn()}
    />,
  )

  expect(screen.getByText(localize(Localization.EMPTY_SECTION_DISCLAIMER))).toBeInTheDocument()
  expect(screen.getByTestId('AddFieldButton')).toBeInTheDocument()
})

test('renders list of fields when fields are present', () => {
  const mockFields = [mockPrototypeField]

  render(
    <PrototypeTables
      addField={jest.fn()}
      fields={mockFields}
      fieldsColumnsCount={2}
      isEditMode={true}
      removeField={jest.fn()}
      toggleEditMode={jest.fn()}
      updateField={jest.fn()}
    />,
  )

  const renderedFields = screen.getAllByTestId('TableFieldCard')

  expect(renderedFields.length).toEqual(mockFields.length)
})
