
import {
  TableCellLayout,
  TableLayout,
} from '@/models/DocumentLayout'
import { mergeTableChunk } from './mergeTableChunk'

const mockParentId = 'parent-table-id-1'

const mockCell1 = new TableCellLayout({
  content: 'Cell 1 content',
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 1,
  rowIndex: 0,
  rowSpan: 1,
  page: 1,
  polygon: [],
})

const mockCell2 = new TableCellLayout({
  content: 'Cell 2 content',
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 1,
  rowIndex: 0,
  rowSpan: 1,
  page: 1,
  polygon: [],
})

const mockTableChunkCell1 = new TableCellLayout({
  content: 'Cell 3 content',
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 1,
  rowIndex: 0,
  rowSpan: 1,
  page: 1,
  polygon: [],
})

const mockTableChunkCell2 = new TableCellLayout({
  content: 'Cell 4 content',
  kind: 'kind',
  columnIndex: 1,
  columnSpan: 1,
  rowIndex: 0,
  rowSpan: 1,
  page: 1,
  polygon: [],
})

const mockParentTable1 = new TableLayout({
  id: mockParentId,
  order: 1,
  cells: [mockCell1],
  confidence: 0,
  columnCount: 1,
  rowCount: 1,
  polygon: [],
})

const mockParentTable2 = new TableLayout({
  id: 'parent-table-id-2',
  order: 1,
  cells: [mockCell2],
  confidence: 0,
  columnCount: 1,
  rowCount: 1,
  polygon: [],
})

const mockTableChunk = new TableLayout({
  id: 'table-id',
  order: 1,
  cells: [mockTableChunkCell1, mockTableChunkCell2],
  confidence: 0,
  columnCount: 2,
  rowCount: 1,
  polygon: [],
})

test('should return correct result if there is no parent table for chunk', () => {
  const result = mergeTableChunk([], mockTableChunk, mockParentId)

  const expectedResult = [{
    ...mockTableChunk,
    id: mockParentId,
  }]

  expect(result).toEqual(expectedResult)
})

test('should return correct result if there is parent table for chunk', () => {
  const mockTablesList = [
    mockParentTable1,
    mockParentTable2,
  ]

  const result = mergeTableChunk(mockTablesList, mockTableChunk, mockParentId)

  const expectedCells = [
    ...mockParentTable1.cells,
    {
      ...mockTableChunkCell1,
      rowIndex: mockTableChunkCell1.rowIndex + mockParentTable1.rowCount,
      initialPosition: {
        columnIndex: mockTableChunkCell1.columnIndex,
        rowIndex: mockTableChunkCell1.rowIndex,
        tableId: mockTableChunk.id,

      },
    },
    {
      ...mockTableChunkCell2,
      rowIndex: mockTableChunkCell2.rowIndex + mockParentTable1.rowCount,
      initialPosition: {
        columnIndex: mockTableChunkCell2.columnIndex,
        rowIndex: mockTableChunkCell2.rowIndex,
        tableId: mockTableChunk.id,

      },
    },
  ]

  const expectedResult = [
    {
      ...mockParentTable1,
      cells: expectedCells,
      columnCount: mockTableChunk.columnCount,
      rowCount: mockParentTable1.rowCount + mockTableChunk.rowCount,
    },
    mockParentTable2,
  ]

  expect(result).toEqual(expectedResult)
})
