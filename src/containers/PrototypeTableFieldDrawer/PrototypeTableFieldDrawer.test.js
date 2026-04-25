
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
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
import { PrototypeTableFieldDrawer } from './PrototypeTableFieldDrawer'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('./PrototypeTableFieldForm', () => mockShallowComponent('PrototypeTableFieldForm'))

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    getValues: jest.fn(() => ({})),
    formState: {
      isValid: true,
    },
    reset: jest.fn(),
  })),
}))

const mockField = new PrototypeTableField({
  id: 'fieldId',
  prototypeId: 'prototypeId',
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

beforeEach(() => {
  jest.clearAllMocks()
})

const setup = (props = {}) => {
  const defaultProps = {
    closeDrawer: jest.fn(),
    isLoading: false,
    onSave: jest.fn(),
    visible: true,
  }

  return render(
    <PrototypeTableFieldDrawer
      {...defaultProps}
      {...props}
    />,
  )
}

test('renders drawer with correct title and form if no field passed', () => {
  setup()

  const drawerTitle = screen.getByText(localize(Localization.ADD_TABLE_FIELD))
  const form = screen.getByTestId('PrototypeTableFieldForm')

  expect(drawerTitle).toBeInTheDocument()
  expect(form).toBeInTheDocument()
})

test('renders drawer with correct title and form if there is a field', () => {
  setup({
    field: mockField,
  })

  const drawerTitle = screen.getByText(localize(Localization.EDIT_TABLE_FIELD))
  const form = screen.getByTestId('PrototypeTableFieldForm')

  expect(drawerTitle).toBeInTheDocument()
  expect(form).toBeInTheDocument()
})

test('calls closeDrawer when Cancel is clicked', async () => {
  const mockCloseDrawer = jest.fn()

  setup({ closeDrawer: mockCloseDrawer })

  const cancelButton = screen.getByRole('button', {
    name: localize(Localization.CANCEL),
  })

  await userEvent.click(cancelButton)

  expect(mockCloseDrawer).toHaveBeenCalled()
})

test('disables save button when form data is invalid', () => {
  useForm.mockImplementationOnce(() => ({
    formState: {
      isValid: false,
    },
    getValues: jest.fn(() => ({})),
  }))

  setup()

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  expect(saveButton).toBeDisabled()
})

test('disables save button when fields for header names does not exists', () => {
  useForm.mockImplementationOnce(() => ({
    formState: {
      isValid: true,
    },
    getValues: jest.fn(() => ({})),
  }))

  setup()

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  expect(saveButton).toBeDisabled()
})

test('calls onSave with form data when save button is enabled and clicked', async () => {
  const mockValues = {
    name: 'fieldName',
    headers: [{ name: 'header' }],
  }
  const mockOnSave = jest.fn()

  useForm.mockImplementationOnce(() => ({
    formState: {
      isValid: true,
    },
    getValues: () => mockValues,
  }))

  setup({ onSave: mockOnSave })

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)
  expect(mockOnSave).nthCalledWith(1, mockValues)
})
