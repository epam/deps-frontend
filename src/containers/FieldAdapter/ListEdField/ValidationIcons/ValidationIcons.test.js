
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setScrollId } from '@/actions/navigation'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta, ListFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { FieldValidation } from '@/models/DocumentValidation'
import { render } from '@/utils/rendererRTL'
import { ValidationIcons } from './ValidationIcons'

const mockAction = { type: 'action' }

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/actions/navigation', () => ({
  setScrollId: jest.fn(() => mockAction),
}))

jest.mock('@/components/Icons/ErrorTriangleIcon', () => ({
  ErrorTriangleIcon: ({ onClick }) => (
    <div
      data-testid='warning-icon'
      onClick={onClick}
    />
  ),
}))

jest.mock('@/components/Icons/ErrorCircleIcon', () => ({
  ErrorCircleIcon: ({ onClick }) => (
    <div
      data-testid='error-icon'
      onClick={onClick}
    />
  ),
}))

jest.mock('@/containers/FieldAdapter/FieldValidationMessage', () => ({
  FieldValidationMessage: ({ validationItem }) => (
    <span>{validationItem.message}</span>
  ),
}))

const mockError1 = {
  column: null,
  message: 'test error 1',
  index: null,
  row: null,
}

const mockError2 = {
  column: null,
  message: 'test error 2',
  index: null,
  row: null,
}

const mockWarning1 = {
  column: null,
  message: 'test warning 2',
  index: 1,
  row: null,
}

const mockWarning2 = {
  column: null,
  message: 'test warning 2',
  index: null,
  row: null,
}

const mockDtField = new DocumentTypeField(
  'listStrs',
  'list Strs',
  new ListFieldMeta(FieldType.STRING, new DocumentTypeFieldMeta()),
  FieldType.LIST,
  false,
  0,
  'whole',
  730,
)

test('shows correctly warnings list on warning icon hover', async () => {
  const mockFieldValidation = new FieldValidation(
    [],
    [mockWarning1, mockWarning2],
  )

  render(
    <ValidationIcons
      dtField={mockDtField}
      validation={mockFieldValidation}
    />,
  )

  const warningIcon = screen.getByTestId('warning-icon')

  await userEvent.hover(warningIcon)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    const warningItems = within(tooltip).getAllByRole('listitem')

    warningItems.forEach((item) => {
      expect(item).toHaveTextContent(/test warning/i)
    })
  })
})

test('calls setScrollId with correct argument on warning icon click', async () => {
  const mockFieldValidation = new FieldValidation(
    [],
    [mockWarning1],
  )

  render(
    <ValidationIcons
      dtField={mockDtField}
      validation={mockFieldValidation}
    />,
  )

  const warningIcon = screen.getByTestId('warning-icon')

  await userEvent.click(warningIcon)

  expect(setScrollId).toHaveBeenCalled()
})

test('shows correctly errors list on error icon hover', async () => {
  const mockFieldValidation = new FieldValidation(
    [mockError1, mockError2],
    [],
  )

  render(
    <ValidationIcons
      dtField={mockDtField}
      validation={mockFieldValidation}
    />,
  )

  const errorIcon = screen.getByTestId('error-icon')

  await userEvent.hover(errorIcon)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    const errorItems = within(tooltip).getAllByRole('listitem')

    errorItems.forEach((item) => {
      expect(item).toHaveTextContent(/test error/i)
    })
  })
})

test('calls setScrollId with correct argument on error icon click', async () => {
  const mockFieldValidation = new FieldValidation(
    [mockError1, mockError2],
    [],
  )

  render(
    <ValidationIcons
      dtField={mockDtField}
      validation={mockFieldValidation}
    />,
  )

  const errorIcon = screen.getByTestId('error-icon')

  await userEvent.click(errorIcon)

  expect(setScrollId).toHaveBeenCalled()
})
