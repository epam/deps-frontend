
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { setActiveTable } from '@/actions/prototypePage'
import { TableCellLayout, TableLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { activeTableSelector } from '@/selectors/prototypePage'
import { render } from '@/utils/rendererRTL'
import { TableItem } from './TableItem'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/prototypePage')

jest.mock('@/components/HandsonTable', () => ({
  ...jest.requireActual('@/components/HandsonTable'),
  HandsonTable: () => <div data-testid='hot-table' />,
}))

jest.mock('@/actions/prototypePage', () => ({
  setActiveTable: jest.fn(() => ({ type: 'mockType' })),
}))

jest.mock('@/containers/PrototypeReferenceLayout/AddTableFieldButton', () => mockShallowComponent('AddTableFieldButton'))

const mockCell = new TableCellLayout({
  content: 'Cell content',
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 1,
  rowIndex: 0,
  rowSpan: 1,
  page: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockTable = new TableLayout({
  id: 'mockTableId',
  order: 1,
  cells: [mockCell],
  confidence: 0,
  columnCount: 1,
  rowCount: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('shows correct layout if activeTable does not exist', () => {
  activeTableSelector.mockReturnValue(null)

  render(
    <TableItem
      isEditMode={false}
      table={mockTable}
    />,
  )

  expect(screen.queryByTestId('AddTableFieldButton')).not.toBeInTheDocument()
  expect(screen.getByTestId('hot-table')).toBeInTheDocument()
})

test('shows add field button if table is selected in edit mode', async () => {
  activeTableSelector.mockReturnValue(mockTable)

  render(
    <TableItem
      isEditMode
      table={mockTable}
    />,
  )

  expect(screen.getByTestId('AddTableFieldButton')).toBeInTheDocument()
})

test('does not show add field button if not edit mode', async () => {
  activeTableSelector.mockReturnValue(mockTable)

  render(
    <TableItem
      isEditMode={false}
      table={mockTable}
    />,
  )

  expect(screen.queryByTestId('AddTableFieldButton')).not.toBeInTheDocument()
})

test('calls setActiveTable on click in edit mode', async () => {
  render(
    <TableItem
      isEditMode
      table={mockTable}
    />,
  )

  const table = screen.getByTestId('hot-table')

  await userEvent.click(table)

  expect(setActiveTable).nthCalledWith(1, mockTable)
})

test('does not call setActiveTable if not in edit mode', async () => {
  render(
    <TableItem
      isEditMode={false}
      table={mockTable}
    />,
  )

  const table = screen.getByTestId('hot-table')

  await userEvent.click(table)

  expect(setActiveTable).not.toHaveBeenCalled()
})
