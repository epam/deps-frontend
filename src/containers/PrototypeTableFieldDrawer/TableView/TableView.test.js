
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TableCellLayout, TableLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { PrototypeTableHeader, TableHeaderType } from '@/models/PrototypeTableField'
import { activeTableSelector } from '@/selectors/prototypePage'
import { render } from '@/utils/rendererRTL'
import { TableView } from './TableView'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/prototypePage')
jest.mock('uuid', () => ({
  v4: jest.fn(() => mockUuid),
}))

const mockUuid = 'mock-uuid'
const mockCell1Text = 'Cell 0 0 content'
const mockCell2Text = 'Cell 0 1 content'

const mockCell1 = new TableCellLayout({
  content: mockCell1Text,
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

const mockCell2 = new TableCellLayout({
  content: mockCell2Text,
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 1,
  rowIndex: 1,
  rowSpan: 1,
  page: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockTableId = '123'

const mockTableLayout = new TableLayout({
  id: mockTableId,
  order: 1,
  cells: [mockCell1, mockCell2],
  confidence: 0,
  columnCount: 1,
  rowCount: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

beforeAll(() => {
  activeTableSelector.mockReturnValue(mockTableLayout)
})

beforeEach(() => {
  jest.clearAllMocks()
})

const defaultProps = {
  headerType: TableHeaderType.COLUMNS,
  addHeader: jest.fn(),
  removeHeader: jest.fn(),
  headersList: [],
}

test('renders the table with correct data', () => {
  render(
    <TableView
      {...defaultProps}
    />,
  )

  const table = screen.getByRole('table')
  const columns = screen.getAllByRole('columnheader')

  const headerCell = screen.getByRole('columnheader', {
    name: mockCell1Text,
  })
  expect(table).toBeInTheDocument()
  expect(columns).toHaveLength(1)
  expect(headerCell).toBeInTheDocument()
})

test('calls addHeader with correct args when clicking add button on a column header', async () => {
  const mockAddHeader = jest.fn()

  render(
    <TableView
      {...defaultProps}
      addHeader={mockAddHeader}
    />,
  )
  const [column] = screen.getAllByRole('columnheader')
  const addButton = within(column).getByRole('button')
  await userEvent.click(addButton)

  expect(mockAddHeader).nthCalledWith(1,
    {
      id: `${mockUuid}_col_${mockCell1.columnIndex}_row_${mockCell1.rowIndex}`,
      ...new PrototypeTableHeader({
        name: mockCell1Text,
        aliases: [mockCell1Text],
      }),
    },
    { shouldFocus: false },
  )
})

test('calls remove when clicking remove button on a mapped column header', async () => {
  const mockRemove = jest.fn()
  const headersList = [{
    aliases: [mockCell1Text],
    name: mockCell1Text,
    id: `col_${mockCell1.columnIndex}_row_${mockCell1.rowIndex}`,
  }]

  render(
    <TableView
      {...defaultProps}
      headersList={headersList}
      removeHeader={mockRemove}
    />,
  )

  const [column] = screen.getAllByRole('columnheader')
  const button = within(column).getByRole('button')

  await userEvent.click(button)

  expect(mockRemove).nthCalledWith(1, [0])
})
