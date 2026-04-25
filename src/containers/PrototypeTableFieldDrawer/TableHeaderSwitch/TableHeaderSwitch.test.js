
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { TableHeaderType } from '@/models/PrototypeTableField'
import { render } from '@/utils/rendererRTL'
import { TableHeaderSwitch } from './TableHeaderSwitch'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/components/Icons/TableColumnsIcon', () => mockShallowComponent('TableColumnsIcon'))

test('renders the radio options with icons', () => {
  render(
    <TableHeaderSwitch
      onChange={jest.fn()}
      value={TableHeaderType.COLUMNS}
    />,
  )

  expect(screen.getAllByTestId('TableColumnsIcon')).toHaveLength(2)
  expect(screen.getAllByRole('radio')).toHaveLength(2)
})

test('marks the correct option as selected based on the value prop', () => {
  render(
    <TableHeaderSwitch
      onChange={jest.fn()}
      value={TableHeaderType.ROWS}
    />,
  )

  const rowsRadio = screen.getByDisplayValue(TableHeaderType.ROWS)
  const columnsRadio = screen.getByDisplayValue(TableHeaderType.COLUMNS)

  expect(rowsRadio).toBeChecked()
  expect(columnsRadio).not.toBeChecked()
})

test('calls onChange with the correct value when an option is selected', async () => {
  const handleChange = jest.fn()
  render(
    <TableHeaderSwitch
      onChange={handleChange}
      value={TableHeaderType.ROWS}
    />,
  )

  const columnsRadio = screen.getByDisplayValue(TableHeaderType.COLUMNS)
  await userEvent.click(columnsRadio)

  expect(handleChange).nthCalledWith(1, TableHeaderType.COLUMNS)
})
