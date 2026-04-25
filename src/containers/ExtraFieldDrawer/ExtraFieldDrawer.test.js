
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  FieldType,
  RESOURCE_FIELD_TYPE,
} from '@/enums/FieldType'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { render } from '@/utils/rendererRTL'
import { ExtraFieldDrawer } from './ExtraFieldDrawer'

jest.mock('@/utils/env', () => mockEnv)

const mockField = new DocumentTypeExtraField({
  name: 'Extra Field Name',
  type: FieldType.STRING,
  autoFilled: false,
  code: '12345',
  order: 0,
})

test('shows the input for field name in the drawer', () => {
  render(
    <ExtraFieldDrawer
      closeDrawer={jest.fn()}
      field={mockField}
      isLoading={false}
      onSubmit={jest.fn()}
      setField={jest.fn()}
      visible={true}
    />,
  )

  expect(screen.getByDisplayValue(mockField.name)).toBeInTheDocument()
})

test('shows the input for field type in the drawer', () => {
  render(
    <ExtraFieldDrawer
      closeDrawer={jest.fn()}
      field={mockField}
      isLoading={false}
      onSubmit={jest.fn()}
      setField={jest.fn()}
      visible={true}
    />,
  )

  expect(screen.getByDisplayValue(RESOURCE_FIELD_TYPE[mockField.type])).toBeInTheDocument()
})

test('calls closeDrawer prop if Cancel button is clicked', async () => {
  const mockCloseDrawer = jest.fn()

  render(
    <ExtraFieldDrawer
      closeDrawer={mockCloseDrawer}
      field={mockField}
      isLoading={false}
      onSubmit={jest.fn()}
      setField={jest.fn()}
      visible={true}
    />,
  )

  await userEvent.click(screen.getByRole('button', { name: /cancel/i }))

  expect(mockCloseDrawer).toHaveBeenCalledTimes(1)
})

test('calls onSubmit prop with correct parameters if Submit button is clicked', async () => {
  const mockOnSubmit = jest.fn()

  render(
    <ExtraFieldDrawer
      closeDrawer={jest.fn()}
      field={mockField}
      isLoading={false}
      onSubmit={mockOnSubmit}
      setField={jest.fn()}
      visible={true}
    />,
  )

  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(mockOnSubmit).nthCalledWith(1, {
    name: mockField.name,
    type: mockField.type,
    autoFilled: mockField.autoFilled,
    code: mockField.code,
    order: 0,
  })
})

test('trims field name when calls onSubmit', async () => {
  const mockOnSubmit = jest.fn()
  const mockFieldWithSpace = {
    ...mockField,
    name: ` ${mockField.name} `,
  }

  render(
    <ExtraFieldDrawer
      closeDrawer={jest.fn()}
      field={mockFieldWithSpace}
      isLoading={false}
      onSubmit={mockOnSubmit}
      setField={jest.fn()}
      visible={true}
    />,
  )

  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(mockOnSubmit).nthCalledWith(1, {
    name: mockField.name.trim(),
    type: mockField.type,
    autoFilled: mockField.autoFilled,
    code: mockField.code,
    order: 0,
  })
})

test('shows the correct drawer title and submit button text when it is field creation', () => {
  render(
    <ExtraFieldDrawer
      closeDrawer={jest.fn()}
      field={mockField}
      isFieldCreationMode={true}
      isLoading={false}
      onSubmit={jest.fn()}
      setField={jest.fn()}
      visible={true}
    />,
  )

  expect(screen.getByText(/add extra field/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
})

test('shows the correct drawer title and submit button text with default props', () => {
  render(
    <ExtraFieldDrawer
      closeDrawer={jest.fn()}
      field={mockField}
      isLoading={false}
      onSubmit={jest.fn()}
      setField={jest.fn()}
      visible={true}
    />,
  )

  expect(screen.getByText(/edit extra field/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
})
