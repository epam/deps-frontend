
import { TableCell } from '@/models/TabularLayout'
import { mapSelectedRangeToTabularLayoutCell } from './mapSelectedRangeToTabularLayoutCell'

const mockTableCell1 = new TableCell({
  id: 'mockCellId1',
  tableId: 'mockTableId',
  content: 'Mock Content',
  absolutePosition: [0, 0],
  relativePosition: [0, 0],
})

const mockTableCell2 = new TableCell({
  id: 'mockCellId2',
  tableId: 'mockTableId',
  content: 'Mock Content',
  absolutePosition: [1, 1],
  relativePosition: [1, 1],
})

test('returns cells within the range', () => {
  const range = {
    from: {
      row: 1,
      col: 1,
    },
    to: {
      row: 3,
      col: 3,
    },
  }

  const cells = [
    mockTableCell1,
    mockTableCell2,
  ]

  const result = mapSelectedRangeToTabularLayoutCell(cells, range)

  expect(result).toEqual([[1, 1]])
})

test('returns an empty array if no cells are within the range', () => {
  const range = {
    from: {
      row: 2,
      col: 2,
    },
    to: {
      row: 3,
      col: 3,
    },
  }

  const cells = [
    mockTableCell1,
    mockTableCell2,
  ]

  const result = mapSelectedRangeToTabularLayoutCell(cells, range)

  expect(result).toEqual([])
})
