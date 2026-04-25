
import { mockEnv } from '@/mocks/mockEnv'
import { HTDataProps } from '@/components/HandsonTable'
import { Point } from '@/models/Point'
import { TableCellLayout } from '../TableCellLayout'
import {
  mapTableLayoutCellsToHandsonDataStrings,
} from './mapTableLayoutCellsToHandsonDataStrings'

const mockCells = [
  new TableCellLayout({
    content: 'firstCell',
    kind: 'kind',
    columnIndex: 0,
    columnSpan: 1,
    rowIndex: 0,
    rowSpan: 1,
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
    polygon: [
      new Point(0.111, 0.222),
      new Point(0.333, 0.444),
    ],
  }),
]

jest.mock('@/utils/env', () => mockEnv)

describe('mapper: mapTableLayoutCellsToHandsonDataStrings', () => {
  it('should map table field into HTDataProps', () => {
    const mappedData = mapTableLayoutCellsToHandsonDataStrings({
      cells: mockCells,
      columnCount: mockCells.length,
      rowCount: 1,
    })

    const data = [['firstCell', 'secondCell', 'thirdCell']]
    const mergeCells = []
    const expectedHTDataProps = new HTDataProps(data, mergeCells)

    expect(mappedData).toEqual(expectedHTDataProps)
  })
})
