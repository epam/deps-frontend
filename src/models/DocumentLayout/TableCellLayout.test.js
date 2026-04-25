
import { Point } from '@/models/Point'
import { TableCellLayout } from './TableCellLayout'

describe('TableCellLayout.unmergeCells', () => {
  it('returns unchanged cells for no merged cells', () => {
    const mockCell = new TableCellLayout({
      content: 'Cell Content',
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

    const result = TableCellLayout.unmergeCells([mockCell])

    expect(result).toEqual([mockCell])
  })

  it('unmerges a 2x2 merged cell', () => {
    const mockCell = new TableCellLayout({
      content: 'Cell Content',
      kind: 'kind',
      columnIndex: 0,
      columnSpan: 2,
      rowIndex: 0,
      rowSpan: 2,
      page: 1,
      polygon: [
        new Point(0.111, 0.222),
        new Point(0.333, 0.444),
      ],
    })

    const result = TableCellLayout.unmergeCells([mockCell])

    expect(result).toEqual([
      {
        ...mockCell,
        columnSpan: 1,
        rowSpan: 1,
      },
      {
        ...mockCell,
        content: '',
        rowIndex: 0,
        columnIndex: 1,
        rowSpan: 1,
        columnSpan: 1,
      },
      {
        ...mockCell,
        content: '',
        rowIndex: 1,
        columnIndex: 0,
        rowSpan: 1,
        columnSpan: 1,
      },
      {
        ...mockCell,
        content: '',
        rowIndex: 1,
        columnIndex: 1,
        rowSpan: 1,
        columnSpan: 1,
      },
    ])
  })
})
