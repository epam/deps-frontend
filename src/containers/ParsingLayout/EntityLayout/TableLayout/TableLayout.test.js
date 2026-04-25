
import { mockEnv } from '@/mocks/mockEnv'
import { screen, within } from '@testing-library/react'
import React from 'react'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import {
  TableCellLayout,
  TableLayout,
} from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { render } from '@/utils/rendererRTL'
import { TableLayout as TableLayoutComponent } from './TableLayout'

jest.mock('@/utils/env', () => mockEnv)

const mockCell1 = new TableCellLayout({
  content: 'Cell 1 content',
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
  content: 'Cell 2 content',
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 1,
  rowIndex: 0,
  rowSpan: 1,
  page: 2,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockTable1 = new TableLayout({
  id: 'id1',
  order: 1,
  cells: [mockCell1],
  confidence: 0,
  columnCount: 1,
  rowCount: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockTable2 = new TableLayout({
  id: 'id2',
  order: 1,
  cells: [mockCell2],
  confidence: 0,
  columnCount: 1,
  rowCount: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockData = [
  {
    layout: mockTable1,
    page: 1,
    pageId: 'page-1',
  },
  {
    layout: mockTable2,
    page: 2,
    pageId: 'page-2',
  },
]

const mergedTablesMapping = [
  {
    parentId: mockTable1.id,
    tableId: mockTable2.id,
  },
]

function MockInfiniteScrollLayout ({ setLayout, children }) {
  React.useEffect(() => {
    setLayout(mockData)
  }, [setLayout])
  return children
}

jest.mock('../InfiniteScrollLayout', () => ({
  InfiniteScrollLayout: MockInfiniteScrollLayout,
}))

const mockTableLayoutFieldComponent = jest.fn(({ alignHeightByContent, parsingType, table }) => (
  <div
    data-align-height={alignHeightByContent}
    data-parsing-type={parsingType}
    data-testid={table.id}
  >
    {
      table.cells.map((cell, index) => (
        <span key={index}>
          {cell.content}
        </span>
      ))
    }
  </div>
))

jest.mock('./TableLayoutField', () => ({
  TableLayoutField: (...args) => mockTableLayoutFieldComponent(...args),
}))

test('should render correct layout for separate tables', () => {
  render(
    <TableLayoutComponent
      mergedTables={[]}
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT}
      total={1}
    />,
  )

  const table1 = screen.getByTestId(mockTable1.id)
  const table2 = screen.getByTestId(mockTable2.id)

  expect(table1).toBeInTheDocument()
  expect(screen.getByText(mockCell1.content)).toBeInTheDocument()
  expect(table2).toBeInTheDocument()
  expect(within(table2).getByText(mockCell2.content)).toBeInTheDocument()
  expect(within(table2).queryByText(mockCell1.content)).not.toBeInTheDocument()
})

test('should render correct layout for merged tables', () => {
  render(
    <TableLayoutComponent
      mergedTables={mergedTablesMapping}
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT}
      total={1}
    />,
  )

  const mergedTable = screen.getByTestId(mockTable1.id)
  expect(mergedTable).toBeInTheDocument()
  expect(within(mergedTable).getByText(mockCell1.content)).toBeInTheDocument()
  expect(within(mergedTable).getByText(mockCell2.content)).toBeInTheDocument()
})

test('passes correct props to TableLayoutField for separate tables', () => {
  render(
    <TableLayoutComponent
      mergedTables={[]}
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT}
      total={1}
    />,
  )

  const firstCall = mockTableLayoutFieldComponent.mock.calls[0][0]
  const secondCall = mockTableLayoutFieldComponent.mock.calls[1][0]

  expect(firstCall.table.id).toBe(mockTable1.id)
  expect(firstCall.alignHeightByContent).toBe(false)
  expect(firstCall.parsingType).toBe(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT)

  expect(secondCall.table.id).toBe(mockTable2.id)
  expect(secondCall.alignHeightByContent).toBe(false)
  expect(secondCall.parsingType).toBe(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT)
})

test('enriches table cells with page context', () => {
  render(
    <TableLayoutComponent
      mergedTables={[]}
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT}
      total={1}
    />,
  )

  const firstCall = mockTableLayoutFieldComponent.mock.calls[0][0]
  const cell = firstCall.table.cells[0]

  expect(cell.page).toBe(1)
  expect(cell.initialPosition).toEqual({
    pageId: 'page-1',
    rowIndex: mockCell1.rowIndex,
    columnIndex: mockCell1.columnIndex,
    tableId: mockTable1.id,
  })
})
