
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLayoutMutation } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { TableCellLayout, TableLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { render } from '@/utils/rendererRTL'
import { TableLayoutField } from './TableLayoutField'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/InView', () => mockShallowComponent('InView'))

jest.mock('@/hocs/withParentSize', () => ({
  withFlexibleParentSize: () => (Component) => Component,
}))

jest.mock('@/containers/ParsingLayout/EntityLayout/hooks', () => ({
  useLayoutMutation: jest.fn(() => ({
    isEditable: true,
    updateTable: mockUpdateTable,
  })),
  useHighlightCoords: jest.fn(() => ({ highlightCoords: mockHighlightCoords })),
}))

jest.mock('./TableLayoutField.styles', () => ({
  StyledHandsonTable: jest.fn(({
    alignHeightByContent,
    contextMenuEnabled,
    data,
    mergeCells,
    onSelectRange,
    propsForUpdate,
    readOnly,
    saveData,
  }) => (
    <div
      data-align-height={alignHeightByContent}
      data-context-menu={contextMenuEnabled}
      data-readonly={readOnly}
      data-testid="handson-table"
    >
      <button
        data-testid="trigger-select-range"
        onClick={
          () => {
            if (onSelectRange) {
              onSelectRange([
                {
                  from:
                {
                  col: 0,
                  row: 0,
                },
                  to:
                {
                  col: 0,
                  row: 0,
                },
                },
              ])
            }
          }
        }
      >
        Select Range
      </button>
      <button
        data-testid="trigger-save-data"
        onClick={() => saveData && saveData(null, null, [[0, 0, 'oldValue', 'newValue']])}
      >
        Save Data
      </button>
      <div data-testid="table-data">{JSON.stringify(data)}</div>
      <div data-testid="table-merge-cells">{JSON.stringify(mergeCells)}</div>
      <div data-testid="table-props-for-update">{JSON.stringify(propsForUpdate)}</div>
    </div>
  )),
}))

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
  initialPosition: {
    rowIndex: 0,
    columnIndex: 0,
    tableId: 'mockTableId',
    pageId: 'mockPageId',
  },
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

const mockUpdateTable = jest.fn().mockResolvedValue({})
const mockHighlightCoords = jest.fn()

const defaultProps = {
  alignHeightByContent: true,
  table: mockTable,
  parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders table field with InView wrapper', () => {
  render(<TableLayoutField {...defaultProps} />)

  const inView = screen.getByTestId('InView')
  expect(inView).toBeInTheDocument()
})

test('renders HandsonTable component', () => {
  render(<TableLayoutField {...defaultProps} />)

  const table = screen.getByTestId('handson-table')
  expect(table).toBeInTheDocument()
})

test('sets readOnly to false when isEditable is true', () => {
  render(<TableLayoutField {...defaultProps} />)

  const table = screen.getByTestId('handson-table')
  expect(table.getAttribute('data-readonly')).toBe('false')
})

test('sets readOnly to true when isEditable is false', () => {
  useLayoutMutation.mockReturnValueOnce({
    isEditable: false,
    updateTable: mockUpdateTable,
  })

  render(<TableLayoutField {...defaultProps} />)

  const table = screen.getByTestId('handson-table')
  expect(table.getAttribute('data-readonly')).toBe('true')
})

test('calls highlightCoords with correct arguments when onSelectRange is called', async () => {
  jest.clearAllMocks()

  render(<TableLayoutField {...defaultProps} />)

  const triggerButton = screen.getByTestId('trigger-select-range')
  await userEvent.click(triggerButton)

  expect(mockHighlightCoords).toHaveBeenCalledWith({
    field: [mockCell.polygon],
    page: mockCell.page,
  })
})

test('calls updateTable with correct data when saveData is called', async () => {
  jest.clearAllMocks()

  render(<TableLayoutField {...defaultProps} />)

  const triggerButton = screen.getByTestId('trigger-save-data')
  await userEvent.click(triggerButton)

  await waitFor(() => {
    expect(mockUpdateTable).toHaveBeenCalledWith({
      pageId: 'mockPageId',
      tableId: 'mockTableId',
      body: {
        cells: [{
          rowIndex: 0,
          columnIndex: 0,
          content: 'newValue',
        }],
      },
    })
  })
})

test('passes alignHeightByContent prop correctly', () => {
  render(
    <TableLayoutField
      {...defaultProps}
      alignHeightByContent={false}
    />,
  )

  const table = screen.getByTestId('handson-table')
  expect(table.getAttribute('data-align-height')).toBe('false')
})

test('passes contextMenuEnabled as false', () => {
  render(<TableLayoutField {...defaultProps} />)

  const table = screen.getByTestId('handson-table')
  expect(table.getAttribute('data-context-menu')).toBe('false')
})
