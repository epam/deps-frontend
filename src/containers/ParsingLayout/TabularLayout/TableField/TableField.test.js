
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { highlightTableCoordsField } from '@/actions/documentReviewPage'
import { TableCell, TableCoordinate } from '@/models/TabularLayout'
import { TableSchema } from '@/models/TabularLayout/Table'
import { render } from '@/utils/rendererRTL'
import { TableField } from './TableField'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({
    documentId: 'mock-document-id',
    fileId: undefined,
  })),
}))
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ documentId: 'mock-document-id' })),
}))
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/api/parsingApi', () => ({
  getTabularLayout: jest.fn(),
  getFileTabularLayout: jest.fn(),
}))

const mockAction = { type: 'action' }

jest.mock('@/actions/documentReviewPage', () => ({
  highlightTableCoordsField: jest.fn(() => mockAction),
}))

const mockCellCoordinates = {
  row: 0,
  col: 0,
}

const mockHTSelectedCell = {
  from: mockCellCoordinates,
  to: mockCellCoordinates,
}

const mockTableSchema = new TableSchema({
  id: 'mockTableSchemaId',
  sheetId: 'mockSheetId',
  rowCount: 2,
  columnCount: 1,
  placement: [
    new TableCoordinate({
      row: 0,
      column: 0,
    }),
    new TableCoordinate({
      row: 3,
      column: 7,
    }),
  ],
})

const mockTableCells = [
  new TableCell({
    id: 'mockCellId1',
    tableId: 'mockTableId',
    content: 'A1',
    absolutePosition: [0, 0],
    relativePosition: [0, 0],
  }),
  new TableCell({
    id: 'mockCellId2',
    tableId: 'mockTableId',
    content: 'B1',
    absolutePosition: [1, 0],
    relativePosition: [0, 1],
  }),
]

jest.mock('@/components/HandsonTable', () => ({
  ...jest.requireActual('@/components/HandsonTable'),
  HandsonTable: ({ data, onSelectRange }) => {
    return (
      <table data-testid="hot-table">
        <tbody>
          {
            data.map((rows, idx) => (
              <tr key={idx}>
                {
                  rows.map((cell, idx) => (
                    <td
                      key={idx}
                      onClick={() => onSelectRange([mockHTSelectedCell])}
                    >
                      {cell}
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  },
}))

test('renders table', () => {
  render(
    <TableField
      initialData={mockTableCells}
      schema={mockTableSchema}
      sheetIndex={1}
    />,
  )

  expect(screen.getByTestId('hot-table')).toBeInTheDocument()
})

test('calls highlightTableCoordsField when a cell is clicked', async () => {
  render(
    <TableField
      initialData={mockTableCells}
      schema={mockTableSchema}
      sheetIndex={1}
    />,
  )

  await userEvent.click(screen.getByText('A1'))

  expect(highlightTableCoordsField).nthCalledWith(1, {
    field: [[0, 0]],
    page: 2,
  })
})
