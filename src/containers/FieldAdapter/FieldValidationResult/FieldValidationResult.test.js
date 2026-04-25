
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { FieldValidation } from '@/models/DocumentValidation'
import { render } from '@/utils/rendererRTL'
import { FieldValidationResult } from './FieldValidationResult'

jest.mock('@/utils/env', () => mockEnv)

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

const mockWarning = {
  column: null,
  message: 'test warning',
  index: null,
  row: null,
}

const errors = Array(5).fill(mockError1)

jest.mock('../FieldValidationMessage', () => ({
  FieldValidationMessage: ({ validationItem }) => (
    <div>{validationItem.message}</div>
  ),
}))

test('renders only part of validation messages if the number of messages is more than allowed to show', () => {
  const mockFieldValidation = new FieldValidation(
    errors,
    [mockWarning],
  )

  const validationItems = [...mockFieldValidation.errors, ...mockFieldValidation.warnings]

  render(
    <FieldValidationResult
      validation={mockFieldValidation}
    />,
  )

  const listItems = screen.getAllByRole('listitem')

  expect(validationItems.length).toBeGreaterThan(listItems.length)
})

test('renders button to show all/collapse validation messages if the number of messages is more than allowed to show', async () => {
  const mockFieldValidation = new FieldValidation(
    errors,
    [mockWarning],
  )

  const validationItems = [...mockFieldValidation.errors, ...mockFieldValidation.warnings]

  render(
    <FieldValidationResult
      validation={mockFieldValidation}
    />,
  )

  const showAllButton = screen.queryByRole('button', {
    name: localize(Localization.SHOW_ALL, { count: validationItems.length }),
  })

  await userEvent.click(showAllButton)

  const collapseButton = screen.queryByRole('button', {
    name: localize(Localization.COLLAPSE),
  })
  const listItems = screen.getAllByRole('listitem')

  expect(collapseButton).toBeInTheDocument()
  expect(validationItems.length).toEqual(listItems.length)
})

test('renders just validation messages list if the number of messages is less then max allowed amount', () => {
  const mockFieldValidation = new FieldValidation(
    [mockError1, mockError2],
    [],
  )

  const validationItems = [...mockFieldValidation.errors, ...mockFieldValidation.warnings]

  render(
    <FieldValidationResult
      validation={mockFieldValidation}
    />,
  )

  const listItems = screen.getAllByRole('listitem')

  expect(listItems.length).toEqual(validationItems.length)
  expect(screen.queryByRole('button')).not.toBeInTheDocument()

  validationItems.forEach((v) => {
    expect(screen.getByText(v.message)).toBeInTheDocument()
  })
})
