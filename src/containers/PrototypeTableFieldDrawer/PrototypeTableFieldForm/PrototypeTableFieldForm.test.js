
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Localization, localize } from '@/localization/i18n'
import { PrototypeTableHeader, TableHeaderType } from '@/models/PrototypeTableField'
import { activeTableSelector } from '@/selectors/prototypePage'
import { render } from '@/utils/rendererRTL'
import { PrototypeTableFieldForm } from './PrototypeTableFieldForm'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/components/Icons/WarningTriangleIcon', () => mockShallowComponent('WarningTriangleIcon'))
jest.mock('@/components/NumberStepper', () => mockShallowComponent('NumberStepper'))
jest.mock('../TableHeadersSection', () => mockShallowComponent('TableHeadersSection'))
jest.mock('../TableView', () => mockShallowComponent('TableView'))
jest.mock('../NotificationMessage', () => mockShallowComponent('NotificationMessage'))

jest.mock('@/selectors/prototypePage')

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useFormContext: jest.fn(() => ({
    getValues: () => mockValues,
  })),
}))

const mockValues = {
  headerType: TableHeaderType.COLUMNS,
}

test('shows table if activeTable is defined', () => {
  render(
    <PrototypeTableFieldForm />,
  )

  const tableView = screen.getByTestId('TableView')

  expect(activeTableSelector.getSelectorMockValue).toBeDefined()
  expect(tableView).toBeInTheDocument()
})

test('shows all form sections correctly', () => {
  render(
    <PrototypeTableFieldForm />,
  )

  const notificationMessage = screen.getByTestId('NotificationMessage')
  expect(notificationMessage).toBeInTheDocument()

  const fieldNameLabel = screen.getByText(localize(Localization.NAME))
  const fieldNameInput = screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))
  expect(fieldNameLabel).toBeInTheDocument()
  expect(fieldNameInput).toBeInTheDocument()

  const occurrenceIndexLabel = screen.getByText(localize(Localization.OCCURRENCE_INDEX))
  const occurrenceIndexField = screen.getByTestId('NumberStepper')
  expect(occurrenceIndexLabel).toBeInTheDocument()
  expect(occurrenceIndexField).toBeInTheDocument()

  const columnTypeOption = screen.getByDisplayValue(TableHeaderType.COLUMNS)
  const rowTypeOption = screen.getByDisplayValue(TableHeaderType.ROWS)
  expect(columnTypeOption).toBeInTheDocument()
  expect(rowTypeOption).toBeInTheDocument()

  const tableHeaderSection = screen.getByTestId('TableHeadersSection')
  expect(tableHeaderSection).toBeInTheDocument(TableHeaderType.ROWS)
})

test('removes all headers and appends previously saved headers on header type switch', async () => {
  const removeMock = jest.fn()
  const appendMock = jest.fn()
  const headersListMock = [{
    id: '1',
    name: 'name',
    aliases: ['name'],
  }]
  const headersMock = [
    new PrototypeTableHeader({
      name: '12',
      aliases: ['12'],
    }),
  ]

  useFieldArray.mockReturnValue({
    fields: headersListMock,
    remove: removeMock,
    append: appendMock,
  })
  useFormContext.mockReturnValue({
    getValues: jest.fn().mockReturnValue({
      headers: headersMock,
      headerType: TableHeaderType.COLUMNS,
    }),
  })

  render(
    <PrototypeTableFieldForm />,
  )

  const rowTypeOption = screen.getByDisplayValue(TableHeaderType.ROWS)
  await userEvent.click(rowTypeOption)

  expect(removeMock).toHaveBeenCalledWith([0])
  expect(appendMock).toHaveBeenCalledWith([])
})
