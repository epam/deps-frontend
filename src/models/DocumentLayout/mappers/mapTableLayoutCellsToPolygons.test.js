
import { TableCellLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { mapTableLayoutCellsToPolygons } from './mapTableLayoutCellsToPolygons'

const mockRange = {
  from: {
    row: 0,
    col: 0,
  },
  to: {
    row: 0,
    col: 1,
  },
}

const mockCells = [
  new TableCellLayout({
    content: 'firstCell',
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
  }),
  new TableCellLayout({
    content: 'secondCell',
    kind: 'kind',
    columnIndex: 1,
    columnSpan: 1,
    rowIndex: 0,
    rowSpan: 1,
    page: 1,
    polygon: [
      new Point(0.451, 0.332),
      new Point(0.673, 0.874),
    ],
  }),
  new TableCellLayout({
    content: 'thirdCell',
    kind: 'kind',
    columnIndex: 2,
    columnSpan: 1,
    rowIndex: 0,
    rowSpan: 1,
    page: 1,
    polygon: [
      new Point(0.111, 0.222),
      new Point(0.333, 0.444),
    ],
  }),
]

describe('mapper: mapTableLayoutCellsToPolygons', () => {
  it('should return cells in range', () => {
    const result = mapTableLayoutCellsToPolygons(mockCells, mockRange)

    const cellsInRange = mockCells.slice(0, 2)
    const expectedResult = {
      coords: cellsInRange.map((cell) => cell.polygon),
      page: cellsInRange[0].page,
    }

    expect(result).toEqual(expectedResult)
  })
})
